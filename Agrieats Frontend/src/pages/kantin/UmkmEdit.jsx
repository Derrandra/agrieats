import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, Save, Trash2, FileSignature } from "lucide-react";
import api from "../../services/api";

import SidebarKantin from "../../components/kantin/SidebarKantin";
import TopbarKantin from "../../components/kantin/TopbarKantin";

function UmkmEdit() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    ownerName: "",
    phone: "",
    category: "Makanan Berat",
    description: "",
    status: "Menunggu Kontrak",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadUmkmDetail();
  }, [id]);

  async function loadUmkmDetail() {
    try {
      // BACA DARI LOCAL STORAGE (Fallback)
      const savedUmkms = JSON.parse(localStorage.getItem("umkms")) || [];
      const umkm = savedUmkms.find((u) => u.id.toString() === id);

      if (umkm) {
        setFormData({
          name: umkm.name || "",
          ownerName: umkm.owner || "", 
          phone: umkm.phone || "",
          category: umkm.category || "Makanan Berat",
          description: umkm.description || "",
          status: umkm.status || "Menunggu Kontrak",
        });
        setImagePreview(umkm.image || null);
      } else {
        alert("Data UMKM tidak ditemukan!");
        navigate("/kantin/umkm");
      }
    } catch (error) {
      console.error("Gagal memuat detail UMKM:", error);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  // Fungsi untuk menyetujui kontrak awal
  function handleApproveContract() {
    setFormData((prev) => ({ ...prev, status: "Aktif" }));
  }

  // Fungsi untuk toggle aktif/nonaktif
  function handleToggleStatus() {
    setFormData((prev) => ({
      ...prev,
      status: prev.status === "Aktif" ? "Nonaktif" : "Aktif",
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      // SIMULASI UPDATE LOCAL STORAGE
      const savedUmkms = JSON.parse(localStorage.getItem("umkms")) || [];
      const updatedUmkms = savedUmkms.map((u) => {
        if (u.id.toString() === id) {
          return {
            ...u,
            name: formData.name,
            owner: formData.ownerName,
            category: formData.category,
            status: formData.status, // Akan menyimpan status terbaru dari toggle/approval
            image: imagePreview || u.image,
            description: formData.description,
            phone: formData.phone,
          };
        }
        return u;
      });

      localStorage.setItem("umkms", JSON.stringify(updatedUmkms));

      setTimeout(() => {
        navigate("/kantin/umkm");
      }, 500);
    } catch (error) {
      console.error("Gagal menyimpan perubahan:", error);
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    const confirmDelete = window.confirm(`Yakin ingin menghapus UMKM ${formData.name}?`);
    if (!confirmDelete) return;

    try {
      const savedUmkms = JSON.parse(localStorage.getItem("umkms")) || [];
      const filteredUmkms = savedUmkms.filter((u) => u.id.toString() !== id);
      localStorage.setItem("umkms", JSON.stringify(filteredUmkms));

      navigate("/kantin/umkm");
    } catch (error) {
      console.error("Gagal menghapus UMKM:", error);
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
          <div className="flex-1 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Detail & Edit UMKM</h1>
              <p className="text-gray-500 mt-1">Perbarui informasi atau status kontrak mitra</p>
            </div>
            
            {/* Status Badge Dinamis di Header */}
            <div className={`px-4 py-2 rounded-lg font-bold text-sm border transition-colors ${
              formData.status === "Aktif" ? "bg-green-100 text-green-700 border-green-200" :
              formData.status === "Menunggu Kontrak" ? "bg-yellow-100 text-yellow-700 border-yellow-200" :
              "bg-red-100 text-red-600 border-red-200"
            }`}>
              {formData.status}
            </div>
          </div>
        </div>

        {/* FORM EDIT UMKM */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div className="grid grid-cols-2 gap-8">
              
              {/* KOLOM KIRI: Data Profil */}
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Nama UMKM</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-green-700 focus:ring-1 focus:ring-green-700 transition-all" />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Nama Pemilik (Owner)</label>
                  <input type="text" name="ownerName" value={formData.ownerName} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-green-700 focus:ring-1 focus:ring-green-700 transition-all" />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Nomor Telepon / WhatsApp</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-green-700 focus:ring-1 focus:ring-green-700 transition-all" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Kategori</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-green-700 focus:ring-1 focus:ring-green-700 transition-all bg-white">
                      <option value="Makanan Berat">Makanan Berat</option>
                      <option value="Camilan">Camilan</option>
                      <option value="Minuman">Minuman</option>
                    </select>
                  </div>
                  
                  {/* LOGIKA PENGATURAN STATUS KONTRAK & TOGGLE */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Status Operasional</label>
                    
                    <div className="h-[50px] flex items-center">
                      {formData.status === "Menunggu Kontrak" ? (
                        <button
                          type="button"
                          onClick={handleApproveContract}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-semibold text-sm transition-all"
                        >
                          <FileSignature size={16} />
                          Setujui Kontrak
                        </button>
                      ) : (
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={handleToggleStatus}
                            className={`w-14 h-7 rounded-full flex items-center px-1 transition-all ${
                              formData.status === "Aktif" ? "bg-green-600 justify-end" : "bg-gray-400 justify-start"
                            }`}
                          >
                            <div className="w-5 h-5 bg-white rounded-full shadow-sm" />
                          </button>
                          <span className={`font-semibold ${formData.status === "Aktif" ? "text-green-700" : "text-gray-500"}`}>
                            {formData.status}
                          </span>
                        </div>
                      )}
                    </div>
                    
                  </div>
                </div>
              </div>

              {/* KOLOM KANAN: Foto & Deskripsi */}
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Foto / Logo UMKM</label>
                  <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all relative overflow-hidden">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-500">
                        <Upload size={32} className="mb-3" />
                        <p className="text-sm font-semibold">Klik untuk upload foto baru</p>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Deskripsi Singkat</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-green-700 focus:ring-1 focus:ring-green-700 transition-all resize-none"></textarea>
                </div>
              </div>
            </div>

            {/* TOMBOL AKSI */}
            <div className="flex justify-between items-center border-t border-gray-200 pt-6 mt-2">
              <button
                type="button"
                onClick={handleDelete}
                className="bg-white border-2 border-red-500 text-red-500 hover:bg-red-50 px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition-all"
              >
                <Trash2 size={20} />
                Hapus UMKM
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-xl flex items-center gap-2 font-bold text-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Menyimpan..." : <><Save size={20} /> Simpan Perubahan</>}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default UmkmEdit;