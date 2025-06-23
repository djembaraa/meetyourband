import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/authcontex.jsx";
import { getUserProfile, getUserPosts } from "../services/profileService.js";
import PostCard from "../component/PostCard.jsx";

function ProfilePage() {
  const { user } = useContext(AuthContext);
  const { userId } = useParams();

  const [profileData, setProfileData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const isMyProfile = user && user.id === parseInt(userId);

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      setIsLoading(true);
      setError("");
      try {
        const profile = await getUserProfile(userId);
        setProfileData(profile);

        const posts = await getUserPosts(userId);
        setUserPosts(posts);
      } catch (err) {
        setError("Gagal memuat data profil.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchProfileAndPosts();
    }
  }, [userId]);

  // --- FUNGSI BARU UNTUK MENANGANI UPDATE & DELETE ---
  const handlePostUpdated = (updatedPost) => {
    setUserPosts(
      userPosts.map((p) => (p.id === updatedPost.id ? updatedPost : p))
    );
  };

  const handlePostDeleted = (deletedPostId) => {
    setUserPosts(userPosts.filter((p) => p.id !== deletedPostId));
  };

  if (isLoading)
    return <div className="p-8 text-center">Loading profile...</div>;
  if (error || !profileData)
    return (
      <div className="p-8 text-center text-red-500">
        {error || "Profil tidak ditemukan."}
      </div>
    );

  return (
    <div className="container mx-auto p-4 md:p-8">
      {/* Tampilan Info Profil */}
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row items-center">
          <img
            src={
              profileData.profile_picture_url?.startsWith("http")
                ? profileData.profile_picture_url
                : `http://localhost:3000${profileData.profile_picture_url}` ||
                  "https://placehold.co/100x100/E2E8F0/4A5568?text=No+Img"
            }
            alt="Profile"
            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover mr-6 border-4"
          />
          <div className="text-center sm:text-left mt-4 sm:mt-0">
            <h1 className="text-3xl font-bold text-indigo-800">
              {profileData.username}
            </h1>
            <p className="text-gray-600 mt-1">{profileData.current_status}</p>
          </div>
          {isMyProfile && (
            <Link
              to="/profile/edit"
              className="ml-auto bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg mt-4 sm:mt-0"
            >
              Edit Profil
            </Link>
          )}
        </div>
        <div className="mt-6 border-t pt-4">
          {profileData.bio && (
            <p className="text-gray-700 mb-4">{profileData.bio}</p>
          )}
          <div className="flex flex-wrap gap-4 text-sm">
            {profileData.main_instrument && (
              <p>
                <strong className="font-semibold">Spesialis:</strong>{" "}
                {profileData.main_instrument}
              </p>
            )}
            {profileData.other_instruments && (
              <p>
                <strong className="font-semibold">Bisa juga:</strong>{" "}
                {profileData.other_instruments}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Feed Postingan Pengguna */}
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Postingan</h2>
        <div className="space-y-6">
          {userPosts.length > 0 ? (
            // PERBAIKAN: Berikan fungsi handler sebagai props
            userPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onPostUpdated={handlePostUpdated}
                onPostDeleted={handlePostDeleted}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center bg-white p-6 rounded-lg shadow-md">
              Pengguna ini belum membuat postingan.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
