import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus } from "lucide-react";
import api from "../../services/api";

import Sidebar from "../../components/umkm/layout/Sidebar";
import Topbar from "../../components/umkm/layout/Topbar";

function Menu() {
  const navigate = useNavigate();

  const [storeOpen, setStoreOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [menus, setMenus] = useState([]);

  // State untuk paginasi
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  function updateStoreStatus() {
    setStoreOpen(!storeOpen);
  }

  useEffect(() => {
    loadMenus();
  }, []);

  async function loadMenus() {
    try {
      // Mengambil data dari backend
      const response = await api.get("/menus"); 
      setMenus(response.data);
    } catch (error) {
      console.log("Error fetching menus dari backend:", error);
      
      // Fallback sementara menggunakan localStorage jika backend belum siap
      const savedMenus = JSON.parse(localStorage.getItem("menus")) || [];
      setMenus(savedMenus);
    }
  }

  // Filter daftar menu berdasarkan input pencarian
  const filteredMenus = menus.filter((menu) =>
    menu.name?.toLowerCase().includes(search.toLowerCase())
  );

  // Menghitung data untuk paginasi
  const totalPages = Math.ceil(filteredMenus.length / itemsPerPage);
  const currentMenus = filteredMenus.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Fungsi navigasi paginasi
  function goToPage(page) {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }

  // Reset ke halaman pertama saat melakukan pencarian
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <div className="flex min-h-screen bg-[#F2F0F0]">
      <Sidebar />

      <div className="flex-1 ml-64 p-10">
        <Topbar storeOpen={storeOpen} updateStoreStatus={updateStoreStatus} />

        {/* Header */}
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

        {/* Ringkasan Statistik */}
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

        {/* Pencarian */}
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-bold">Daftar Menu</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search menu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-80 px-5 py-3 rounded-xl border outline-none focus:border-green-700"
            />
            <Search size={20} className="absolute right-4 top-3.5 text-gray-500" />
          </div>
        </div>

        {/* Tabel Daftar Menu */}
        <div className="bg-white rounded-2xl shadow overflow-hidden border border-gray-200">
          <div className="grid grid-cols-5 bg-green-700 text-white p-5 font-semibold text-center">
            <p>Gambar</p>
            <p>Nama Menu</p>
            <p>Kategori</p>
            <p>Status</p>
            <p>Harga</p>
          </div>

          {currentMenus.length > 0 ? (
            currentMenus.map((menu) => (
              <div
                key={menu.id}
                className="grid grid-cols-5 items-center p-5 border-b hover:bg-gray-50 transition-all text-center"
              >
                <div className="flex justify-center">
                  <img
                    src={menu.images?.[0] || menu.image || "https://via.placeholder.com/150"}
                    alt={menu.name}
                    className="w-20 h-20 object-cover rounded-xl shadow-sm"
                  />
                </div>

                <p
                  onClick={() => navigate(`/menu/edit/${menu.id}`)}
                  className="font-semibold text-lg cursor-pointer hover:text-green-700 underline underline-offset-4"
                >
                  {menu.name}
                </p>

                <div className="flex justify-center">
                  <span className="bg-gray-100 px-4 py-2 rounded-lg text-sm border border-gray-200">
                    {menu.category}
                  </span>
                </div>

                <div className="flex justify-center">
                  {menu.stock > 0 ? (
                    <span className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-medium">
                      Tersedia
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-medium">
                      Habis
                    </span>
                  )}
                </div>

                <p className="font-bold text-green-700 text-lg">
                  Rp {Number(menu.price).toLocaleString("id-ID")}
                </p>
              </div>
            ))
          ) : (
            <div className="p-10 text-center text-gray-500">
              Data menu tidak ditemukan.
            </div>
          )}
        </div>

        {/* Paginasi */}
        {totalPages > 0 && (
          <div className="flex justify-center mt-8 gap-2">
            <button 
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {"<<"}
            </button>
            <button 
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {"<"}
            </button>

            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              return (
                <button
                  key={pageNumber}
                  onClick={() => goToPage(pageNumber)}
                  className={`px-4 py-1 rounded border font-bold ${
                    currentPage === pageNumber
                      ? "bg-[#3d603a] text-white border-[#3d603a]"
                      : "bg-white text-black border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button 
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {">"}
            </button>
            <button 
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {">>"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default Menu;