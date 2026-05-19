import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
    if (isEditMode) {
      const savedMenus = JSON.parse(localStorage.getItem("menus")) || [];
      const selectedMenu = savedMenus.find((menu) => menu.id === Number(id));

      if (selectedMenu) {
        setMenuName(selectedMenu.name);
        setCategory(selectedMenu.category);
        setStock(selectedMenu.stock);
        setPrice(selectedMenu.price);
        setDescription(selectedMenu.description);
        setImages(
          selectedMenu.images || (selectedMenu.image ? [selectedMenu.image] : [])
        );
      }
    }
  }, []);

  // handle upload gambar
  function handleImageUpload(event) {
    const files = Array.from(event.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setImages(imageUrls);
  }

  // simpan menu baru atau update menu yang diedit
  function handleSaveMenu() {
    const savedMenus = JSON.parse(localStorage.getItem("menus")) || [];
    const menuData = {
      id: isEditMode ? Number(id) : Date.now(),
      name: menuName,
      category,
      stock,
      price,
      description,
      image: images[0],
      images,
    };

    if (isEditMode) {
      const updatedMenus = savedMenus.map((menu) =>
        menu.id === Number(id) ? menuData : menu
      );
      localStorage.setItem("menus", JSON.stringify(updatedMenus));
    } else {
      savedMenus.push(menuData);
      localStorage.setItem("menus", JSON.stringify(savedMenus));
    }

    navigate("/menu");
  }

  // hapus menu dari local storage
  function handleDeleteMenu() {
    const savedMenus = JSON.parse(localStorage.getItem("menus")) || [];
    const filteredMenus = savedMenus.filter((menu) => menu.id !== Number(id));
    localStorage.setItem("menus", JSON.stringify(filteredMenus));
    navigate("/menu");
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
                <input
                  type="file"
                  multiple
                  hidden
                  onChange={handleImageUpload}
                />
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
                    onClick={() => setStock(stock - 1)}
                    className="bg-gray-200 p-3 rounded-lg"
                  >
                    <Minus size={18} />
                  </button>
                  <div className="px-8 py-3 bg-gray-100 rounded-lg">
                    {stock}
                  </div>
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