import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authcontex";

function Navbar() {
  // Ambil data 'user' dan fungsi 'logout' dari context kita
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fungsi yang akan dijalankan saat tombol logout diklik
  const handleLogout = () => {
    logout(); // Panggil fungsi logout dari context
    navigate("/login"); // Arahkan pengguna ke halaman login
  };

  return (
    <nav className="bg-indigo-900 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo atau Nama Aplikasi */}
          <div>
            <Link
              to="/"
              className="text-2xl font-bold text-white hover:text-gray-200"
            >
              MeetYourBand
            </Link>
          </div>

          {/* Link Navigasi */}
          <div className="flex items-center">
            {/* Logika Kondisional: Tampilkan link berdasarkan status login 'user' */}
            {user ? (
              // JIKA PENGGUNA SUDAH LOGIN
              <>
                <span className="text-gray-300 mr-4">
                  Welcome, {user.username}!
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700 transition duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              // JIKA PENGGUNA BELUM LOGIN (user adalah null)
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white px-4 py-2"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white font-bold py-2 px-4 rounded hover:bg-indigo-700 transition duration-300"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
