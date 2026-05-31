import assert from "node:assert/strict";
import { after, before, beforeEach, test } from "node:test";
import mongoose from "mongoose";

process.env.MONGODB_URI = "mongodb://127.0.0.1:27017/borrow_test";
process.env.JWT_SECRET = "test-secret";
process.env.CLIENT_URLS = "http://localhost:5173,http://127.0.0.1:5173";

const { connectDb } = await import("../src/config/db.js");
const { User } = await import("../src/models/User.js");
const { Community } = await import("../src/models/Community.js");
const { Membership } = await import("../src/models/Membership.js");
const { Item } = await import("../src/models/Item.js");
const { default: app } = await import("../src/app.js");

let server;
let baseUrl;

before(async () => {
  await connectDb();
  server = app.listen(0);
  baseUrl = `http://127.0.0.1:${server.address().port}/api`;
});

beforeEach(async () => {
  await Promise.all([User.deleteMany({}), Community.deleteMany({}), Membership.deleteMany({}), Item.deleteMany({})]);
});

after(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  await new Promise((resolve) => server.close(resolve));
});

test("contact details stay locked until a non-owner has 3 active items in the same community", async () => {
  const admin = await register("admin");
  const owner = await register("owner");
  const viewer = await register("viewer");
  const { community } = await createCommunity(admin.cookie, { requiredApproval: false });

  await joinCommunity(owner.cookie, community.joinCode);
  await joinCommunity(viewer.cookie, community.joinCode);

  const { item: ownerItem } = await createItem(owner.cookie, community.id, "Owner item");
  const locked = await request("GET", `/items/${ownerItem.id}`, { cookie: viewer.cookie });

  assert.equal(locked.status, 200);
  assert.equal(locked.body.ownerContact, null);
  assert.equal(locked.body.viewer.canViewContact, false);

  await createItem(viewer.cookie, community.id, "Viewer item 1");
  await createItem(viewer.cookie, community.id, "Viewer item 2");
  await createItem(viewer.cookie, community.id, "Viewer item 3");

  const unlocked = await request("GET", `/items/${ownerItem.id}`, { cookie: viewer.cookie });

  assert.equal(unlocked.status, 200);
  assert.equal(unlocked.body.viewer.canViewContact, true);
  assert.equal(unlocked.body.ownerContact.name, "owner");
  assert.equal(unlocked.body.ownerContact.phone, "050-000-0000");
});

test("community admins can see contact details without 3 active items", async () => {
  const admin = await register("admin");
  const owner = await register("owner");
  const { community } = await createCommunity(admin.cookie, { requiredApproval: false });

  await joinCommunity(owner.cookie, community.joinCode);

  const { item } = await createItem(owner.cookie, community.id, "Owner item");
  const response = await request("GET", `/items/${item.id}`, { cookie: admin.cookie });

  assert.equal(response.status, 200);
  assert.equal(response.body.viewer.isCommunityAdmin, true);
  assert.equal(response.body.ownerContact.name, "owner");
});

test("owners never receive their own contact details", async () => {
  const owner = await register("owner");
  const { community } = await createCommunity(owner.cookie, { requiredApproval: false });
  const { item } = await createItem(owner.cookie, community.id, "Owner item");

  const response = await request("GET", `/items/${item.id}`, { cookie: owner.cookie });

  assert.equal(response.status, 200);
  assert.equal(response.body.viewer.isOwner, true);
  assert.equal(response.body.ownerContact, null);
});

test("pending members cannot access community items", async () => {
  const admin = await register("admin");
  const pending = await register("pending");
  const { community } = await createCommunity(admin.cookie, { requiredApproval: true });
  const { item } = await createItem(admin.cookie, community.id, "Admin item");

  await joinCommunity(pending.cookie, community.joinCode);

  const response = await request("GET", `/items/${item.id}`, { cookie: pending.cookie });

  assert.equal(response.status, 403);
});

test("owners cannot reactivate items hidden by community admins", async () => {
  const admin = await register("admin");
  const owner = await register("owner");
  const { community } = await createCommunity(admin.cookie, { requiredApproval: false });

  await joinCommunity(owner.cookie, community.joinCode);

  const { item } = await createItem(owner.cookie, community.id, "Owner item");
  const hidden = await request("DELETE", `/items/${item.id}`, { cookie: admin.cookie });

  assert.equal(hidden.status, 200);
  assert.equal(hidden.body.item.hiddenByAdmin, true);

  const reactivated = await request("PATCH", `/items/${item.id}`, {
    cookie: owner.cookie,
    body: { isActive: true }
  });

  assert.equal(reactivated.status, 403);
});

test("protected demo items cannot be changed", async () => {
  const user = await register("demo-user");
  const { community } = await createCommunity(user.cookie, { requiredApproval: false });
  const { item } = await createItem(user.cookie, community.id, "Demo item");

  await Item.updateOne({ _id: item.id }, { isDemoItem: true });

  const response = await request("PATCH", `/items/${item.id}`, {
    cookie: user.cookie,
    body: { title: "Changed" }
  });

  assert.equal(response.status, 403);
});

async function register(name) {
  const response = await request("POST", "/auth/register", {
    body: {
      name,
      email: `${name}-${Date.now()}-${Math.random()}@borrow.test`,
      password: "password123",
      phone: "050-000-0000"
    }
  });

  assert.equal(response.status, 201);

  return {
    user: response.body.user,
    cookie: response.cookie
  };
}

async function createCommunity(cookie, options = {}) {
  const response = await request("POST", "/communities", {
    cookie,
    body: {
      name: `Community ${Date.now()} ${Math.random()}`,
      description: "Test community",
      requiredApproval: options.requiredApproval ?? false
    }
  });

  assert.equal(response.status, 201);
  return response.body;
}

async function joinCommunity(cookie, joinCode) {
  const response = await request("POST", "/communities/join", {
    cookie,
    body: { joinCode }
  });

  assert.ok(response.status === 200 || response.status === 201);
  return response.body;
}

async function createItem(cookie, communityId, title) {
  const response = await request("POST", "/items", {
    cookie,
    body: {
      title,
      description: "Test item",
      notes: "",
      category: "כלי עבודה",
      condition: "good",
      community: communityId,
      isActive: true
    }
  });

  assert.equal(response.status, 201);
  return response.body;
}

async function request(method, path, options = {}) {
  const headers = {
    Origin: "http://localhost:5173"
  };

  if (options.cookie) {
    headers.Cookie = options.cookie;
  }

  if (options.body) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  const body = await response.json().catch(() => ({}));

  return {
    status: response.status,
    body,
    cookie: response.headers.get("set-cookie")?.split(";")[0] || ""
  };
}
