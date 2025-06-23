import React from "react";
import { Outlet } from "react-router-dom";

// Impor semua komponen layout
import Header from "./component/Header"; // Header atas
import LeftSidebar from "./component/LeftSidebar"; // Sidebar kiri baru
import RightSidebar from "./component/RightSidebar"; // Sidebar kanan baru

function App() {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* 1. Header akan selalu di atas */}
      <Header />

      {/* 2. Kontainer utama untuk layout di bawah header */}
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 px-4 pt-6">
        {/* 2a. Sidebar Kiri (terlihat di layar besar) */}
        <div className="hidden lg:block lg:col-span-1">
          <LeftSidebar />
        </div>

        {/* 2b. Konten Utama / Feed (mengambil 2 kolom di layar besar) */}
        <main className="col-span-1 lg:col-span-2">
          {/* <Outlet /> adalah placeholder di mana HomePage akan dirender */}
          <Outlet />
        </main>

        {/* 2c. Sidebar Kanan (terlihat di layar besar) */}
        <div className="hidden lg:block lg:col-span-1">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}

export default App;
