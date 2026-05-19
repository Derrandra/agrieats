import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { Search, Plus } from "lucide-react";

function Menu() {
  const navigate = useNavigate();

  const [storeOpen, setStoreOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  function updateStoreStatus() {
    setStoreOpen(!storeOpen);
  }

  const [search, setSearch] = useState("");
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    async function fetchMenus() {
      try {
        // Ganti "/menus" sesuai dengan endpoint yang ada di FastAPI kamu
        const response = await api.get("/menus"); 
        setMenus(response.data);
      } catch (error) {
        console.error("Gagal mengambil data menu dari server:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMenus();
  }, []);

  const filteredMenus = menus.filter((menu) =>
    menu.nama_menu.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading daftar menu...</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#F2F0F0]">
      <Sidebar />

      <div className="flex-1 ml-64 p-10">
        <Topbar storeOpen={storeOpen} updateStoreStatus={updateStoreStatus} />

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

        <div className="grid grid-cols-3 gap-5 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-gray-500">Total Menu</h2>
            <p className="text-4xl font-bold text-green-700 mt-3">
              {menus.length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-gray-500">Total Menu Aktif</h2>
            <p className="text-4xl font-bold text-green-700 mt-3">
              {menus.filter((menu) => menu.ketersediaan === true).length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-gray-500">Stok Kosong</h2>
            <p className="text-4xl font-bold text-red-500 mt-3">
              {menus.filter((menu) => menu.ketersediaan === false).length}
            </p>
          </div>
        </div>

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
            <Search
              size={20}
              className="absolute right-4 top-3.5 text-gray-500"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="grid grid-cols-5 bg-green-700 text-white p-5 font-semibold">
            <p>Gambar</p>
            <p>Nama Menu</p>
            <p>Kategori</p>
            <p>Status</p>
            <p>Harga</p>
          </div>

          {filteredMenus.length === 0 ? (
             <div className="p-8 text-center text-gray-500">
               Tidak ada menu yang ditemukan.
             </div>
          ) : (
            filteredMenus.map((menu) => (
              <div
                key={menu.id_menu}
                className="grid grid-cols-5 items-center p-5 border-b hover:bg-gray-50 transition-all"
              >
                <img
                  src={
                    menu.foto_menu || "https://via.placeholder.com/150"
                  }
                  alt={menu.nama_menu}
                  className="w-24 h-24 object-cover rounded-xl"
                />

                <p
                  onClick={() => navigate(`/menu/edit/${menu.id_menu}`)}
                  className="font-semibold text-lg cursor-pointer hover:text-green-700"
                >
                  {menu.nama_menu}
                </p>

                <div>
                  <span className="bg-gray-100 px-4 py-2 rounded-lg text-sm">
                    {menu.tag_makanan || "Umum"}
                  </span>
                </div>

                <div>
                  {menu.ketersediaan ? (
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
                  Rp {menu.harga ? menu.harga.toLocaleString('id-ID') : 0}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Menu;