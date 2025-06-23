import express from "express";
import pool from "../../db.js";
import authMiddleware from "../middleware/auth.js";
import upload from "../routes/upload.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// [GET] - Mendapatkan profil PENGGUNA YANG LOGIN
// Alamat: GET /api/profile/me
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const profile = await pool.query(
      "SELECT id, username, email, bio, main_instrument, other_instruments, current_status, profile_picture_url FROM users WHERE id = $1",
      [req.user.id]
    );
    if (profile.rows.length === 0) {
      return res.status(404).json({ msg: "Profil tidak ditemukan" });
    }
    res.json(profile.rows[0]);
  } catch (err) {
    console.error("Error saat mengambil profil (me):", err.message);
    res.status(500).send("Server Error");
  }
});

// [GET] - Mendapatkan profil PENGGUNA LAIN berdasarkan ID
// Alamat: GET /api/profile/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await pool.query(
      "SELECT id, username, email, bio, main_instrument, other_instruments, current_status, profile_picture_url FROM users WHERE id = $1",
      [id]
    );
    if (profile.rows.length === 0) {
      return res.status(404).json({ msg: "Profil tidak ditemukan" });
    }
    res.json(profile.rows[0]);
  } catch (err) {
    console.error("Error saat mengambil profil by id:", err.message);
    res.status(500).send("Server Error");
  }
});

// [UPDATE] - Memperbarui profil pengguna yang sedang login
// Alamat: PUT /api/profile/me
router.put(
  "/me",
  authMiddleware,
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      const { id: userId } = req.user;
      const {
        username,
        bio,
        main_instrument,
        other_instruments,
        current_status,
      } = req.body;

      const oldProfile = await pool.query(
        "SELECT profile_picture_url FROM users WHERE id = $1",
        [userId]
      );
      let profilePictureUrl = oldProfile.rows[0].profile_picture_url;

      if (req.file) {
        profilePictureUrl = `/uploads/${req.file.filename}`;
      }

      const updateQuery = await pool.query(
        `UPDATE users 
       SET username = $1, bio = $2, main_instrument = $3, other_instruments = $4, current_status = $5, profile_picture_url = $6 
       WHERE id = $7 
       RETURNING id, username, email, bio, main_instrument, other_instruments, current_status, profile_picture_url`,
        [
          username,
          bio,
          main_instrument,
          other_instruments,
          current_status,
          profilePictureUrl,
          userId,
        ]
      );

      const updatedUser = updateQuery.rows[0];

      const payload = {
        user: {
          id: updatedUser.id,
          username: updatedUser.username,
          profile_picture_url: updatedUser.profile_picture_url,
        },
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.json({ user: updatedUser, token: token });
    } catch (err) {
      console.error("Error saat update profil:", err.message);
      res.status(500).send("Server Error");
    }
  }
);

// [GET POSTS] - Mengambil semua postingan dari satu pengguna
// Alamat: GET /api/profile/:id/posts
router.get("/:id/posts", async (req, res) => {
  try {
    const { id: userId } = req.params;

    const userPosts = await pool.query(
      `SELECT 
                posts.*, 
                users.username,
                users.profile_picture_url,
                (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id)::int AS like_count,
                (SELECT COUNT(*) FROM comments WHERE comments.post_id = posts.id)::int AS comment_count
            FROM posts 
            JOIN users ON posts.user_id = users.id 
            WHERE posts.user_id = $1
            ORDER BY posts.created_at DESC`,
      [userId]
    );

    res.json(userPosts.rows);
  } catch (err) {
    console.error("Error saat mengambil postingan pengguna:", err.message);
    res.status(500).send("SERVER ERROR");
  }
});

export default router;
