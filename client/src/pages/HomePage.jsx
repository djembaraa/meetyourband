import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/authcontex";

// Impor komponen dan service yang kita butuhkan
import CreatePostForm from "../component/CreatePostFrom";
import PostCard from "../component/PostCard";
import { getAllPosts } from "../services/postService";

function HomePage() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  // Fungsi untuk mengambil semua postingan dari backend
  const fetchPosts = async () => {
    // Jangan coba fetch jika user belum ada (untuk mencegah error token)
    if (!user) return;

    try {
      setError(null); // Bersihkan error lama setiap kali mencoba fetch
      const token = localStorage.getItem("token");
      const data = await getAllPosts(token);
      setPosts(data); // Simpan data postingan ke dalam state
    } catch (err) {
      setError("Gagal memuat postingan. Coba muat ulang halaman.");
      console.error(err);
    }
  };

  // Mengambil data saat komponen pertama kali dimuat atau saat user berubah
  useEffect(() => {
    fetchPosts();
  }, [user]);

  // Fungsi ini menerima data postingan baru dari CreatePostForm
  const handlePostCreated = (newPost) => {
    // Tambahkan postingan baru ke bagian ATAS dari daftar
    setPosts([newPost, ...posts]);
  };

  // Fungsi untuk menangani update postingan secara lokal
  const handlePostUpdated = (updatedPost) => {
    // Ganti postingan lama dengan versi baru di dalam state
    setPosts(posts.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
  };

  // Fungsi untuk menangani delete postingan secara lokal
  const handlePostDeleted = (deletedPostId) => {
    // Filter daftar postingan, kembalikan semua KECUALI yang ID-nya cocok
    setPosts(posts.filter((p) => p.id !== deletedPostId));
  };

  return (
    // Kontainer konten yang akan ditampilkan di dalam layout App.jsx
    <div className="p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        <CreatePostForm onPostCreated={handlePostCreated} />

        {error && <p className="text-red-500 text-center my-4">{error}</p>}

        <div className="mt-8 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
            Feed
          </h2>
          {posts.length === 0 && !error ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <p className="text-gray-500">
                Belum ada postingan. Jadilah yang pertama!
              </p>
            </div>
          ) : (
            // Berikan semua fungsi handler sebagai props ke setiap PostCard
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onPostUpdated={handlePostUpdated}
                onPostDeleted={handlePostDeleted}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
