import express from "express";
import cors from "cors";
import "dotenv/config";
import passport from "passport";
import session from "express-session";
import path from "path"; // Impor 'path' untuk menangani path direktori
import { fileURLToPath } from "url"; // Impor untuk __dirname di ES Modules

// Impor Konfigurasi dan Rute
import "./server/config/passport-setup.js";
import authRoutes from "./server/routes/auth.js";
import postRoutes from "./server/routes/posts.js";
import profileRoutes from "./server/routes/profile.js";

// Setup __dirname untuk ES Modules agar path statis bekerja dengan benar
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// --- PENTING: Sajikan file dari folder 'uploads' secara statis ---
// Ini membuat URL seperti http://localhost:3000/uploads/namafile.jpg bisa diakses dari browser
app.use("/uploads", express.static(path.join(__dirname, "/server/uploads")));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/profile", profileRoutes);

app.listen(port, () => {
  console.log(`[server] Server backend berjalan di http://localhost:${port}`);
});
