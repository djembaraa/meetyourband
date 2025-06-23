import express from "express";
import pool from "../../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";

const router = express.Router();

// --- Rute Registrasi Biasa ---
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validasi input
    if (!username || !email || !password) {
      return res.status(400).json("Semua field harus diisi");
    }

    // Cek apakah email sudah ada
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (user.rows.length > 0) {
      return res.status(401).json("Email sudah terdaftar.");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Simpan user baru ke database
    const newUser = await pool.query(
      'INSERT INTO users (username, email, "password") VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
    );

    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    console.error("Error saat registrasi:", err.message);
    res.status(500).send("Server Error");
  }
});

// --- Rute Login Biasa ---
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (userResult.rows.length === 0) {
      return res.status(401).json("Kombinasi email & password salah");
    }

    const user = userResult.rows[0];

    if (!user.password) {
      return res
        .status(401)
        .json(
          "Akun ini terdaftar melalui Google. Silakan login dengan Google."
        );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json("Kombinasi email & password salah");
    }

    // Menambahkan profile_picture_url ke payload JWT
    const payload = {
      user: {
        id: user.id,
        username: user.username,
        profile_picture_url: user.profile_picture_url,
      },
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// --- Rute Otentikasi Google ---
// 1. Rute untuk memulai proses login Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// 2. Rute Callback setelah login di Google berhasil
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
    session: false, // Kita gunakan JWT, bukan session passport
  }),
  (req, res) => {
    // Menambahkan profile_picture_url ke payload JWT
    const payload = {
      user: {
        id: req.user.id,
        username: req.user.username,
        profile_picture_url: req.user.profile_picture_url,
      },
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    // Redirect kembali ke frontend dengan membawa token
    res.redirect(`http://localhost:5173/auth/callback?token=${token}`);
  }
);

export default router;
