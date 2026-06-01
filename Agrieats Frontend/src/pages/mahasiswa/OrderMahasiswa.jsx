import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ShoppingBag, Clock, CreditCard, Upload, 
  ChevronLeft, CheckCircle, Image as ImageIcon 
} from "lucide-react";
import api from "../../services/api";

import SidebarMahasiswa from "../../components/mahasiswa/SidebarMahasiswa";
import TopbarMahasiswa from "../../components/mahasiswa/TopbarMahasiswa";

function Order() {
  const navigate = useNavigate();
  const [mahasiswa, setMahasiswa] = useState(null);
  
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  const [pickupTime, setPickupTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentProof, setPaymentProof] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Muat data user untuk Topbar
    const localUser = JSON.parse(localStorage.getItem("currentUser"));
    if (localUser) setMahasiswa(localUser);

    // Muat isi keranjang
    const savedCart = JSON.parse(localStorage.getItem("agrieats_cart")) || [];
    const savedTotal = Number(localStorage.getItem("agrieats_cart_total")) || 0;
    
    setCartItems(savedCart);
    setCartTotal(savedTotal);
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPaymentProof(file);
    }
  };

  const handleCheckoutSubmit = async () => {
    if (!pickupTime || !paymentMethod) {
      alert("Mohon lengkapi waktu pengambilan dan metode pembayaran!");
      return;
    }

    if (paymentMethod !== "Tunai di Kantin" && !paymentProof) {
      alert("Mohon unggah bukti pembayaran terlebih dahulu!");
      return;
    }

    setIsSubmitting(true);

    try {
      // Mengubah jam (misal "10:30") menjadi format Datetime (ISO 8601) untuk hari ini
      const today = new Date();
      const [hours, minutes] = pickupTime.split(":");
      today.setHours(Number(hours), Number(minutes), 0, 0);
      const isoDatetime = today.toISOString(); 

      // 1. Buat pesanan (Format SANGAT KETAT menyesuaikan POCreate di schema)
      const orderPayload = {
        waktu_pengambilan: isoDatetime,
        items: cartItems.map((item) => ({
          id_menu: item.id,
          kuantitas: item.quantity // Menggunakan 'kuantitas' sesuai backend
        }))
      };

      const responsePO = await api.post("/api/po/", orderPayload);
      const newOrderId = responsePO.data.id_po; 

      // 2. Upload Bukti (Jika tidak tunai)
      if (paymentMethod !== "Tunai di Kantin" && paymentProof) {
        const formData = new FormData();
        formData.append("bukti", paymentProof);

        try {
          await api.put(`/api/po/${newOrderId}/upload-bukti`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
          });
        } catch (uploadError) {
          console.error("Pesanan berhasil, tapi gagal upload bukti", uploadError);
          // Tetap lanjut karena PO-nya sudah berhasil dibuat
        }
      }
      
      // Bersihkan keranjang
      localStorage.removeItem("agrieats_cart");
      localStorage.removeItem("agrieats_cart_total");
      window.dispatchEvent(new Event("cartUpdated"));
      
      alert("Pesanan berhasil dibuat! Menunggu konfirmasi dari UMKM.");
      navigate("/history"); 

    } catch (error) {
      console.error("Gagal membuat pesanan", error);
      alert(error.response?.data?.detail || "Terjadi kesalahan saat memproses pesanan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-screen bg-[#F2F0F0] font-sans relative">
        <SidebarMahasiswa />
        <div className="flex-1 ml-64 p-10 overflow-hidden flex flex-col">
          <TopbarMahasiswa namaUser={mahasiswa?.nama_mahasiswa?.split(" ")[0] || "Mahasiswa"} />
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-white rounded-3xl shadow-sm border border-gray-200 p-10">
            <ShoppingBag size={80} className="text-gray-300 mb-6" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Belum Ada Pesanan Aktif</h2>
            <p className="mb-8">Keranjang kamu masih kosong. Yuk cari makanan dulu!</p>
            <button 
              onClick={() => navigate("/katalog-menu")}
              className="bg-[#15803d] text-white px-8 py-3 rounded-xl font-bold hover:bg-green-800 transition-colors"
            >
              Lihat Katalog Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  const namaDepan = mahasiswa?.nama_mahasiswa?.split(" ")[0] || "Mahasiswa";

  return (
    <div className="flex min-h-screen bg-[#F2F0F0] font-sans relative">
      <SidebarMahasiswa />

      <div className="flex-1 ml-64 p-10 overflow-hidden">
        <TopbarMahasiswa namaUser={namaDepan} />

        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 bg-white rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft size={24} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Selesaikan Pesanan</h1>
            <p className="text-gray-500 font-medium">Review detail pesanan dan lakukan pembayaran</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          <div className="flex-1 flex flex-col gap-6">
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <ShoppingBag size={24} className="text-[#15803d]" /> Review Pesanan
              </h2>
              
              <div className="flex flex-col gap-5">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex gap-4 items-start border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl border border-gray-100" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-gray-800 text-lg">{item.name}</h3>
                        <p className="font-bold text-[#15803d]">Rp {(item.price * item.quantity).toLocaleString("id-ID")}</p>
                      </div>
                      <p className="text-sm text-gray-500">{item.umkm_name}</p>
                      <p className="text-sm font-medium text-gray-700 mt-1">Jumlah: {item.quantity} porsi</p>
                      {item.notes && (
                        <p className="text-xs text-gray-600 bg-yellow-50 p-2 rounded-lg mt-2 italic border border-yellow-100">
                          Catatan: {item.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Clock size={24} className="text-[#15803d]" /> Waktu Pengambilan
              </h2>
              <p className="text-sm text-gray-500 mb-4">Tentukan jam berapa kamu akan mengambil pesanan di kantin.</p>
              
              <input 
                type="time" 
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="w-full max-w-xs bg-gray-50 border border-gray-200 rounded-xl p-4 text-lg font-bold text-gray-800 outline-none focus:border-[#15803d] focus:ring-1 focus:ring-[#15803d]"
              />
            </div>

          </div>

          <div className="w-full lg:w-[400px] flex flex-col gap-6">
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <CreditCard size={24} className="text-[#15803d]" /> Pembayaran
              </h2>

              <div className="flex flex-col gap-3 mb-8">
                {["QRIS", "GoPay", "Transfer Bank (BRImo/BRIVA)", "Tunai di Kantin"].map((method) => (
                  <label 
                    key={method} 
                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === method ? "border-[#15803d] bg-green-50" : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="payment_method" 
                      value={method}
                      checked={paymentMethod === method}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 accent-[#15803d]"
                    />
                    <span className="font-bold text-gray-700">{method}</span>
                  </label>
                ))}
              </div>

              {paymentMethod && paymentMethod !== "Tunai di Kantin" && (
                <div className="mb-8 animate-in fade-in zoom-in-95">
                  <p className="font-bold text-gray-800 mb-3 text-sm">Unggah Bukti Pembayaran</p>
                  
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {paymentProof ? (
                        <>
                          <CheckCircle className="w-8 h-8 text-[#15803d] mb-2" />
                          <p className="text-sm font-bold text-gray-700">{paymentProof.name}</p>
                          <p className="text-xs text-gray-500">Klik untuk mengganti gambar</p>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                          <p className="text-sm font-medium text-gray-600">Klik atau seret gambar ke sini</p>
                          <p className="text-xs text-gray-500">PNG, JPG atau JPEG (Maks. 2MB)</p>
                        </>
                      )}
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                  </label>
                </div>
              )}

              <hr className="border-gray-200 mb-6" />

              <div className="flex flex-col gap-3 mb-6 text-gray-600">
                <div className="flex justify-between items-center">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-800">Rp {cartTotal.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Biaya Layanan</span>
                  <span className="font-semibold text-gray-800">Rp 2.000</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="text-lg font-bold text-gray-800">Total Harga</span>
                <span className="text-2xl font-bold text-[#15803d]">Rp {(cartTotal + 2000).toLocaleString("id-ID")}</span>
              </div>

              <button 
                onClick={handleCheckoutSubmit}
                disabled={isSubmitting}
                className="w-full bg-[#15803d] text-white py-4 rounded-xl font-bold text-lg hover:bg-green-800 transition-colors flex items-center justify-center gap-2 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Memproses..." : "Buat Pesanan"}
                {!isSubmitting && <Upload size={20} />}
              </button>
              
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}

export default Order;