import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Save } from "lucide-react";
import api from "../../services/api";

import SidebarKantin from "../../components/kantin/SidebarKantin";
import TopbarKantin from "../../components/kantin/TopbarKantin";

function UmkmForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    ownerName: "",
    phone: "",
    category: "Makanan Berat",
    description: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
      /* // TODO: KONEKSI BACKEND
      const data = new FormData();
      data.append("name", formData.name);
      data.append("ownerName", formData.ownerName);
      data.append("phone", formData.phone);
      data.append("category", formData.category);
      data.append("description", formData.description);
      // data.append("image", fileGambar);

      await api.post("/umkms", data);
      */

      // SIMULASI SIMPAN LOKAL (FALLBACK)
      const newUmkm = {
        id: Date.now(), // Buat ID unik sementara
        image: imagePreview || "https://via.placeholder.com/150", // Gunakan preview gambar atau placeholder
        name: formData.name,
        category: formData.category,
        owner: formData.ownerName, // Disamakan dengan properti owner di UmkmManagement
        status: "Menunggu Kontrak", // Status default untuk UMKM baru
      };

      // Ambil data yang ada di local storage, lalu tambahkan data baru
      const existingUmkms = JSON.parse(localStorage.getItem("umkms")) || [];
      existingUmkms.push(newUmkm);
      localStorage.setItem("umkms", JSON.stringify(existingUmkms));

      setTimeout(() => {
        navigate("/kantin/umkm");
      }, 1000);
      
    } catch (error) {
      console.error("Gagal menambahkan UMKM:", error);
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
              {/* KOLOM KIRI: Data Profil */}
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Nama UMKM
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Contoh: Risol GC"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-green-700 focus:ring-1 focus:ring-green-700 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Nama Pemilik (Owner)
                  </label>
                  <input
                    type="text"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    required
                    placeholder="Contoh: Budi Santoso"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-green-700 focus:ring-1 focus:ring-green-700 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Nomor Telepon / WhatsApp
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="Contoh: 081234567890"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-green-700 focus:ring-1 focus:ring-green-700 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Kategori Jualan
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-green-700 focus:ring-1 focus:ring-green-700 transition-all bg-white"
                  >
                    <option value="Makanan Berat">Makanan Berat</option>
                    <option value="Camilan">Camilan</option>
                    <option value="Minuman">Minuman</option>
                  </select>
                </div>
              </div>

              {/* KOLOM KANAN: Foto & Deskripsi */}
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Foto / Logo UMKM
                  </label>
                  <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all relative overflow-hidden">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-500">
                        <Upload size={32} className="mb-3" />
                        <p className="text-sm font-semibold">Klik untuk upload foto</p>
                        <p className="text-xs mt-1">PNG, JPG (Max. 2MB)</p>
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

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Deskripsi Singkat
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Tuliskan deskripsi singkat mengenai UMKM ini..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-green-700 focus:ring-1 focus:ring-green-700 transition-all resize-none"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* TOMBOL SUBMIT */}
            <div className="flex justify-end border-t border-gray-200 pt-6 mt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-xl flex items-center gap-2 font-bold text-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
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