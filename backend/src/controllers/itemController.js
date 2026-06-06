import { ITEM_CATEGORIES } from "../constants/categories.js";
import { ITEM_CONDITIONS } from "../constants/itemConditions.js";
import { Community } from "../models/Community.js";
import { Item } from "../models/Item.js";
import { getContactAccess } from "../services/contactAccessService.js";
import { deleteCloudinaryImage, uploadImageBuffer } from "../services/cloudinaryService.js";
import { getApprovedMembership, requireCommunityAdmin } from "../services/membershipService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createHttpError } from "../utils/createHttpError.js";
import { mapItemDetail } from "../utils/mapItemDetail.js";

export const createItem = asyncHandler(async (req, res) => {
  const payload = normalizeItemPayload(req.body);
  const membership = await getApprovedMembership(req.user._id, payload.community);

  if (!membership) {
    throw createHttpError(403, "Approved community membership required.");
  }

  const uploadedImages = await uploadFiles(req.files || []);

  try {
    const item = await Item.create({
      ...payload,
      owner: req.user._id,
      images: uploadedImages
    });

    res.status(201).json({ item: mapOwnedItem(item) });
  } catch (error) {
    await Promise.all(uploadedImages.map((image) => deleteCloudinaryImage(image.publicId)));
    throw error;
  }
});

export const getItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.itemId).populate("owner", "name phone");

  if (!item || item.isDeleted) {
    throw createHttpError(404, "Item not found.");
  }

  const access = await getContactAccess({ userId: req.user._id, item });

  if (!access.isApprovedMember) {
    throw createHttpError(403, "Approved community membership required.");
  }

  const ownerId = item.owner._id.toString();
  const isOwner = ownerId === req.user._id.toString();

  if (!item.isActive && !isOwner && !access.isCommunityAdmin) {
    throw createHttpError(404, "Item not found.");
  }

  res.json(mapItemDetail(item, { ...access, userId: req.user._id }));
});

export const updateItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.itemId);

  if (!item || item.isDeleted) {
    throw createHttpError(404, "Item not found.");
  }

  const isOwner = item.owner.toString() === req.user._id.toString();
  const isAdmin = await isCommunityAdmin(req.user._id, item.community);
  const isStatusOnlyUpdate = isOnlyUpdatingStatus(req.body);

  if (item.isDemoItem && !isStatusOnlyUpdate) {
    ensureDemoItemCanBeChanged(item);
  }

  if (!isOwner && !(isAdmin && isStatusOnlyUpdate)) {
    throw createHttpError(403, "Only the item owner can edit this item.");
  }

  const payload = normalizeItemPayload({ ...item.toObject(), ...req.body }, { partial: true });

  if (!isStatusOnlyUpdate) {
    item.title = payload.title ?? item.title;
    item.description = payload.description ?? item.description;
    item.notes = payload.notes ?? item.notes;
    item.category = payload.category ?? item.category;
    item.condition = payload.condition ?? item.condition;
  }

  if (typeof payload.isActive === "boolean") {
    if (payload.isActive) {
      ensureCanReactivateItem(item, { isOwner, isAdmin });
    }

    item.isActive = payload.isActive;
    item.hiddenAt = payload.isActive ? null : new Date();
    item.hiddenBy = payload.isActive ? null : req.user._id;
    item.hiddenByAdmin = payload.isActive ? false : isAdmin && !isOwner;
    item.hiddenReason = payload.isActive ? "" : item.hiddenByAdmin ? "admin-hidden" : "owner-hidden";
  }

  await item.save();
  res.json({ item: mapOwnedItem(item) });
});

export const hideItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.itemId);

  if (!item || item.isDeleted) {
    throw createHttpError(404, "Item not found.");
  }

  const isOwner = item.owner.toString() === req.user._id.toString();

  const isAdmin = await isCommunityAdmin(req.user._id, item.community);
  const shouldHideAsAdmin = req.query.asAdmin === "true";

  if (item.isDemoItem && !isOwner && !isAdmin) {
    throw createHttpError(403, "Protected demo items cannot be hidden.");
  }

  if (shouldHideAsAdmin && !isAdmin) {
    throw createHttpError(403, "Only a community admin can hide an item as admin.");
  }

  if (!isOwner && !isAdmin) {
    throw createHttpError(403, "Only the owner or a community admin can hide this item.");
  }

  item.isActive = false;
  item.hiddenAt = new Date();
  item.hiddenBy = req.user._id;
  item.hiddenByAdmin = shouldHideAsAdmin || (isAdmin && !isOwner);
  item.hiddenReason = item.hiddenByAdmin ? "admin-hidden" : "owner-hidden";

  await item.save();
  res.json({ item: mapOwnedItem(item) });
});

export const deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.itemId);

  if (!item || item.isDeleted) {
    throw createHttpError(404, "Item not found.");
  }

  if (item.owner.toString() !== req.user._id.toString()) {
    throw createHttpError(403, "Only the item owner can delete this item.");
  }

  item.isDeleted = true;
  item.deletedAt = new Date();
  item.deletedBy = req.user._id;
  item.isActive = false;

  await item.save();
  res.json({ item: mapOwnedItem(item) });
});

