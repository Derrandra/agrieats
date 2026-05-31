import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Save } from "lucide-react";
import api from "../../services/api";

import SidebarKantin from "../../components/kantin/SidebarKantin";
import TopbarKantin from "../../components/kantin/TopbarKantin";

function UmkmForm() {
  const navigate = useNavigate();

  const [pengelolaId, setPengelolaId] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Sesuaikan dengan skema backend Pydantic
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    nama_umkm: "",
    lokasi: "",
    jam_operasional: "",
    deskripsi: "",
  });

  useEffect(() => {
    // Ambil ID Pengelola dari localStorage untuk disisipkan saat register UMKM
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
      const idNya = user.id_akun || user.id_pengelola;
      setPengelolaId(idNya);
    }
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Gabungkan data form dengan ID Pengelola
      const payload = {
        ...formData,
        id_pengelola: pengelolaId,
      };

      // Tembak langsung ke API Register UMKM di backend
      await api.post("/api/umkm/register", payload);

      alert("UMKM berhasil ditambahkan!");
      navigate("/kantin/umkm"); // Kembali ke halaman tabel UMKM
      
    } catch (error) {
      console.error("Gagal menambahkan UMKM:", error);
      const errorMessage = error.response?.data?.detail || "Terjadi kesalahan saat menyimpan data.";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-[#F2F0F0]">
      <SidebarKantin />

      <div className="flex-1 ml-64 p-10">
        <TopbarKantin />

        {/* HEADER & TOMBOL KEMBALI */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/kantin/umkm")}
            className="p-3 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition-all border border-gray-200"
          >
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <div>
            <h1 className="text-3xl font-bold">Tambah UMKM Baru</h1>
            <p className="text-gray-500 mt-1">Daftarkan mitra UMKM ke dalam sistem AgriEats</p>
          </div>
        </div>

        {/* FORM TAMBAH UMKM */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            
            <div className="grid grid-cols-2 gap-8">
              {/* KOLOM KIRI: Data Login & Info Utama */}
              <div className="space-y-6">
                
                <h2 className="font-bold text-lg text-green-700 border-b pb-2">1. Akses Login</h2>
                
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Username Pemilik</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    placeholder="Contoh: budi_risol"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-green-700 focus:ring-1 focus:ring-green-700 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Email Pemilik</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Contoh: budi@gmail.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-green-700 focus:ring-1 focus:ring-green-700 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Password Sementara</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Minimal 8 karakter"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-green-700 focus:ring-1 focus:ring-green-700 transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1">*Berikan ke pemilik UMKM agar mereka bisa login nantinya.</p>
                </div>
              </div>

              {/* KOLOM KANAN: Profil Toko & Foto */}
              <div className="space-y-6">
                
                <h2 className="font-bold text-lg text-green-700 border-b pb-2">2. Profil UMKM</h2>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Nama UMKM / Toko</label>
                  <input
                    type="text"
                    name="nama_umkm"
                    value={formData.nama_umkm}
                    onChange={handleChange}
                    required
                    placeholder="Contoh: Risol GC"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-green-700 focus:ring-1 focus:ring-green-700 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Lokasi Stand</label>
                    <input
                      type="text"
                      name="lokasi"
                      value={formData.lokasi}
                      onChange={handleChange}
                      required
                      placeholder="Contoh: Stand 04"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-green-700 focus:ring-1 focus:ring-green-700 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Jam Buka</label>
                    <input
                      type="text"
                      name="jam_operasional"
                      value={formData.jam_operasional}
                      onChange={handleChange}
                      required
                      placeholder="Contoh: 08:00 - 16:00"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-green-700 focus:ring-1 focus:ring-green-700 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Deskripsi Singkat</label>
                  <textarea
                    name="deskripsi"
                    value={formData.deskripsi}
                    onChange={handleChange}
                    rows="2"
                    placeholder="Tuliskan jualan utama UMKM ini..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-green-700 focus:ring-1 focus:ring-green-700 transition-all resize-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Foto / Logo UMKM</label>
                  <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all relative overflow-hidden">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <Upload size={24} className="mb-2" />
                        <p className="text-sm font-semibold">Upload Foto</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* TOMBOL SUBMIT */}
            <div className="flex justify-end border-t border-gray-200 pt-6 mt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-xl flex items-center gap-2 font-bold text-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
              >
                {isLoading ? (
                  "Menyimpan..."
                ) : (
                  <>
                    <Save size={20} />
                    Simpan Data UMKM
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default UmkmForm;