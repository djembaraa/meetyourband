import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/authcontex";

// Komponen ini menerima komponen lain sebagai 'children'
function ProtectedRoute({ children }) {
  // Ambil data 'user' dari AuthContext
  const { user } = useContext(AuthContext);

  // Jika tidak ada user yang login, arahkan ke halaman /login
  if (!user) {
    // Komponen Navigate akan secara otomatis mengubah URL
    return <Navigate to="/login" replace />;
  }

  // Jika ada user yang login, tampilkan halaman yang dilindungi
  return children;
}

export default ProtectedRoute;
