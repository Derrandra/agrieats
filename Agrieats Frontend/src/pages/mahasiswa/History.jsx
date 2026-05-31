import { useState } from "react";
import { Clock, CheckCircle, XCircle, Receipt, Star, Upload, X, Image as ImageIcon } from "lucide-react";

import SidebarMahasiswa from "../../components/mahasiswa/SidebarMahasiswa";
import TopbarMahasiswa from "../../components/mahasiswa/TopbarMahasiswa";

function History() {
  const [activeTab, setActiveTab] = useState("Semua");

  const [historyOrders] = useState([
    { 
      id: "ORD-20260531-001", 
      umkm_name: "Warkop HS Central", 
      date: "31 Mei 2026, 10:30 WIB", 
      status: "Diproses", 
      total: 17000,
      items: "1x Mie Rebus Spesial, 1x Es Teh Manis"
    },
    { 
      id: "ORD-20260530-089", 
      umkm_name: "Bakmie Tjan Ho", 
      date: "30 Mei 2026, 12:15 WIB", 
      status: "Selesai", 
      total: 25000,
      items: "1x Kwetiau Siram Sapi"
    },
    { 
      id: "ORD-20260528-042", 
      umkm_name: "Ayam Geprek Bensu", 
      date: "28 Mei 2026, 16:45 WIB", 
      status: "Dibatalkan", 
      total: 20000,
      items: "1x Ayam Geprek Sambal Matah"
    }
  ]);

  const tabs = ["Semua", "Diproses", "Selesai", "Dibatalkan"];

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedOrderForReview, setSelectedOrderForReview] = useState(null);
  
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewPhoto, setReviewPhoto] = useState(null);

  const filteredOrders = historyOrders.filter(itemOrder => 
    activeTab === "Semua" ? true : itemOrder.status === activeTab
  );

  const getStatusColor = (status) => {
    switch(status) {
      case "Diproses": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Selesai": return "bg-green-100 text-green-700 border-green-200";
      case "Dibatalkan": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "Diproses": return <Clock size={16} />;
      case "Selesai": return <CheckCircle size={16} />;
      case "Dibatalkan": return <XCircle size={16} />;
      default: return null;
    }
  };

  const openReviewModal = (itemOrder) => {
    setSelectedOrderForReview(itemOrder);
    setRating(5);
    setHoverRating(0);
    setReviewComment("");
    setReviewPhoto(null);
    setIsReviewModalOpen(true);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReviewPhoto(file.name);
    }
  };

  const submitReview = () => {
    console.log("Ulasan dikirim:", {
      orderId: selectedOrderForReview.id,
      rating,
      comment: reviewComment,
      photo: reviewPhoto
    });
    alert("Terima kasih! Ulasan kamu telah dikirim ke UMKM.");
    setIsReviewModalOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-[#F2F0F0] font-sans relative">
      <SidebarMahasiswa />

      <div className="flex-1 ml-64 p-10 overflow-hidden">
        <TopbarMahasiswa namaUser="Luthfi" />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Riwayat Pesanan</h1>
          <p className="text-gray-500 font-medium mt-1">Pantau status pesananmu di sini</p>
        </div>

        <div className="flex gap-4 mb-8 border-b border-gray-200 pb-4">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all ${
                activeTab === tab 
                ? "bg-[#15803d] text-white shadow-md" 
                : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-6">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((itemOrder) => (
              <div key={itemOrder.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-md transition-shadow">
                
                <div className="flex items-start gap-5 flex-1">
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <Receipt size={32} className="text-[#15803d]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-xl text-gray-800">{itemOrder.umkm_name}</h3>
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold border flex items-center gap-1.5 ${getStatusColor(itemOrder.status)}`}>
                        {getStatusIcon(itemOrder.status)} {itemOrder.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">{itemOrder.date} • {itemOrder.id}</p>
                    <p className="text-gray-700 font-medium bg-gray-50 inline-block px-3 py-1.5 rounded-lg border border-gray-100">
                      {itemOrder.items}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                  <p className="text-sm text-gray-500">Total Belanja</p>
                  <p className="text-2xl font-bold text-[#15803d]">Rp {itemOrder.total.toLocaleString("id-ID")}</p>
                  {itemOrder.status === "Selesai" && (
                    <div className="flex gap-2 mt-2">
                      <button 
                        onClick={() => openReviewModal(itemOrder)}
                        className="px-5 py-2 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-xl font-bold text-sm hover:bg-yellow-100 transition-colors"
                      >
                        Beri Ulasan
                      </button>
                    </div>
                  )}
                </div>

              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-200">
              <Receipt size={64} className="text-gray-300 mb-4" />
              <p className="text-lg font-bold text-gray-600">Belum ada riwayat pesanan</p>
              <p className="text-gray-400 text-sm">Pesananmu dengan status "{activeTab}" akan muncul di sini.</p>
            </div>
          )}
        </div>

      </div>

      {isReviewModalOpen && selectedOrderForReview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 p-8">
            
            <button 
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">Beri Ulasan</h2>
            <p className="text-gray-500 mb-6">Ceritakan pengalamanmu memesan di {selectedOrderForReview.umkm_name}</p>

            <div className="flex justify-center gap-2 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star 
                    size={40} 
                    className={`${(hoverRating || rating) >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} 
                  />
                </button>
              ))}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">Komentar (Opsional)</label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Gimana rasa makanannya? Pelayanannya oke nggak?"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 outline-none focus:border-[#15803d] focus:ring-1 focus:ring-[#15803d] transition-all resize-none h-28"
              />
            </div>

            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-700 mb-2">Foto Makanan (Opsional)</label>
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {reviewPhoto ? (
                    <div className="flex items-center gap-2 text-[#15803d]">
                      <CheckCircle size={20} />
                      <span className="font-bold text-sm">{reviewPhoto}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-500">
                      <ImageIcon size={20} />
                      <span className="text-sm font-medium">Unggah foto pesananmu</span>
                    </div>
                  )}
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
              </label>
            </div>

            <button 
              onClick={submitReview}
              className="w-full bg-[#15803d] text-white py-4 rounded-xl font-bold text-lg hover:bg-green-800 transition-colors shadow-md flex justify-center items-center gap-2"
            >
              <Upload size={20} />
              Kirim Ulasan
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

export default History;