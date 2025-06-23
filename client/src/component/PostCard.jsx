import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/authcontex.jsx";
import {
  toggleLikePost,
  addComment,
  updatePost,
  deletePost,
} from "../services/postService.js";

const SERVER_URL = "http://localhost:3000";

// Fungsi helper yang aman untuk memformat tanggal
const formatDate = (dateString) => {
  if (!dateString) return "Baru saja";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleString("id-ID", options);
  } catch (error) {
    return "Invalid Date";
  }
};

// Komponen menerima prop baru: onPostDeleted dan onPostUpdated
function PostCard({ post, onPostDeleted, onPostUpdated }) {
  const { user } = useContext(AuthContext);

  // State untuk interaksi
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  // State untuk fitur edit
  const [isEditing, setIsEditing] = useState(false);
  const [editedPost, setEditedPost] = useState({
    title: post.title || "",
    body: post.body || "",
    location: post.location || "",
    instrument_needed: post.instrument_needed || "",
    category: post.category || "Diskusi Umum",
  });
  const [error, setError] = useState("");

  // Mengisi semua state saat komponen dimuat atau 'post' berubah
  useEffect(() => {
    setLikeCount(parseInt(post.like_count) || 0);
    setIsLiked(post.is_liked_by_me || false);
    setComments(post.comments || []);
    setEditedPost({
      title: post.title || "",
      body: post.body || "",
      location: post.location || "",
      instrument_needed: post.instrument_needed || "",
      category: post.category || "Diskusi Umum",
    });
  }, [post]);

  const handleLike = async () => {
    if (!user) return alert("Anda harus login untuk like.");
    try {
      const token = localStorage.getItem("token");
      await toggleLikePost(post.id, token);
      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    } catch (error) {
      console.error("Gagal melakukan like/unlike:", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    try {
      const token = localStorage.getItem("token");
      const commentData = { content: newComment };
      const savedComment = await addComment(post.id, commentData, token);
      setComments([...comments, savedComment]);
      setNewComment("");
    } catch (error) {
      console.error("Gagal mengirim komentar:", error);
    }
  };

  const handleEditChange = (e) => {
    setEditedPost({ ...editedPost, [e.target.name]: e.target.value });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const token = localStorage.getItem("token");
      // Kirim semua data dari state 'editedPost'
      await updatePost(post.id, editedPost, token);

      // Beri tahu HomePage tentang data baru untuk update UI instan
      if (onPostUpdated) {
        onPostUpdated({ ...post, ...editedPost });
      }
      setIsEditing(false); // Keluar dari mode edit
    } catch (err) {
      console.error("Gagal mengupdate postingan:", err);
      setError("Gagal menyimpan perubahan.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus postingan ini?")) {
      try {
        const token = localStorage.getItem("token");
        await deletePost(post.id, token);
        // Kirim sinyal ke HomePage untuk menghapus post dari feed
        if (onPostDeleted) {
          onPostDeleted(post.id);
        }
      } catch (err) {
        console.error("Gagal menghapus postingan:", err);
        setError("Gagal menghapus postingan.");
      }
    }
  };

  const isVideo = (url) =>
    url?.toLowerCase().endsWith(".mp4") || url?.toLowerCase().endsWith(".webm");

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full flex-shrink-0 mr-4 bg-gray-200">
            {post.profile_picture_url ? (
              <img
                src={
                  post.profile_picture_url.startsWith("http")
                    ? post.profile_picture_url
                    : `${SERVER_URL}${post.profile_picture_url}`
                }
                alt={post.username}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-indigo-200 rounded-full flex items-center justify-center font-bold text-indigo-600 text-xl">
                {post.username?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <p className="font-bold text-gray-900">{post.username}</p>
            <p className="text-xs text-gray-500">
              {formatDate(post.created_at)}
            </p>
          </div>
        </div>

        {user && user.id === post.user_id && !isEditing && (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-500 hover:text-blue-500 text-sm font-medium p-1 rounded"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="text-gray-500 hover:text-red-500 text-sm font-medium p-1 rounded"
            >
              Hapus
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleUpdateSubmit} className="space-y-3">
          <input
            type="text"
            name="title"
            value={editedPost.title}
            onChange={handleEditChange}
            className="w-full p-2 border border-gray-300 rounded-md font-bold"
          />
          <textarea
            name="body"
            value={editedPost.body}
            onChange={handleEditChange}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
            rows="4"
          />
          <div className="flex gap-4">
            <input
              type="text"
              name="location"
              placeholder="Lokasi"
              value={editedPost.location}
              onChange={handleEditChange}
              className="flex-1 p-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              name="instrument_needed"
              placeholder="Instrumen Dicari"
              value={editedPost.instrument_needed}
              onChange={handleEditChange}
              className="flex-1 p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="category"
              className="text-sm font-medium text-gray-700"
            >
              Kategori
            </label>
            <select
              name="category"
              value={editedPost.category}
              onChange={handleEditChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            >
              <option value="Diskusi Umum">Diskusi Umum</option>
              <option value="Mencari Musisi">Mencari Musisi</option>
              <option value="Pamer Karya">Pamer Karya</option>
            </select>
          </div>
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-sm bg-gray-200 py-1 px-3 rounded-md hover:bg-gray-300"
            >
              Batal
            </button>
            <button
              type="submit"
              className="text-sm bg-indigo-600 text-white py-1 px-3 rounded-md hover:bg-indigo-700"
            >
              Simpan
            </button>
          </div>
        </form>
      ) : (
        <>
          <h2 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h2>
          {post.body && (
            <p className="text-gray-700 mb-4 whitespace-pre-wrap">
              {post.body}
            </p>
          )}
          {post.media_url && (
            <div className="my-4 rounded-lg overflow-hidden border">
              {isVideo(post.media_url) ? (
                <video
                  controls
                  className="w-full max-h-96 object-cover bg-black"
                >
                  <source
                    src={`${SERVER_URL}${post.media_url}`}
                    type="video/mp4"
                  />
                </video>
              ) : (
                <img
                  src={`${SERVER_URL}${post.media_url}`}
                  alt="Post media"
                  className="w-full max-h-96 object-cover"
                />
              )}
            </div>
          )}
        </>
      )}

      <div className="flex flex-wrap gap-2 my-4">
        {post.location && (
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">
            📍 {post.location}
          </span>
        )}
        {post.instrument_needed && (
          <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full">
            🎸 {post.instrument_needed}
          </span>
        )}
      </div>

      <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
        <span>{likeCount} Likes</span>
        <button
          onClick={() => setShowComments(!showComments)}
          className="hover:underline"
        >
          {comments.length} Comments
        </button>
      </div>
      <hr />

      <div className="flex justify-around py-1 text-gray-600 font-semibold">
        <button
          onClick={handleLike}
          className={`flex-1 flex items-center justify-center gap-2 text-center py-2 rounded-lg hover:bg-gray-100 ${
            isLiked ? "text-indigo-600 font-bold" : "text-gray-600"
          }`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
          </svg>
          Like
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex-1 flex items-center justify-center gap-2 text-center py-2 rounded-lg hover:bg-gray-100"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            ></path>
          </svg>
          Comment
        </button>
      </div>

      {showComments && (
        <>
          <hr />
          <div className="mt-4 space-y-3">
            {user && (
              <form onSubmit={handleCommentSubmit} className="flex gap-2">
                <input
                  type="text"
                  className="flex-grow bg-gray-100 rounded-full px-4 py-2"
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-full font-semibold"
                >
                  Post
                </button>
              </form>
            )}
            {comments.map((comment) => (
              <div key={comment.id} className="bg-gray-50 p-2 rounded-lg">
                <p className="font-semibold text-sm">{comment.username}</p>
                <p className="text-sm">{comment.content}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default PostCard;
