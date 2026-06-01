import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Star, Store, MapPin, Clock } from "lucide-react";
import api from "../../services/api";

import SidebarMahasiswa from "../../components/mahasiswa/SidebarMahasiswa";
import TopbarMahasiswa from "../../components/mahasiswa/TopbarMahasiswa";
import FloatingCart from "../../components/mahasiswa/FloatingCart";

function KatalogUmkm() {
  const navigate = useNavigate();
  const [mahasiswa, setMahasiswa] = useState(null);
  const [umkms, setUmkms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const resProfile = await api.get("/api/mahasiswa/me");
      setMahasiswa(resProfile.data);
    } catch (error) {
      const localUser = JSON.parse(localStorage.getItem("currentUser"));
      if (localUser) setMahasiswa(localUser);
    }

    try {
      const response = await api.get("/api/umkm/");
      
      const fallbackImages = [
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24",
        "https://images.unsplash.com/photo-1569718212165-3a8278d5f624",
        "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec",
        "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d",
        "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841",
        "https://images.unsplash.com/photo-1555126634-323283e090fa"
      ];

      const mappedUmkms = response.data.map((umkm, index) => ({
        id: umkm.id_umkm,
        name: umkm.nama_umkm,
        rating: umkm.rating || 0,
        isOpen: umkm.status_buka,
        location: umkm.lokasi,
        hours: umkm.jam_operasional,
        image: fallbackImages[index % fallbackImages.length] 
      }));

      setUmkms(mappedUmkms);
      
    } catch (error) {
      console.error("Gagal memuat data UMKM:", error);
    }
  }

  const filteredUmkms = umkms.filter((umkm) =>
    umkm.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUmkms.length / itemsPerPage);
  const currentUmkms = filteredUmkms.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  function goToPage(page) {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const namaDepan = mahasiswa?.nama_mahasiswa?.split(" ")[0] || "Mahasiswa";

  return (
    <div className="flex min-h-screen bg-[#F2F0F0] font-sans relative">
      <SidebarMahasiswa />

      <div className="flex-1 ml-64 p-10 overflow-hidden">
        <TopbarMahasiswa namaUser={namaDepan} />

        {/* SEARCH BAR */}
        <div className="mb-8">
          <div className="flex items-center border border-gray-300 rounded-2xl px-6 py-4 bg-white shadow-sm focus-within:border-[#15803d] focus-within:ring-1 focus-within:ring-[#15803d] transition-all mb-4">
            <Search size={28} className="text-gray-400 mr-4" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama UMKM atau kedai..." 
              className="w-full outline-none text-lg font-medium placeholder-gray-400 text-gray-700"
            />
          </div>
        </div>

        {/* DAFTAR UMKM TERSEDIA */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">UMKM Tersedia</h2>
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {currentUmkms.length > 0 ? currentUmkms.map((umkm) => (
              <div key={umkm.id} className="bg-white rounded-3xl shadow-sm border border-gray-200 p-4 flex gap-6 hover:shadow-md transition-all group">
                
                <div className="w-40 h-40 shrink-0 overflow-hidden rounded-2xl relative">
                  <img src={umkm.image} alt={umkm.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {/* Overlay Gelap Jika Tutup */}
                  {!umkm.isOpen && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="bg-red-600 text-white font-bold px-3 py-1 rounded-lg text-sm rotate-[-10deg]">TUTUP</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col justify-between flex-1 py-1">
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h3 className="font-bold text-xl text-gray-800 line-clamp-1">{umkm.name}</h3>
                      <div className="flex items-center gap-1 text-gray-800 font-bold text-sm bg-yellow-100/50 px-2 py-1 rounded-lg shrink-0">
                        <Star size={16} className="text-yellow-500 fill-yellow-500" />
                        {Number(umkm.rating).toFixed(1)}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-1.5 mt-2">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin size={16} className="shrink-0" />
                        <span className="line-clamp-1">{umkm.location || "Lokasi Kantin"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock size={16} className="shrink-0" />
                        <span>{umkm.hours || "Jam Buka Tidak Diketahui"}</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => navigate('/katalog-menu', { state: { selectedUmkm: umkm.name } })}
                    className={`w-full py-2.5 border-2 rounded-xl font-bold transition-colors mt-4 flex items-center justify-center gap-2 ${
                      umkm.isOpen 
                        ? "border-gray-300 text-gray-700 hover:border-[#15803d] hover:text-[#15803d]" 
                        : "border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed"
                    }`}
                    disabled={!umkm.isOpen}
                  >
                    <Store size={18} />
                    {umkm.isOpen ? "LIHAT MENU" : "SEDANG TUTUP"}
                  </button>
                </div>

              </div>
            )) : (
              <div className="col-span-full py-10 text-center text-gray-500 bg-white rounded-3xl border border-gray-200">
                UMKM tidak ditemukan. Coba kata kunci lain.
              </div>
            )}
          </div>
        </div>

        {/* PAGINASI */}
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

      <FloatingCart />
      
    </div>
  );
}

export default KatalogUmkm;