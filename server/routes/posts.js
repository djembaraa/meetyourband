import express from "express";
import pool from "../../db.js";
import authMiddleware from "../middleware/auth.js";
import upload from "../routes/upload.js";

const router = express.Router();

// [CREATE] - POST /api/posts/
router.post("/", authMiddleware, upload.single("media"), async (req, res) => {
  try {
    const { id: userId, username } = req.user;
    const { title, body, category, location, instrument_needed } = req.body;

    let mediaUrl = null;
    if (req.file) {
      mediaUrl = `/uploads/${req.file.filename}`;
    }

    if (!body && !mediaUrl) {
      return res.status(400).json("Postingan harus berisi teks atau media.");
    }

    // Langkah 1: Simpan postingan baru dan dapatkan ID-nya
    const newPostQuery = await pool.query(
      `INSERT INTO posts (user_id, title, body, media_url, category, location, instrument_needed) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [
        userId,
        title || `Postingan oleh ${username}`,
        body,
        mediaUrl,
        category || "Diskusi Umum",
        location,
        instrument_needed,
      ]
    );

    const newPostId = newPostQuery.rows[0].id;

    // Langkah 2: Ambil kembali data postingan yang BARU dibuat LENGKAP dengan JOIN
    const finalPostQuery = await pool.query(
      `SELECT posts.*, users.username, users.profile_picture_url 
         FROM posts 
         JOIN users ON posts.user_id = users.id 
         WHERE posts.id = $1`,
      [newPostId]
    );

    // Langkah 3: Kirim data yang sudah lengkap ke frontend
    res.status(201).json(finalPostQuery.rows[0]);
  } catch (err) {
    console.error("ERROR saat membuat postingan:", err.message);
    res.status(500).send("SERVER ERROR");
  }
});

// [READ ALL] - GET /api/posts/
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { id: userId } = req.user;

    // Query ini sekarang juga mengecek apakah pengguna yang login sudah me-like setiap post
    const allPosts = await pool.query(
      `SELECT 
        posts.*, 
        users.username,
        users.profile_picture_url,
        (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id)::int AS like_count,
        (SELECT COUNT(*) FROM comments WHERE comments.post_id = posts.id)::int AS comment_count,
        EXISTS(SELECT 1 FROM likes WHERE likes.post_id = posts.id AND likes.user_id = $1) AS is_liked_by_me
      FROM posts 
      JOIN users ON posts.user_id = users.id 
      ORDER BY posts.created_at DESC`,
      [userId]
    );
    res.json(allPosts.rows);
  } catch (err) {
    console.error("ERROR saat mengambil semua postingan:", err.message);
    res.status(500).send("SERVER ERROR");
  }
});

// [READ ONE] - GET /api/posts/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const postResult = await pool.query(
      `SELECT posts.*, users.username, users.profile_picture_url FROM posts 
       JOIN users ON posts.user_id = users.id WHERE posts.id = $1`,
      [id]
    );

    if (postResult.rows.length === 0) {
      return res.status(404).json({ message: "Postingan tidak ditemukan" });
    }

    const commentsResult = await pool.query(
      `SELECT comments.*, users.username, users.profile_picture_url FROM comments 
       JOIN users ON comments.user_id = users.id
       WHERE comments.post_id = $1 ORDER BY comments.created_at ASC`,
      [id]
    );
    const postData = postResult.rows[0];
    postData.comments = commentsResult.rows;

    res.json(postData);
  } catch (err) {
    console.error("ERROR saat mengambil satu postingan:", err.message);
    res.status(500).send("SERVER ERROR");
  }
});

// [UPDATE] - PUT /api/posts/:id
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id: postsId } = req.params;
    const { id: userId } = req.user;
    const { title, body, category, location, instrument_needed } = req.body;

    const post = await pool.query("SELECT * FROM posts WHERE id = $1", [
      postsId,
    ]);

    if (post.rows.length === 0) {
      return res.status(404).json({ message: "Postingan tidak ditemukan" });
    }

    if (post.rows[0].user_id !== userId) {
      return res.status(403).json({
        message: "Anda tidak punya izin untuk mengupdate postingan ini",
      });
    }

    await pool.query(
      `UPDATE posts SET title = $1, body = $2, category = $3, location = $4, instrument_needed = $5 WHERE id = $6`,
      [title, body, category, location, instrument_needed, postsId]
    );

    res.json({ message: "Postingan berhasil di-update" });
  } catch (err) {
    console.error("ERROR saat mengupdate postingan:", err.message);
    res.status(500).send("SERVER ERROR");
  }
});

// [DELETE] - DELETE /api/posts/:id
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id: postsId } = req.params;
    const { id: userId } = req.user;

    const post = await pool.query("SELECT user_id FROM posts WHERE id = $1", [
      postsId,
    ]);

    if (post.rows.length === 0) {
      return res.status(404).json({ message: "Postingan tidak ditemukan" });
    }

    if (post.rows[0].user_id !== userId) {
      return res.status(403).json({
        message: "Anda tidak punya izin untuk menghapus postingan ini",
      });
    }

    await pool.query("DELETE FROM posts WHERE id = $1", [postsId]);

    res.json({ message: "Postingan berhasil dihapus" });
  } catch (err) {
    console.error("ERROR saat menghapus postingan:", err.message);
    res.status(500).send("SERVER ERROR");
  }
});

// [CREATE COMMENT] - POST /api/posts/:id/comments
router.post("/:id/comments", authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    const { id: postId } = req.params;
    const { id: userId } = req.user;

    if (!content) {
      return res.status(400).json({ message: "Komentar tidak boleh kosong." });
    }

    const newCommentQuery = await pool.query(
      `INSERT INTO comments (content, post_id, user_id) VALUES ($1, $2, $3) RETURNING id`,
      [content, postId, userId]
    );

    const newCommentId = newCommentQuery.rows[0].id;

    const commentWithUser = await pool.query(
      `SELECT comments.*, users.username, users.profile_picture_url FROM comments 
       JOIN users ON comments.user_id = users.id WHERE comments.id = $1`,
      [newCommentId]
    );

    res.status(201).json(commentWithUser.rows[0]);
  } catch (err) {
    console.error("Error saat menambah komentar:", err.message);
    res.status(500).send("SERVER ERROR");
  }
});

// [TOGGLE LIKE] - POST /api/posts/:id/like
router.post("/:id/like", authMiddleware, async (req, res) => {
  try {
    const { id: postId } = req.params;
    const { id: userId } = req.user;

    const existingLike = await pool.query(
      "SELECT * FROM likes WHERE user_id = $1 AND post_id = $2",
      [userId, postId]
    );

    if (existingLike.rows.length > 0) {
      await pool.query(
        "DELETE FROM likes WHERE user_id = $1 AND post_id = $2",
        [userId, postId]
      );
      res.json({ message: "Like dihapus.", liked: false });
    } else {
      await pool.query("INSERT INTO likes (user_id, post_id) VALUES ($1, $2)", [
        userId,
        postId,
      ]);
      res.json({ message: "Postingan di-like.", liked: true });
    }
  } catch (err) {
    console.error("Error saat proses like:", err.message);
    res.status(500).send("SERVER ERROR");
  }
});

export default router;
