import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ route: "admin", status: "not implemented yet" });
});

export default router;
