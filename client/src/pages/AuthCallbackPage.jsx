import React, { useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authcontex";

// Halaman ini tidak menampilkan apa-apa, tugasnya hanya menangkap token
function AuthCallbackPage() {
  const { login } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Ambil token dari query parameter URL
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      // Jika ada token, panggil fungsi login dari context
      login(token);
      // Arahkan ke halaman utama
      navigate("/", { replace: true });
    } else {
      // Jika tidak ada token, arahkan ke halaman login
      navigate("/login", { replace: true });
    }
  }, [location, login, navigate]);

  return <div>Loading...</div>; // Tampilkan pesan loading sementara
}

export default AuthCallbackPage;
