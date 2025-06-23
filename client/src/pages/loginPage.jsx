import React, { useState, useContext } from "react";
// Impor Link untuk navigasi
import { Link, useNavigate } from "react-router-dom";
// Impor service dan context yang dibutuhkan
import { loginUser } from "../services/authservices.js";
import { AuthContext } from "../context/authcontex.jsx";

// PERBAIKAN: Nama komponen diawali huruf besar
function loginPage() {
  // --- STATE MANAGEMENT ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // --- HOOKS ---
  // PERBAIKAN: Gunakan context untuk memanggil fungsi login
  const { login } = useContext(AuthContext);
  // PERBAIKAN: useNavigate adalah fungsi yang harus dipanggil
  const navigate = useNavigate();

  // --- EVENT HANDLER ---
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const userData = { email, password };
      const data = await loginUser(userData);

      if (data.token) {
        // PERBAIKAN: Serahkan proses login ke context
        login(data.token);
        // Arahkan pengguna ke halaman utama ("/")
        navigate("/");
      }
    } catch (apiError) {
      const errorMessage = apiError || "Terjadi kesalahan saat login";
      setError(errorMessage);
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-800 to-blue-900 flex items-center justify-center min-h-screen p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-indigo-800 mb-8">
          Log in to your account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Input Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-indigo-900 font-semibold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-800"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Input Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-indigo-900 font-semibold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-800"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-indigo-800 text-white py-3 rounded-lg font-semibold hover:bg-blue-900"
          >
            Login
          </button>
        </form>

        <div className="my-6 flex items-center">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-4 text-gray-500 text-sm">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Tombol Login dengan Google */}
        <a
          href="http://localhost:3000/api/auth/google"
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 48 48">
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            ></path>
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            ></path>
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            ></path>
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            ></path>
            <path fill="none" d="M0 0h48v48H0z"></path>
          </svg>
          Log in with Google
        </a>

        {/* PERBAIKAN: Menambahkan link ke halaman registrasi */}
        <p className="text-center text-gray-600 mt-6">
          Don't have an account?
          <Link
            to="/register"
            className="text-indigo-800 font-semibold hover:text-blue-900 ml-1"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

// PERBAIKAN: Nama export harus sama dengan nama komponen
export default loginPage;
