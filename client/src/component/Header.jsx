import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authcontex";

// Definisikan URL dasar backend Anda di sini
const SERVER_URL = "http://localhost:3000";

// Ikon-ikon
const HomeIcon = () => (
  <svg
    className="w-7 h-7"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    ></path>
  </svg>
);
const LogoutIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    ></path>
  </svg>
);

function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md p-2 flex justify-between items-center sticky top-0 z-50">
      {/* Bagian Kiri: Logo */}
      <div className="flex items-center gap-2">
        <Link to="/" className="flex-shrink-0">
          <svg
            className="w-10 h-10 text-indigo-600 fill-current"
            viewBox="0 0 20 20"
          >
            <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
          </svg>
        </Link>
      </div>

      {/* Bagian Tengah: Navigasi Utama */}
      <nav className="hidden lg:flex flex-grow justify-center">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="flex items-center justify-center w-28 h-12 rounded-lg text-indigo-600 hover:bg-indigo-100 transition-colors"
          >
            <HomeIcon />
          </Link>
          {/* Tambahkan link navigasi lain di sini jika perlu */}
        </div>
      </nav>

      {/* Bagian Kanan: Profil dan Aksi */}
      <div className="flex items-center gap-2">
        {user ? (
          <>
            <Link
              to="/profile"
              className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 cursor-pointer"
            >
              {user.profile_picture_url ? (
                // Jika ada URL foto, tampilkan gambar dengan alamat lengkap
                <img
                  src={`${SERVER_URL}${user.profile_picture_url}`}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                // Jika tidak ada, tampilkan inisial
                <div className="w-8 h-8 bg-indigo-200 rounded-full flex items-center justify-center font-bold text-indigo-600">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="font-semibold hidden sm:inline">
                {user.username}
              </span>
            </Link>
            <button
              onClick={handleLogout}
              className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
              title="Logout"
            >
              <LogoutIcon />
            </button>
          </>
        ) : (
          <div className="space-x-2">
            <Link
              to="/login"
              className="text-gray-600 font-semibold hover:text-indigo-600"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
