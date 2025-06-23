import multer from "multer";
import path from "path";

// Konfigurasi penyimpanan untuk Multer
const storage = multer.diskStorage({
  // Menentukan folder tujuan untuk menyimpan file
  destination: function (req, file, cb) {
    // Pastikan Anda sudah membuat folder 'uploads' di dalam 'server'
    cb(null, "server/uploads/");
  },
  // Menentukan nama file yang akan disimpan
  filename: function (req, file, cb) {
    // Membuat nama unik: timestamp-namafileasli
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

// Fungsi untuk memfilter jenis file yang diizinkan
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("video/")
  ) {
    cb(null, true); // Terima file
  } else {
    cb(new Error("Jenis file tidak diizinkan! Hanya gambar dan video."), false); // Tolak file
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 50, // Batas ukuran file: 50MB
  },
});

export default upload;
