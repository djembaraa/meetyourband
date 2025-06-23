// server/middleware/auth.js
import jwt from "jsonwebtoken";
import "dotenv/config";

export default function (req, res, next) {
  // 1. Ambil token dari header permintaan
  const token = req.header("x-auth-token");

  // 2. Cek jika tidak ada token
  if (!token) {
    return res.status(401).json({ message: "Akses ditolak. Tidak ada token." });
  }

  // 3. Jika ada token, verifikasi
  try {
    // Membongkar token menggunakan secret key kita
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Menempelkan payload dari token ke object request
    req.user = decoded.user;

    // Lanjutkan ke proses selanjutnya (ke endpoint tujuan)
    next();
  } catch (err) {
    // Jika token tidak valid
    res.status(401).json({ msg: "Token tidak valid." });
  }
}
