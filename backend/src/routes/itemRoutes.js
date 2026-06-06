import express from "express";
import {
  addItemImages,
  createItem,
  deleteItem,
  deleteItemImage,
  getItem,
  hideItem,
  updateItem
} from "../controllers/itemController.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { uploadItemImages } from "../middleware/upload.js";

const router = express.Router();

router.post("/", requireAuth, uploadItemImages.array("images", 3), createItem);
router.get("/:itemId", requireAuth, getItem);
router.patch("/:itemId", requireAuth, updateItem);
router.delete("/:itemId/delete", requireAuth, deleteItem);
router.delete("/:itemId", requireAuth, hideItem);
router.post("/:itemId/images", requireAuth, uploadItemImages.array("images", 3), addItemImages);
router.delete("/:itemId/images/:publicId(*)", requireAuth, deleteItemImage);

export default router;
