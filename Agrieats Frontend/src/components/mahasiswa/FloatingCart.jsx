import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, X, Plus, Minus, Trash2 } from "lucide-react";

export default function FloatingCart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Fungsi untuk menarik data terbaru dari localStorage
  const loadCart = () => {
    const savedCart = localStorage.getItem("agrieats_cart");
    setCart(savedCart ? JSON.parse(savedCart) : []);
  };

  useEffect(() => {
    loadCart(); // Load pertama kali saat komponen dimuat

    // Mendengarkan sinyal "cartUpdated" dari halaman manapun
    window.addEventListener("cartUpdated", loadCart);
    
    // Mendengarkan sinyal "openCartDrawer" untuk otomatis membuka laci
    const openDrawer = () => setIsCartOpen(true);
    window.addEventListener("openCartDrawer", openDrawer);

    return () => {
      window.removeEventListener("cartUpdated", loadCart);
      window.removeEventListener("openCartDrawer", openDrawer);
    };
  }, []);

  // Fungsi internal untuk mengupdate localStorage dari dalam keranjang
  const syncLocalStorage = (newCart) => {
    localStorage.setItem("agrieats_cart", JSON.stringify(newCart));
    const total = newCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    localStorage.setItem("agrieats_cart_total", total);
    // Kirim sinyal supaya semua komponen FloatingCart di tab yang sama ikut update
    window.dispatchEvent(new Event("cartUpdated")); 
  };

  const updateCartQuantity = (id, delta) => {
    const newCart = cart.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    });
    setCart(newCart);
    syncLocalStorage(newCart);
  };

  const removeFromCart = (id) => {
    const newCart = cart.filter(item => item.id !== id);
    setCart(newCart);
    syncLocalStorage(newCart);
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/order'); 
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* --- FLOATING CART BUTTON --- */}
      {cart.length > 0 && !isCartOpen && (
        <button 
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-10 right-10 z-[60] bg-[#15803d] text-white p-4 rounded-full shadow-2xl hover:bg-green-800 transition-all flex items-center gap-3 animate-in slide-in-from-bottom-5"
        >
          <div className="relative">
            <ShoppingBag size={28} />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white">
              {cartItemCount}
            </span>
          </div>
          <span className="font-bold text-lg hidden sm:block">Rp {cartTotal.toLocaleString("id-ID")}</span>
        </button>
      )}

      {/* --- CART DRAWER (SIDEBAR KANAN) --- */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-[70] transition-opacity" 
          onClick={() => setIsCartOpen(false)}
        />
      )}
      
      <div className={`fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-[80] transform transition-transform duration-300 flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-3 text-gray-800">
            <ShoppingBag size={24} className="text-[#15803d]" />
            <h2 className="text-2xl font-bold">Keranjang</h2>
          </div>
          <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4">
              <ShoppingBag size={64} opacity={0.5} />
              <p>Keranjang kamu masih kosong nih!</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 items-start border-b border-gray-100 pb-6">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl shadow-sm" />
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 line-clamp-1">{item.name}</h4>
                  <p className="text-sm text-gray-500 mb-2">{item.umkm_name}</p>
                  
                  {item.notes && (
                    <p className="text-xs text-gray-600 bg-yellow-50 p-2 rounded-md border border-yellow-100 mb-3 italic">
                      " {item.notes} "
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <p className="font-bold text-[#15803d]">Rp {(item.price * item.quantity).toLocaleString("id-ID")}</p>
                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                      <button onClick={() => updateCartQuantity(item.id, -1)} className="p-1 hover:bg-white rounded shadow-sm text-gray-600">
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                      <button onClick={() => updateCartQuantity(item.id, 1)} className="p-1 hover:bg-white rounded shadow-sm text-gray-600">
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-gray-200 bg-white">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600 font-medium">Total Pembayaran</span>
              <span className="text-2xl font-bold text-gray-800">Rp {cartTotal.toLocaleString("id-ID")}</span>
            </div>
            <button 
              onClick={handleCheckout}
              className="w-full py-4 bg-[#15803d] text-white rounded-2xl font-bold text-lg hover:bg-green-800 transition-colors shadow-md"
            >
              Checkout Sekarang
            </button>
          </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </>
  );
}