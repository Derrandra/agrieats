import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Star, Store } from "lucide-react";
import api from "../../services/api";

import SidebarMahasiswa from "../../components/mahasiswa/SidebarMahasiswa";
import TopbarMahasiswa from "../../components/mahasiswa/TopbarMahasiswa";
import FloatingCart from "../../components/mahasiswa/FloatingCart";

function KatalogUmkm() {
  const navigate = useNavigate();
  const [umkms, setUmkms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    // TODO: [BACKEND INTEGRATION] Template Fetch Data UMKM
    try {
      // const response = await api.get("/umkms");
      // setUmkms(response.data);
      
      const dummyUmkms = [
        { id: 1, name: "Warkop HS Central", rating: 4.9, isOpen: true, image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24" },
        { id: 2, name: "Bakmie Tjan Ho", rating: 4.8, isOpen: true, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624" },
        { id: 3, name: "Ayam Geprek Bensu", rating: 4.7, isOpen: false, image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec" },
        { id: 4, name: "Soto Pak Sholeh", rating: 4.6, isOpen: true, image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d" },
        { id: 5, name: "Kwetiau Goreng Babeh", rating: 4.7, isOpen: true, image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841" },
        { id: 6, name: "Seblak Mercon", rating: 4.4, isOpen: false, image: "https://images.unsplash.com/photo-1555126634-323283e090fa" },
      ];
      setUmkms(dummyUmkms);
      
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

  return (
    <div className="flex min-h-screen bg-[#F2F0F0] font-sans relative">
      <SidebarMahasiswa />

      <div className="flex-1 ml-64 p-10 overflow-hidden">
        <TopbarMahasiswa namaUser="Luthfi" />

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

        {/* DAFTAR UMKM TERSERDIA */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">UMKM Tersedia</h2>
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {currentUmkms.length > 0 ? currentUmkms.map((umkm) => (
              <div key={umkm.id} className="bg-white rounded-3xl shadow-sm border border-gray-200 p-4 flex gap-6 hover:shadow-md transition-all group">
                
                <div className="w-40 h-40 shrink-0 overflow-hidden rounded-2xl">
                  <img src={umkm.image} alt={umkm.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>

                <div className="flex flex-col justify-between flex-1 py-1">
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h3 className="font-bold text-xl text-gray-800 line-clamp-1">{umkm.name}</h3>
                      <div className="flex items-center gap-1 text-gray-800 font-bold text-sm bg-yellow-100/50 px-2 py-1 rounded-lg">
                        <Star size={16} className="text-yellow-500 fill-yellow-500" />
                        {umkm.rating}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-3 mb-2">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold text-white ${umkm.isOpen ? 'bg-green-500' : 'bg-red-600'}`}>
                        {umkm.isOpen ? 'Buka' : 'Tutup'}
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => navigate('/katalog-menu', { state: { selectedUmkm: umkm.name } })}
                    className="w-full py-2.5 border-2 border-gray-300 rounded-xl text-gray-700 font-bold hover:border-[#15803d] hover:text-[#15803d] transition-colors mt-auto flex items-center justify-center gap-2"
                  >
                    <Store size={18} />
                    LIHAT MENU
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

      {/* PANGGIL KOMPONEN KERANJANG DI SINI */}
      <FloatingCart />
      
    </div>
  );
}

export default KatalogUmkm;