export const addItemImages = asyncHandler(async (req, res) => {
  const item = await getOwnedItem(req.params.itemId, req.user._id);
  ensureDemoItemCanBeChanged(item);
  const files = req.files || [];

  if (item.images.length + files.length > 3) {
    throw createHttpError(400, "An item can have up to 3 images.");
  }

  const uploadedImages = await uploadFiles(files);
  item.images.push(...uploadedImages);

  try {
    await item.save();
    res.status(201).json({ item: mapOwnedItem(item) });
  } catch (error) {
    await Promise.all(uploadedImages.map((image) => deleteCloudinaryImage(image.publicId)));
    throw error;
  }
});

export const deleteItemImage = asyncHandler(async (req, res) => {
  const item = await getOwnedItem(req.params.itemId, req.user._id);
  ensureDemoItemCanBeChanged(item);
  const image = item.images.find((currentImage) => currentImage.publicId === req.params.publicId);

  if (!image) {
    throw createHttpError(404, "Image not found.");
  }

  item.images = item.images.filter((currentImage) => currentImage.publicId !== req.params.publicId);
  await item.save();
  await deleteCloudinaryImage(image.publicId);

  res.json({ item: mapOwnedItem(item) });
});

export const getMyItems = asyncHandler(async (req, res) => {
  const query = { owner: req.user._id, isDeleted: { $ne: true } };

  if (req.query.communityId) {
    query.community = req.query.communityId;
  }

  const items = await Item.find(query).sort({ createdAt: -1 });
  const communities = await Community.find({
    _id: { $in: [...new Set(items.map((item) => item.community.toString()))] }
  }).select("name");
  const communityNamesById = new Map(communities.map((community) => [community._id.toString(), community.name]));

  res.json({
    items: items.map((item) => mapOwnedItem(item, communityNamesById)),
    activeCountsByCommunity: getActiveCountsByCommunity(items)
  });
});

async function uploadFiles(files) {
  if (files.length === 0) {
    return [];
  }

  if (files.length > 3) {
    throw createHttpError(400, "An item can have up to 3 images.");
  }

  return Promise.all(files.map(uploadImageBuffer));
}

async function getOwnedItem(itemId, userId) {
  const item = await Item.findById(itemId);

  if (!item || item.isDeleted) {
    throw createHttpError(404, "Item not found.");
  }

  if (item.owner.toString() !== userId.toString()) {
    throw createHttpError(403, "Only the item owner can update images.");
  }

  return item;
}

function ensureDemoItemCanBeChanged(item) {
  if (item.isDemoItem) {
    throw createHttpError(403, "Protected demo items cannot be changed.");
  }
}

function ensureCanReactivateItem(item, actor) {
  if (item.hiddenByAdmin || item.hiddenReason === "admin-hidden") {
    if (!actor.isAdmin) {
      throw createHttpError(403, "Only a community admin can reactivate items hidden by an admin.");
    }

    return;
  }

  if (item.hiddenReason === "owner-hidden") {
    if (!actor.isOwner) {
      throw createHttpError(403, "Only the item owner can reactivate items hidden by the owner.");
    }
  }
}

function isOnlyUpdatingStatus(payload) {
  const keys = Object.keys(payload || {});
  return keys.length === 1 && keys[0] === "isActive";
}

async function isCommunityAdmin(userId, communityId) {
  try {
    await requireCommunityAdmin(userId, communityId);
    return true;
  } catch {
    return false;
  }
}

function normalizeItemPayload(payload, options = {}) {
  const normalized = {};

  if (!options.partial || payload.title !== undefined) {
    normalized.title = String(payload.title || "").trim();

    if (!normalized.title) {
      throw createHttpError(400, "Item title is required.");
    }
  }

  if (!options.partial || payload.community !== undefined) {
    normalized.community = payload.community;

    if (!normalized.community) {
      throw createHttpError(400, "Community is required.");
    }
  }

  if (!options.partial || payload.category !== undefined) {
    normalized.category = payload.category;

    if (!ITEM_CATEGORIES.includes(normalized.category)) {
      throw createHttpError(400, "Invalid item category.");
    }
  }

  if (!options.partial || payload.condition !== undefined) {
    normalized.condition = payload.condition;

    if (!ITEM_CONDITIONS.includes(normalized.condition)) {
      throw createHttpError(400, "Invalid item condition.");
    }
  }

  if (payload.description !== undefined) {
    normalized.description = String(payload.description || "").trim();
  }

  if (payload.notes !== undefined) {
    normalized.notes = String(payload.notes || "").trim();
  }

  if (payload.isActive !== undefined) {
    normalized.isActive = payload.isActive === true || payload.isActive === "true";
  }

  return normalized;
}

function getActiveCountsByCommunity(items) {
  return items.reduce((counts, item) => {
    const communityId = item.community.toString();

    if (!counts[communityId]) {
      counts[communityId] = 0;
    }

    if (item.isActive) {
      counts[communityId] += 1;
    }

    return counts;
  }, {});
}

function mapOwnedItem(item, communityNamesById = new Map()) {
  const communityId = item.community.toString();

  return {
    id: item._id.toString(),
    title: item.title,
    description: item.description,
    notes: item.notes,
    condition: item.condition,
    category: item.category,
    community: communityId,
    communityName: communityNamesById.get(communityId) || "",
    owner: item.owner.toString(),
    images: item.images,
    imageUrl: item.images[0]?.url || "",
    isActive: item.isActive,
    hiddenByAdmin: item.hiddenByAdmin,
    hiddenReason: item.hiddenReason,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt
  };
}
