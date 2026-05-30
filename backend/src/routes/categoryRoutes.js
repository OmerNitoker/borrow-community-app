import express from "express";
import { ITEM_CATEGORIES } from "../constants/categories.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ categories: ITEM_CATEGORIES });
});

export default router;
