import React from "react";

function RightSidebar() {
  return (
    <aside className="sticky top-20 bg-white p-4 rounded-lg shadow-sm">
      <h3 className="font-bold text-gray-800 mb-4">Teman Musisi</h3>
      {/* Nanti di sini bisa diisi dengan daftar teman atau pengguna lain */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          <span className="font-medium">Andi Gitaris</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          <span className="font-medium">Budi Bassis</span>
        </div>
      </div>
    </aside>
  );
}

export default RightSidebar;
