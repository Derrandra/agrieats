import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

import Sidebar from "../../components/umkm/layout/Sidebar";
import Topbar from "../../components/umkm/layout/Topbar";
import { Plus, Minus, Trash2 } from "lucide-react";

function MenuForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  // Status toko
  const [storeOpen, setStoreOpen] = useState(true);

  function updateStoreStatus() {
    setStoreOpen(!storeOpen);
  }

  // State form menu
  const [menuName, setMenuName] = useState("");
  const [category, setCategory] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  
  // State untuk gambar
  const [images, setImages] = useState([]); // Untuk preview gambar di layar
  const [imageFile, setImageFile] = useState(null); // Untuk file fisik yang dikirim ke backend

  // Load data kalau masuk ke mode edit
  useEffect(() => {
    if (!isEditMode) return;
    loadMenu();
  }, [id]);

  async function loadMenu() {
    try {
      const response = await api.get(`/api/menu/${id}`);
      const menu = response.data;

      setMenuName(menu.nama_menu);
      setCategory(menu.id_kategori || "");
      setIsAvailable(menu.ketersediaan === true);
      setPrice(menu.harga);
      setDescription(menu.tag_makanan || "");
      if (menu.foto_menu) {
        // Jika ada URL foto dari backend, pasang untuk preview
        setImages([`http://127.0.0.1:8000${menu.foto_menu}`]); 
      }
    } catch (error) {
      console.log("Gagal load data menu", error);
    }
  }

  // Handle upload gambar
  function handleImageUpload(event) {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      // Simpan file asli ke state imageFile
      setImageFile(files[0]);
      
      // Buat URL preview
      const imageUrls = files.map((file) => URL.createObjectURL(file));
      setImages(imageUrls);
    }
  }

  // Simpan menu baru atau update menu yang diedit
  async function handleSaveMenu() {
    if (!menuName || !price) {
      alert("Lengkapi nama menu dan harga terlebih dahulu");
      return;
    }

    // Gunakan FormData untuk mengirim file dan teks sekaligus
    const formData = new FormData();
    formData.append("nama_menu", menuName);
    formData.append("harga", price);
    
    if (category) formData.append("id_kategori", category);
    formData.append("ketersediaan", isAvailable ? "true" : "false");
    if (description) formData.append("tag_makanan", description);
    
    if (imageFile) {
      formData.append("foto", imageFile);
    }

    try {
      if (isEditMode) {
        await api.put(`/api/menu/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Menu berhasil diupdate!");
      } else {
        await api.post("/api/menu/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Menu baru berhasil ditambahkan!");
      }
      navigate("/dashboard");
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Gagal menyimpan menu. Cek console.");
    }
  }

  // Hapus menu
  async function handleDeleteMenu() {
    const confirmDelete = window.confirm("Yakin hapus menu ini?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/api/menu/${id}`);
      alert("Menu dihapus");
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      alert("Gagal menghapus menu.");
    }
  }

  return (
    <div className="flex min-h-screen bg-[#F2F0F0]">
      <Sidebar />

      <div className="flex-1 ml-64 p-10">
        <Topbar storeOpen={storeOpen} updateStoreStatus={updateStoreStatus} />

        {/* Bagian header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            {isEditMode ? "Edit Menu" : "Tambah Menu"}
          </h1>
        </div>

        {/* Konten utama form */}
        <div className="bg-white rounded-2xl shadow p-8">
          <div className="grid grid-cols-2 gap-10">
            
            {/* Kolom kiri: Gambar */}
            <div>
              <div className="w-full h-96 bg-gray-100 rounded-2xl overflow-hidden mb-5">
                {images.length > 0 ? (
                  <img
                    src={images[0]}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex justify-center items-center text-gray-400">
                    Belum ada gambar
                  </div>
                )}
              </div>

              {/* Tombol upload gambar */}
              <label className="mt-5 bg-green-700 hover:bg-green-800 text-white px-5 py-3 rounded-xl inline-block cursor-pointer transition-colors">
                Pilih Gambar
                <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
              </label>
            </div>

            {/* Kolom kanan: Input form */}
            <div className="space-y-6">
              <div>
                <label className="font-semibold text-gray-700">Nama Menu</label>
                <input
                  type="text"
                  value={menuName}
                  onChange={(e) => setMenuName(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-3 mt-2 outline-none focus:border-green-700 transition-colors"
                  placeholder="Contoh: Nasi Goreng Spesial"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700">Kategori</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-3 mt-2 outline-none focus:border-green-700 transition-colors bg-white"
                >
                  <option value="">Pilih Kategori</option>
                  {/* Pastikan value ini sesuai dengan ID atau teks yang diharapkan database */}
                  <option value="Makanan Berat">Makanan Berat</option>
                  <option value="Minuman">Minuman</option>
                  <option value="Snack">Snack</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-gray-700">Status Ketersediaan</label>
                <select
                  value={isAvailable ? "true" : "false"}
                  onChange={(e) => setIsAvailable(e.target.value === "true")}
                  className="w-full border border-gray-300 rounded-xl p-3 mt-2 outline-none focus:border-green-700 transition-colors bg-white"
                >
                  <option value="true">Tersedia</option>
                  <option value="false">Habis</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-gray-700">Harga (Rp)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-3 mt-2 outline-none focus:border-green-700 transition-colors"
                  placeholder="Contoh: 15000"
                />
              </div>
            </div>
          </div>

          {/* Deskripsi */}
          <div className="mt-10">
            <label className="font-semibold text-gray-700">Deskripsi / Tag Makanan</label>
            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-2xl p-5 mt-2 outline-none focus:border-green-700 transition-colors resize-none"
              placeholder="Tambahkan deskripsi singkat atau tag (misal: pedas, manis, gurih)..."
            />
          </div>

          {/* Tombol Action */}
          <div className="flex justify-between items-center mt-10">
            <div>
              {isEditMode && (
                <button
                  onClick={handleDeleteMenu}
                  className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 px-5 py-3 rounded-xl flex items-center gap-2 transition-colors font-medium"
                >
                  <Trash2 size={18} />
                  Hapus Menu
                </button>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl transition-colors font-medium"
              >
                Batal
              </button>
              <button
                onClick={handleSaveMenu}
                className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-xl transition-colors font-medium shadow-sm"
              >
                {isEditMode ? "Simpan Perubahan" : "Tambah Menu"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuForm;