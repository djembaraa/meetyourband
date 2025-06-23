import axios from "axios";

// Alamat dasar untuk API profil kita
const API_URL = "/api/profile/";

/**
 * Fungsi untuk mendapatkan data profil PENGGUNA LAIN berdasarkan ID.
 * Tidak butuh token karena profil bersifat publik.
 * @param {string} userId - ID dari pengguna yang profilnya ingin dilihat.
 */
const getUserProfile = async (userId) => {
  try {
    // Kirim request GET ke /api/profile/:id
    const response = await axios.get(`${API_URL}${userId}`);
    return response.data;
  } catch (error) {
    console.error("Gagal mengambil profil pengguna:", error);
    throw error.response?.data || "Gagal mengambil profil";
  }
};

/**
 * Fungsi untuk mengupdate profil PENGGUNA YANG LOGIN.
 * @param {FormData} formData - Data profil baru, termasuk file gambar.
 * @param {string} token - Token JWT untuk otorisasi.
 */
const updateMyProfile = async (formData, token) => {
  const config = {
    headers: {
      "x-auth-token": token,
      "Content-Type": "multipart/form-data",
    },
  };
  try {
    // Request PUT dikirim ke /api/profile/me
    const response = await axios.put(API_URL + "me", formData, config);
    return response.data;
  } catch (error) {
    console.error("Gagal mengupdate profil:", error);
    throw error.response?.data || "Gagal mengupdate profil";
  }
};

/**
 * Fungsi untuk mendapatkan semua postingan dari seorang pengguna berdasarkan ID.
 * @param {string} userId - ID dari pengguna yang postingannya ingin dilihat.
 */
const getUserPosts = async (userId) => {
  try {
    // Kirim request GET ke /api/profile/:id/posts
    const response = await axios.get(`${API_URL}${userId}/posts`);
    return response.data;
  } catch (error) {
    console.error("Gagal mengambil postingan pengguna:", error);
    throw error.response?.data || "Gagal mengambil postingan pengguna";
  }
};

// Pastikan semua fungsi diekspor dengan benar
export { getUserProfile, updateMyProfile, getUserPosts };
