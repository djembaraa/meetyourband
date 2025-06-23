import axios from "axios";

// URL dasar dari API kita (ingat, kita menggunakan proxy Vite)
const API_URL = "/api/auth/";

// Fungsi untuk mengirim data registrasi
// PASTIKAN NAMA FUNGSI INI SUDAH BENAR
const registerUser = async (userData) => {
  try {
    const response = await axios.post(API_URL + "register", userData);
    return response.data;
  } catch (error) {
    // Melemparkan error agar bisa ditangkap oleh komponen RegisterPage
    throw error.response.data;
  }
};

// Fungsi ini menerima data login (email, password) dan mengirimkannya ke backend
const loginUser = async (userData) => {
  try {
    // Kirim request POST ke endpoint /api/auth/login
    const response = await axios.post(API_URL + "login", userData);

    // Jika berhasil, backend akan mengirim kembali sebuah token
    // Kita kembalikan data respons ini (yang berisi token)
    return response.data;
  } catch (error) {
    // Jika gagal (misal: password salah), lemparkan error dari backend
    throw error.response.data;
  }
};

// Nanti kita akan tambahkan fungsi untuk login di sini
// const loginUser = async (userData) => { ... }

// PASTIKAN NAMA YANG DI-EXPORT SAMA DENGAN NAMA FUNGSI DI ATAS
export { registerUser, loginUser };
