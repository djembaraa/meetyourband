import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authcontex";

// Ikon-ikon bisa dibuat sebagai komponen terpisah jika diinginkan
const HomeIcon = () => (
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
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    ></path>
  </svg>
);
const ProfileIcon = () => (
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
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    ></path>
  </svg>
);

function LeftSidebar() {
  const { user } = useContext(AuthContext);

  if (!user) return null; // Jangan tampilkan sidebar jika tidak login

  return (
    <aside className="sticky top-20 bg-white p-4 rounded-lg shadow-sm">
      <nav>
        <ul>
          <li>
            <Link
              to="/"
              className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-200 font-semibold"
            >
              <HomeIcon />
              <span>Home</span>
            </Link>
          </li>
          <li>
            {/* --- PERBAIKAN UTAMA DI SINI --- */}
            {/* Link sekarang dinamis dan menyertakan user.id */}
            <Link
              to={`/profile/${user.id}`}
              className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-200 font-semibold"
            >
              <ProfileIcon />
              <span>Profil Saya</span>
            </Link>
          </li>
          {/* Tambahkan link navigasi lain di sini */}
        </ul>
      </nav>
    </aside>
  );
}

export default LeftSidebar;
