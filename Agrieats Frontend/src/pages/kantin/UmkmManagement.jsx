import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus } from "lucide-react";
import api from "../../services/api";

import SidebarKantin from "../../components/kantin/SidebarKantin";
import TopbarKantin from "../../components/kantin/TopbarKantin";

function UmkmManagement() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [umkms, setUmkms] = useState([]);

  // State untuk paginasi
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    loadUmkms();
  }, []);

  async function loadUmkms() {
    try {
      // Mengambil data dari backend
      const response = await api.get("/umkms");
      setUmkms(response.data);
    } catch (error) {
      console.log("Error fetching umkms dari backend:", error);
      
      // Fallback sementara jika backend belum siap
      const dummyUmkms = [
        {
          id: 1,
          image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1",
          name: "Risol GC",
          category: "Makanan Berat",
          owner: "Budi",
          status: "Aktif",
        },
        {
          id: 2,
          image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
          name: "Cireng BC",
          category: "Camilan",
          owner: "Andi",
          status: "Aktif",
        },
        {
          id: 3,
          image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d",
          name: "Jus Andra",
          category: "Minuman",
          owner: "Andra",
          status: "Menunggu Kontrak",
        },
      ];
      setUmkms(dummyUmkms);
    }
  }

  // Filter berdasarkan input pencarian
  const filteredUmkms = umkms.filter((umkm) =>
    umkm.name?.toLowerCase().includes(search.toLowerCase())
  );

  // Perhitungan Summary Cards secara real-time
  const totalUmkm = umkms.length;
  const totalAktif = umkms.filter((u) => u.status === "Aktif").length;
  const totalMenunggu = umkms.filter((u) => u.status === "Menunggu Kontrak").length;

  // Menghitung data untuk paginasi
  const totalPages = Math.ceil(filteredUmkms.length / itemsPerPage);
  const currentUmkms = filteredUmkms.slice(
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
      <SidebarKantin />

      <div className="flex-1 ml-64 p-10">
        <TopbarKantin />

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8 border-b-2 border-gray-300 pb-4">
          <h1 className="text-3xl font-bold uppercase">Manajemen UMKM</h1>
        </div>

        {/* TOMBOL TAMBAH */}
        <button
          onClick={() => navigate("/kantin/umkm/add")}
          className="w-full bg-green-800 hover:bg-green-900 text-white py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg mb-8 transition-all"
        >
          <Plus size={24} />
          Tambah UMKM Baru
        </button>

        {/* SUMMARY CARDS */}
        <div className="flex flex-col gap-4 mb-10">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col">
            <h2 className="text-gray-700 text-lg">Total UMKM</h2>
            <p className="text-3xl font-bold text-[#3d603a] mt-1">{totalUmkm}</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col">
            <h2 className="text-gray-700 text-lg">Total UMKM Aktif</h2>
            <p className="text-3xl font-bold text-[#3d603a] mt-1">{totalAktif}</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col">
            <h2 className="text-gray-700 text-lg">Menunggu Kontrak</h2>
            <p className="text-3xl font-bold text-[#3d603a] mt-1">{totalMenunggu}</p>
          </div>
        </div>

        {/* DAFTAR UMKM & SEARCH */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold uppercase">Daftar UMKM</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 px-4 py-2 pl-4 pr-10 rounded-full border border-gray-400 outline-none focus:border-green-700 italic text-sm"
            />
            <Search size={18} className="absolute right-3 top-2.5 text-black" />
          </div>
        </div>

        {/* TABLE DAFTAR UMKM */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
          {/* Table Header */}
          <div className="grid grid-cols-4 bg-[#f9faf9] text-[#3d603a] p-4 font-semibold text-center border-b border-gray-300">
            <p>Gambar</p>
            <p>Nama UMKM</p>
            <p>Kategori</p>
            <p>Owner</p>
          </div>

          {/* Table Content */}
          {currentUmkms.length > 0 ? (
            currentUmkms.map((umkm) => (
              <div
                key={umkm.id}
                className="grid grid-cols-4 items-center p-4 border-b border-gray-100 hover:bg-gray-50 transition-all text-center"
              >
                <div className="flex justify-center">
                  <img
                    src={umkm.image || "https://via.placeholder.com/150"}
                    alt={umkm.name}
                    className="w-16 h-16 object-cover rounded-lg shadow-sm"
                  />
                </div>

                <p
                  onClick={() => navigate(`/kantin/umkm/edit/${umkm.id}`)}
                  className="font-medium text-lg cursor-pointer hover:text-green-700 underline underline-offset-4"
                >
                  {umkm.name}
                </p>

                <div className="flex justify-center">
                  <span className="bg-gray-200 border border-gray-400 px-3 py-1 rounded-md text-sm text-gray-800">
                    {umkm.category}
                  </span>
                </div>

                <p className="text-gray-800 text-lg">{umkm.owner}</p>
              </div>
            ))
          ) : (
            <div className="p-10 text-center text-gray-500">
              Data UMKM tidak ditemukan.
            </div>
          )}
        </div>
        
        {/* Pagination Dinamis */}
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
                  className={`px-3 py-1 rounded border font-bold transition-all ${
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

export default UmkmManagement;