import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus } from "lucide-react";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

function Menu() {
  const navigate = useNavigate();

  const [storeOpen, setStoreOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [menus, setMenus] = useState([]);

  function updateStoreStatus() {
    setStoreOpen(!storeOpen);
  }

  useEffect(() => {
    loadMenus();
  }, []);

  function loadMenus() {
    const savedMenus = JSON.parse(localStorage.getItem("menus")) || [];
    setMenus(savedMenus);
  }

  // filter daftar menu berdasarkan input pencarian
  const filteredMenus = menus.filter((menu) =>
    menu.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#F2F0F0]">
      <Sidebar />

      <div className="flex-1 ml-64 p-10">
        <Topbar storeOpen={storeOpen} updateStoreStatus={updateStoreStatus} />

        {/* header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Manajemen Menu</h1>
            <p className="text-gray-500 mt-2">Kelola seluruh menu produk</p>
          </div>

          <button
            onClick={() => navigate("/menu/add")}
            className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold"
          >
            <Plus size={20} />
            Tambah Menu
          </button>
        </div>

        {/* ringkasan statistik menu */}
        <div className="grid grid-cols-3 gap-5 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-gray-500">Total Menu</h2>
            <p className="text-4xl font-bold text-green-700 mt-3">{menus.length}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-gray-500">Total Menu Aktif</h2>
            <p className="text-4xl font-bold text-green-700 mt-3">
              {menus.filter((menu) => menu.stock > 0).length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-gray-500">Stok Kosong</h2>
            <p className="text-4xl font-bold text-red-500 mt-3">
              {menus.filter((menu) => menu.stock <= 0).length}
            </p>
          </div>
        </div>

        {/* pencarian */}
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-bold">Daftar Menu</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search menu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-80 px-5 py-3 rounded-xl border outline-none"
            />
            <Search size={20} className="absolute right-4 top-3.5 text-gray-500" />
          </div>
        </div>

        {/* tabel daftar menu */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="grid grid-cols-5 bg-green-700 text-white p-5 font-semibold">
            <p>Gambar</p>
            <p>Nama Menu</p>
            <p>Kategori</p>
            <p>Status</p>
            <p>Harga</p>
          </div>

          {filteredMenus.map((menu) => (
            <div
              key={menu.id}
              className="grid grid-cols-5 items-center p-5 border-b hover:bg-gray-50 transition-all"
            >
              <img
                src={menu.images?.[0] || menu.image}
                alt={menu.name}
                className="w-24 h-24 object-cover rounded-xl"
              />

              <p
                onClick={() => navigate(`/menu/edit/${menu.id}`)}
                className="font-semibold text-lg cursor-pointer hover:text-green-700"
              >
                {menu.name}
              </p>

              <div>
                <span className="bg-gray-100 px-4 py-2 rounded-lg text-sm">
                  {menu.category}
                </span>
              </div>

              <div>
                {menu.stock > 0 ? (
                  <span className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm">
                    Tersedia
                  </span>
                ) : (
                  <span className="bg-red-100 text-red-500 px-4 py-2 rounded-lg text-sm">
                    Habis
                  </span>
                )}
              </div>

              <p className="font-bold text-green-700 text-xl">
                Rp {Number(menu.price).toLocaleString("id-ID")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Menu;