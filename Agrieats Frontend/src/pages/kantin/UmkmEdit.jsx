import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Store, MapPin, Clock, User } from "lucide-react";
import api from "../../services/api";

import SidebarKantin from "../../components/kantin/SidebarKantin";
import TopbarKantin from "../../components/kantin/TopbarKantin";

function UmkmEdit() {
  const { id } = useParams(); // Mengambil ID dari URL
  const navigate = useNavigate();

  const [umkm, setUmkm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // State khusus untuk field yang bisa diedit (Jam Operasional)
  const [jamOperasional, setJamOperasional] = useState("");

  useEffect(() => {
    loadUmkmDetail();
  }, [id]);

  async function loadUmkmDetail() {
    try {
      // Karena backend belum ada endpoint GET by ID khusus, 
      // kita ambil semua UMKM binaan lalu cari yang ID-nya cocok
      const response = await api.get("/api/pengelola/umkm");
      const foundUmkm = response.data.find((item) => item.id_umkm === id);

      if (foundUmkm) {
        setUmkm(foundUmkm);
        setJamOperasional(foundUmkm.jam_operasional || "");
      } else {
        alert("Data UMKM tidak ditemukan di kantin Anda.");
        navigate("/kantin/umkm");
      }
    } catch (error) {
      console.error("Gagal mengambil detail UMKM:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Fungsi untuk menyimpan perubahan Jam Operasional ke Backend
  async function handleUpdateSchedule(e) {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.put(`/api/umkm/${id}/schedule`, {
        jam_operasional: jamOperasional
      });
      alert("Jam operasional UMKM berhasil diperbarui!");
      loadUmkmDetail(); // Refresh data terbaru
    } catch (error) {
      console.error("Gagal mengupdate jadwal:", error);
      alert("Gagal memperbarui jam operasional.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-[#F2F0F0] items-center justify-center">
        <p className="text-xl font-semibold text-gray-500">Memuat Data UMKM...</p>
      </div>
    );
  }

  if (!umkm) return null;

  return (
    <div className="flex min-h-screen bg-[#F2F0F0]">
      <SidebarKantin />

      <div className="flex-1 ml-64 p-10">
        <TopbarKantin />

        {/* HEADER & TOMBOL KEMBALI */}
        <div className="flex items-center gap-4 mb-8 animate-fade-in">
          <button
            onClick={() => navigate("/kantin/umkm")}
            className="p-3 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition-all border border-gray-200"
          >
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <div>
            <h1 className="text-3xl font-bold">Detail Profil UMKM</h1>
            <p className="text-gray-500 mt-1">Informasi lengkap tentang mitra toko ini</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow p-10 animate-fade-in">
          
          {/* Header Info UMKM */}
          <div className="flex items-center gap-6 border-b pb-8 mb-8">
            <div className="w-24 h-24 bg-green-100 text-green-700 rounded-2xl flex items-center justify-center">
              <Store size={48} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{umkm.nama_umkm}</h1>
              <div className="flex gap-3 mt-3">
                <span className={`px-3 py-1 rounded-md text-sm font-bold ${umkm.status_buka ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {umkm.status_buka ? "Status: Aktif" : "Status: Menunggu Kontrak"}
                </span>
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-sm font-semibold flex items-center gap-1">
                  ⭐ {umkm.rating || "0.0"} Rating
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-12">
            
            {/* DATA FIX (Hanya Baca) */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800 border-l-4 border-green-700 pl-3">Data Pemilik & Lokasi</h2>
              
              <div>
                <label className="text-gray-500 text-sm font-semibold flex items-center gap-2 mb-1">
                  <User size={16} /> Username Pemilik
                </label>
                <p className="text-lg font-medium text-gray-800 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  {umkm.username}
                </p>
              </div>

              <div>
                <label className="text-gray-500 text-sm font-semibold flex items-center gap-2 mb-1">
                  <MapPin size={16} /> Lokasi Stand
                </label>
                <p className="text-lg font-medium text-gray-800 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  {umkm.lokasi}
                </p>
              </div>

              <div>
                <label className="text-gray-500 text-sm font-semibold mb-1 block">
                  Deskripsi Jualan
                </label>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100 min-h-[100px]">
                  {umkm.deskripsi || "Tidak ada deskripsi."}
                </p>
              </div>
            </div>

            {/* FORM UPDATE (Bisa Diedit Pengelola) */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 border-l-4 border-blue-600 pl-3 mb-6">Pengaturan Jam Operasional</h2>
              
              <form onSubmit={handleUpdateSchedule} className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <label className="text-blue-800 font-semibold flex items-center gap-2 mb-3">
                  <Clock size={18} /> Jam Operasional Saat Ini
                </label>
                
                <input
                  type="text"
                  value={jamOperasional}
                  onChange={(e) => setJamOperasional(e.target.value)}
                  placeholder="Contoh: 08:00 - 16:00"
                  required
                  className="w-full border border-blue-300 p-4 rounded-xl outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 mb-4 bg-white"
                />
                
                <p className="text-sm text-blue-600 mb-6">
                  *Sebagai Pengelola Kantin, Anda berhak mengubah jam operasional UMKM ini jika diperlukan.
                </p>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSaving ? "Menyimpan..." : <><Save size={20} /> Update Jam Operasional</>}
                </button>
              </form>
            </div>
            
          </div>

        </div>
      </div>
    </div>
  );
}

export default UmkmEdit;