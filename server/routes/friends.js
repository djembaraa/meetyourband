import express from "express";
import pool from "../../db.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// GET api/friend ambil daftar teman yang sudah acc
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { id: userId } = req.user;
  } catch (err) {}
});
