import React, { useState } from "react";
// Pastikan nama file dan fungsi yang diimpor sudah benar
import { registerUser } from "../services/authservices.js";

function RegisterPage() {
  // --- STATE MANAGEMENT ---
  // Menggunakan nama yang konsisten dan sederhana
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(""); // State untuk pesan error
  const [successMessage, setSuccessMessage] = useState(""); // State untuk pesan sukses

  // --- EVENT HANDLER ---
  const handleSubmit = async (event) => {
    // 1. Mencegah halaman me-reload
    event.preventDefault();

    // Reset pesan sebelum validasi baru
    setError("");
    setSuccessMessage("");

    // 2. Validasi di sisi Frontend
    if (password !== confirmPassword) {
      setError("Password dan Konfirmasi Password tidak cocok!");
      return; // Hentikan fungsi jika tidak cocok
    }

    // 3. Menyiapkan data untuk dikirim ke API
    const userData = {
      username: username,
      email: email,
      password: password,
    };

    // 4. Mengirim data ke backend menggunakan service
    try {
      const data = await registerUser(userData);
      console.log("Registrasi Berhasil:", data);
      setSuccessMessage("Registrasi Berhasil! Silakan login.");

      // Mengosongkan form setelah berhasil
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (apiError) {
      // Menangkap error dari backend (misal: "Email sudah terdaftar")
      const errorMessage =
        apiError.response?.data || "Terjadi kesalahan pada server.";
      console.error("Error dari API:", errorMessage);
      setError(errorMessage); // Menampilkan pesan error dari server
    }
  };

  // --- RENDER JSX ---
  return (
    <div className="bg-gradient-to-r from-indigo-800 to-blue-900 flex items-center justify-center min-h-screen p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-indigo-800 mb-8">
          Create an Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Input Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-indigo-900 font-semibold mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-800"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

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

          {/* Input Confirm Password */}
          <div>
            <label
              htmlFor="confirm-password"
              className="block text-indigo-900 font-semibold mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-800"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* Tampilkan pesan error jika ada */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* Tampilkan pesan sukses jika ada */}
          {successMessage && (
            <p className="text-green-500 text-sm text-center">
              {successMessage}
            </p>
          )}

          {/* Tombol Register */}
          <button
            type="submit"
            className="w-full bg-indigo-800 text-white py-3 rounded-lg font-semibold hover:bg-blue-900 transition-all duration-300"
          >
            Register
          </button>
        </form>

        <div className="my-6 flex items-center">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-4 text-gray-500 text-sm">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <a
          href="http://localhost:3000/api/auth/google"
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-300"
        >
          {/* Ikon Google SVG Sederhana */}
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
          Sign Up with Google
        </a>

        <p className="text-center text-gray-600 mt-6">
          Already have an account?
          <a
            href="#"
            className="text-indigo-800 font-semibold hover:text-blue-900"
          >
            {" "}
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
