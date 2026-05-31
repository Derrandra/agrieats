import { useState } from "react";
import { X, Star, Store, Minus, Plus, ShoppingCart, Clock, Flame } from "lucide-react";

export default function MenuDetailModal({ menu, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  if (!menu) return null;

  const handleAdd = () => setQuantity(prev => prev + 1);
  const handleMin = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const totalHarga = menu.price * quantity;

  return (
    // Overlay Background Gelap & Blur
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      
      {/* Container Modal */}
      <div 
        className="bg-white rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Tombol Close Mengambang */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/90 p-2 rounded-full shadow-md hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Gambar Banner Header */}
        <div className="w-full h-64 relative">
          <img 
            src={menu.image} 
            alt={menu.name} 
            className="w-full h-full object-cover"
          />
          {/* Label Contoh */}
          <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-1.5 rounded-xl font-bold flex items-center gap-2 text-sm shadow-md">
            <Flame size={16} /> Best Seller
          </div>
        </div>

        {/* Konten Detail */}
        <div className="p-8">
          <div className="flex justify-between items-start gap-4 mb-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{menu.name}</h2>
              <div className="flex items-center gap-4 text-sm font-medium text-gray-600">
                <p className="flex items-center gap-1.5 text-[#15803d] bg-green-50 px-3 py-1 rounded-lg">
                  <Store size={16} /> {menu.umkm_name}
                </p>
                <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg">
                  <Star size={16} className="fill-yellow-500 text-yellow-500" />
                  {menu.rating}
                </div>
                <div className="flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1 rounded-lg">
                  <Clock size={16} />
                  ~10 Min
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-[#15803d]">
                Rp {Number(menu.price).toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          {/* Deskripsi */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-2">Deskripsi</h3>
            <p className="text-gray-600 leading-relaxed">
              {menu.description || "Hidangan lezat yang dimasak dengan bumbu pilihan terbaik, disajikan hangat untuk menemani hari-harimu di kampus. Cocok dinikmati kapan saja!"}
            </p>
          </div>

          <hr className="border-gray-200 mb-6" />

          {/* Input Catatan */}
          <div className="mb-8">
            <h3 className="font-bold text-gray-800 mb-2">Catatan untuk Penjual (Opsional)</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Jangan pakai daun bawang ya, sambalnya dipisah aja."
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 outline-none focus:border-[#15803d] focus:ring-1 focus:ring-[#15803d] transition-all resize-none h-24"
            />
          </div>

          {/* Footer Aksi (Quantity & Add to Cart) */}
          <div className="flex gap-6 items-center">
            {/* Counter */}
            <div className="flex items-center bg-gray-100 rounded-2xl border border-gray-200 p-1">
              <button 
                onClick={handleMin}
                className="p-3 bg-white rounded-xl shadow-sm text-gray-600 hover:text-[#15803d] transition-colors"
              >
                <Minus size={20} />
              </button>
              <span className="w-16 text-center font-bold text-xl text-gray-800">
                {quantity}
              </span>
              <button 
                onClick={handleAdd}
                className="p-3 bg-[#15803d] rounded-xl shadow-sm text-white hover:bg-green-800 transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>

            {/* Tombol Add */}
            <button 
              onClick={() => onAddToCart({ ...menu, quantity, notes, totalHarga })}
              disabled={menu.stock <= 0}
              className="flex-1 bg-[#15803d] text-white py-4 rounded-2xl font-bold text-lg hover:bg-green-800 transition-colors flex items-center justify-center gap-3 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md"
            >
              <ShoppingCart size={24} />
              {menu.stock > 0 ? `Tambah - Rp ${totalHarga.toLocaleString("id-ID")}` : 'Stok Habis'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}