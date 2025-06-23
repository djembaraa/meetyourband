// File ini berada di dalam: client/src/main.jsx

import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

// Impor Provider dan Halaman-halaman
// PERBAIKAN: Memperbaiki semua nama file dan path agar konsisten
import { AuthProvider } from "./context/authcontex.jsx";
import App from "./App.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProtectedRoute from "./component/ProtectedRoute.jsx";
import AuthCallbackPage from "./pages/AuthCallbackPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

// Definisikan "peta" aplikasi
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      // Semua halaman di dalam sini akan dilindungi
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    // Halaman anak yang akan ditampilkan di dalam <Outlet /> milik App
    children: [
      {
        index: true, // Ini adalah halaman default untuk path "/"
        element: <HomePage />,
      },
      {
        // PERBAIKAN: Menggunakan :userId agar rute menjadi dinamis
        // Sekarang bisa diakses via /profile/1, /profile/2, dst.
        path: "profile/:userId",
        element: <ProfilePage />,
      },
    ],
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/auth/callback",
    element: <AuthCallbackPage />,
  },
]);

// Me-render seluruh aplikasi
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
