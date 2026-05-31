import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus } from "lucide-react";
import api from "../../services/api";

import SidebarKantin from "../../components/kantin/SidebarKantin";
import TopbarKantin from "../../components/kantin/TopbarKantin";

function UmkmManagement() {
  const navigate = useNavigate();
  
  // State Data
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
      const response = await api.get("/api/pengelola/umkm");
      
      const formattedData = response.data.map((item) => ({
        id: item.id_umkm,
        name: item.nama_umkm,
        category: "Makanan/Minuman",
        owner: item.username,
        status: item.status_buka ? "Aktif" : "Menunggu Kontrak",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1", // Placeholder
      }));
      
      setUmkms(formattedData);
    } catch (error) {
      console.error("Gagal mengambil data UMKM dari server:", error);
    }
  }

  // Fungsi untuk mengubah status kontrak UMKM
  async function toggleStatus(id_umkm, currentStatus) {
    try {
      const isBuka = currentStatus !== 'Aktif'; 
      await api.put(`/api/umkm/${id_umkm}/toggle`, {
        status_buka: isBuka
      }); 
      loadUmkms(); // Langsung refresh data setelah berhasil diubah
    } catch (error) {
      console.error("Gagal mengubah status:", error);
      alert("Gagal mengubah status UMKM. Cek console log.");
    }
  }

  // Filter berdasarkan input pencarian
  const filteredUmkms = umkms.filter((umkm) =>
    umkm.name?.toLowerCase().includes(search.toLowerCase())
  );

  // Perhitungan Summary Cards
  const totalUmkm = umkms.length;
  const totalAktif = umkms.filter((u) => u.status === "Aktif").length;
  const totalMenunggu = umkms.filter((u) => u.status === "Menunggu Kontrak").length;

  // Paginasi Dinamis
  const totalPages = Math.ceil(filteredUmkms.length / itemsPerPage);
  const currentUmkms = filteredUmkms.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  function goToPage(page) {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  }

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <div className="flex min-h-screen bg-[#F2F0F0]">
      <SidebarKantin />

      <div className="flex-1 ml-64 p-10">
        <TopbarKantin />

        <div className="animate-fade-in">
          <div className="flex justify-between items-center mb-8 border-b-2 border-gray-300 pb-4">
            <h1 className="text-3xl font-bold uppercase">Manajemen UMKM</h1>
          </div>

          {/* Tombol ini sekarang akan pindah ke halaman /kantin/umkm/add */}
          <button
            onClick={() => navigate("/kantin/umkm/add")}
            className="w-full bg-green-800 hover:bg-green-900 text-white py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg mb-8 transition-all shadow-md"
          >
            <Plus size={24} /> Tambah UMKM Baru
          </button>

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

          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold uppercase">Daftar UMKM</h1>
            <div className="relative">
              <input
                type="text"
                placeholder="Cari nama UMKM..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64 px-4 py-2 pl-4 pr-10 rounded-full border border-gray-400 outline-none focus:border-green-700 italic text-sm"
              />
              <Search size={18} className="absolute right-3 top-2.5 text-gray-500" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
            <div className="grid grid-cols-4 bg-[#f9faf9] text-[#3d603a] p-4 font-semibold text-center border-b border-gray-300">
              <p>Gambar</p>
              <p>Nama UMKM</p>
              <p>Status / Aksi</p>
              <p>Owner</p>
            </div>

            {currentUmkms.length > 0 ? (
              currentUmkms.map((umkm) => (
                <div key={umkm.id} className="grid grid-cols-4 items-center p-4 border-b border-gray-100 hover:bg-gray-50 transition-all text-center">
                  <div className="flex justify-center">
                    <img src={umkm.image} alt={umkm.name} className="w-16 h-16 object-cover rounded-lg shadow-sm" />
                  </div>
                  
                  <p onClick={() => navigate(`/kantin/umkm/edit/${umkm.id}`)} className="font-medium text-lg cursor-pointer hover:text-green-700 underline underline-offset-4">
                    {umkm.name}
                  </p>
                  
                  <div className="flex flex-col items-center gap-2">
                    <span className={`px-3 py-1 rounded-md text-xs font-bold ${umkm.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {umkm.status}
                    </span>
                    <button 
                      onClick={() => toggleStatus(umkm.id, umkm.status)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-all border ${
                        umkm.status === 'Aktif' 
                          ? 'border-red-500 text-red-500 hover:bg-red-50' 
                          : 'border-green-600 text-green-600 hover:bg-green-50'
                      }`}
                    >
                      {umkm.status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan Kontrak'}
                    </button>
                  </div>

                  <p className="text-gray-800 text-lg">{umkm.owner}</p>
                </div>
              ))
            ) : (
              <div className="p-10 text-center text-gray-500">Data UMKM tidak ditemukan.</div>
            )}
          </div>
          
          {totalPages > 0 && (
            <div className="flex justify-center mt-8 gap-2">
              <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 font-bold disabled:opacity-50">
                {"<"}
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button key={index + 1} onClick={() => goToPage(index + 1)} className={`px-3 py-1 rounded border font-bold transition-all ${currentPage === index + 1 ? "bg-[#3d603a] text-white border-[#3d603a]" : "bg-white text-black border-gray-300 hover:bg-gray-100"}`}>
                  {index + 1}
                </button>
              ))}
              <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 font-bold disabled:opacity-50">
                {">"}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default UmkmManagement;