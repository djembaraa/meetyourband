import axios from "axios";

const API_URL = "/api/posts/";

// Fungsi untuk mengambil semua postingan
const getAllPosts = async (token) => {
  const config = { headers: { "x-auth-token": token } };
  try {
    const response = await axios.get(API_URL, config);
    return response.data;
  } catch (error) {
    console.error("Error saat mengambil semua postingan:", error);
    throw error.response?.data || "Terjadi kesalahan pada server.";
  }
};

// Fungsi untuk membuat postingan baru
const createPost = async (formData, token) => {
  const config = {
    headers: { "x-auth-token": token, "Content-Type": "multipart/form-data" },
  };
  try {
    const response = await axios.post(API_URL, formData, config);
    return response.data;
  } catch (error) {
    console.error("Error saat membuat postingan:", error);
    throw error.response?.data || "Terjadi kesalahan pada server.";
  }
};

// Fungsi untuk like/unlike
const toggleLikePost = async (postId, token) => {
  const config = { headers: { "x-auth-token": token } };
  try {
    const response = await axios.post(`${API_URL}${postId}/like`, null, config);
    return response.data;
  } catch (error) {
    console.error("Error saat proses like:", error);
    throw error.response?.data || "Terjadi kesalahan pada server.";
  }
};

// Fungsi untuk menambah komentar
const addComment = async (postId, commentData, token) => {
  const config = { headers: { "x-auth-token": token } };
  try {
    const response = await axios.post(
      `${API_URL}${postId}/comments`,
      commentData,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error saat menambah komentar:", error);
    throw error.response?.data || "Terjadi kesalahan pada server.";
  }
};

// --- FUNGSI BARU UNTUK UPDATE POSTINGAN ---
const updatePost = async (postId, postData, token) => {
  const config = { headers: { "x-auth-token": token } };
  try {
    // Kirim request PUT ke /api/posts/:id
    const response = await axios.put(`${API_URL}${postId}`, postData, config);
    return response.data;
  } catch (error) {
    console.error("Error saat mengupdate postingan:", error);
    throw error.response?.data || "Terjadi kesalahan pada server.";
  }
};

// --- FUNGSI BARU UNTUK DELETE POSTINGAN ---
const deletePost = async (postId, token) => {
  const config = { headers: { "x-auth-token": token } };
  try {
    // Kirim request DELETE ke /api/posts/:id
    const response = await axios.delete(`${API_URL}${postId}`, config);
    return response.data;
  } catch (error) {
    console.error("Error saat menghapus postingan:", error);
    throw error.response?.data || "Terjadi kesalahan pada server.";
  }
};

// Export semua fungsi, termasuk yang baru
export {
  getAllPosts,
  createPost,
  toggleLikePost,
  addComment,
  updatePost,
  deletePost,
};
