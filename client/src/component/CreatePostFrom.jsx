import React, { useState, useContext } from "react";
import { AuthContext } from "../context/authcontex";
import { createPost } from "../services/postService";

function CreatePostForm({ onPostCreated }) {
  const { user } = useContext(AuthContext);

  // --- STATE BARU UNTUK JUDUL ---
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [location, setLocation] = useState("");
  const [instrument, setInstrument] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validasi sekarang juga mengecek judul
    if (!title.trim() && !body.trim() && !mediaFile) {
      setError("Postingan harus memiliki judul, teks, atau media.");
      return;
    }
    setError("");

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      // Tambahkan semua data, termasuk judul
      formData.append("title", title);
      formData.append("body", body);
      formData.append("location", location);
      formData.append("instrument_needed", instrument);
      formData.append("category", "Mencari Musisi");

      if (mediaFile) {
        formData.append("media", mediaFile);
      }

      const newPost = await createPost(formData, token);

      // Reset semua input setelah berhasil
      setTitle("");
      setBody("");
      setLocation("");
      setInstrument("");
      setMediaFile(null);
      if (document.getElementById("file-upload")) {
        document.getElementById("file-upload").value = null;
      }

      if (onPostCreated) {
        onPostCreated(newPost);
      }
    } catch (err) {
      setError("Gagal membuat postingan.");
      console.error(err);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h3 className="font-bold text-lg mb-2">Buat Postingan Baru</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* --- INPUT BARU UNTUK JUDUL --- */}
        <input
          type="text"
          placeholder="Judul Postingan..."
          className="w-full p-2 border border-gray-300 rounded-md font-bold text-lg"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full p-2 border border-gray-300 rounded-md"
          rows="3"
          placeholder={`Apa yang Anda cari, ${user.username}?`}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        ></textarea>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Lokasi (e.g., Bandung)"
            className="flex-1 p-2 border border-gray-300 rounded-md"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <input
            type="text"
            placeholder="Instrumen Dicari (e.g., Vokalis)"
            className="flex-1 p-2 border border-gray-300 rounded-md"
            value={instrument}
            onChange={(e) => setInstrument(e.target.value)}
          />
        </div>

        <div className="flex justify-between items-center pt-2">
          <div>
            <label
              htmlFor="file-upload"
              className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg text-sm"
            >
              + Foto/Video
            </label>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={(e) => setMediaFile(e.target.files[0])}
              accept="image/*,video/*"
            />
            {mediaFile && (
              <span className="ml-3 text-sm text-gray-600 align-middle">
                {mediaFile.name}
              </span>
            )}
          </div>
          <button
            type="submit"
            className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            Post
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>
    </div>
  );
}

export default CreatePostForm;
