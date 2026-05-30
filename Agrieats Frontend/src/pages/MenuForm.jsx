import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { Plus, Minus, Trash2 } from "lucide-react";

function MenuForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  // status toko
  const [storeOpen, setStoreOpen] = useState(true);

  function updateStoreStatus() {
    setStoreOpen(!storeOpen);
  }

  // state form menu
  const [menuName, setMenuName] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(1);
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);

  // load data kalau masuk ke mode edit
  useEffect(() => {
    if (!isEditMode) return;
    loadMenu();
  }, [id]);

  async function loadMenu() {
    try {
      /*
      =================================
      BACKEND
      GET /menus/:id
      =================================
      */
      const response = await api.get(`/menus/${id}`);
      const menu = response.data;

      setMenuName(menu.name);
      setCategory(menu.category);
      setStock(menu.stock);
      setPrice(menu.price);
      setDescription(menu.description);
      setImages(menu.images || []);
    } catch (error) {
      console.log(error);

      // fallback frontend
      const dummyMenu = {
        name: "Nasi Goreng",
        category: "Makanan Berat",
        stock: 10,
        price: "15000",
        description: "Dummy menu",
        images: ["https://images.unsplash.com/photo-1504674900247-0877df9cc836"],
      };

      setMenuName(dummyMenu.name);
      setCategory(dummyMenu.category);
      setStock(dummyMenu.stock);
      setPrice(dummyMenu.price);
      setDescription(dummyMenu.description);
      setImages(dummyMenu.images);
    }
  }

  // handle upload gambar
  function handleImageUpload(event) {
    const files = Array.from(event.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setImages(imageUrls);
  }

  // simpan menu baru atau update menu yang diedit
  async function handleSaveMenu() {
    if (!menuName || !category || !price) {
      alert("Lengkapi data menu terlebih dahulu");
      return;
    }

    const menuData = {
      name: menuName,
      category,
      stock,
      price,
      description,
      images,
    };

    try {
      if (isEditMode) {
        /*
        ======================
        PUT /menus/:id
        ======================
        */
        await api.put(`/menus/${id}`, menuData);
      } else {
        /*
        ======================
        POST /menus
        ======================
        */
        await api.post("/menus", menuData);
      }
      navigate("/menu");
    } catch (error) {
      console.log(error);
      alert("Backend belum tersedia");
    }
  }

  // hapus menu dari local storage
  async function handleDeleteMenu() {
    const confirmDelete = window.confirm("Yakin hapus menu?");
    if (!confirmDelete) return;

    try {
      /*
      ======================
      DELETE /menus/:id
      ======================
      */
      await api.delete(`/menus/${id}`);
      navigate("/menu");
    } catch (error) {
      console.log(error);
      alert("Backend belum tersedia");
    }
  }

  return (
    <div className="flex min-h-screen bg-[#F2F0F0]">
      <Sidebar />

      <div className="flex-1 ml-64 p-10">
        <Topbar storeOpen={storeOpen} updateStoreStatus={updateStoreStatus} />

        {/* bagian header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            {isEditMode ? "Edit Menu" : "Tambah Menu"}
          </h1>
        </div>

        {/* konten utama form */}
        <div className="bg-white rounded-2xl shadow p-8">
          <div className="grid grid-cols-2 gap-10">
            {/* kolom kiri: gambar */}
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
                    No Image
                  </div>
                )}
              </div>

              {/* daftar preview gambar */}
              <div className="flex gap-3">
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt="preview"
                    className="w-24 h-24 object-cover rounded-xl"
                  />
                ))}
              </div>

              {/* tombol upload gambar */}
              <label className="mt-5 bg-green-700 hover:bg-green-800 text-white px-5 py-3 rounded-xl inline-block cursor-pointer">
                Upload Image
                <input type="file" multiple hidden onChange={handleImageUpload} />
              </label>
            </div>

            {/* kolom kanan: input form */}
            <div className="space-y-6">
              <div>
                <label className="font-semibold">Nama Menu</label>
                <input
                  type="text"
                  value={menuName}
                  onChange={(e) => setMenuName(e.target.value)}
                  className="w-full border rounded-xl p-3 mt-2 outline-none"
                />
              </div>

              <div>
                <label className="font-semibold">Kategori</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border rounded-xl p-3 mt-2 outline-none"
                >
                  <option value="">Pilih Kategori</option>
                  <option value="Makanan Berat">Makanan Berat</option>
                  <option value="Minuman">Minuman</option>
                  <option value="Snack">Snack</option>
                </select>
              </div>

              <div>
                <label className="font-semibold">Stock</label>
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => setStock(stock > 0 ? stock - 1 : 0)}
                    className="bg-gray-200 p-3 rounded-lg"
                  >
                    <Minus size={18} />
                  </button>
                  <div className="px-8 py-3 bg-gray-100 rounded-lg">{stock}</div>
                  <button
                    onClick={() => setStock(stock + 1)}
                    className="bg-green-700 text-white p-3 rounded-lg"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              <div>
                <label className="font-semibold">Harga</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full border rounded-xl p-3 mt-2 outline-none"
                />
              </div>
            </div>
          </div>

          {/* deskripsi */}
          <div className="mt-10">
            <label className="font-semibold">Deskripsi Menu</label>
            <textarea
              rows="6"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-2xl p-5 mt-2 outline-none resize-none"
            />
          </div>

          {/* tombol action */}
          <div className="flex justify-between items-center mt-10">
            <div>
              {isEditMode && (
                <button
                  onClick={handleDeleteMenu}
                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-xl flex items-center gap-2"
                >
                  <Trash2 size={18} />
                  Delete Menu
                </button>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => navigate("/menu")}
                className="bg-gray-300 hover:bg-gray-400 px-6 py-3 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMenu}
                className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl"
              >
                {isEditMode ? "Update Menu" : "Tambah Menu"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuForm;