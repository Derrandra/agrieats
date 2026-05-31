import { useState, useEffect } from "react";
import { Star, Filter, MessageSquareX } from "lucide-react";

import api from "../../services/api";
import SidebarKantin from "../../components/kantin/SidebarKantin";
import TopbarKantin from "../../components/kantin/TopbarKantin";

function ReviewsKantin() {
  const [reviews, setReviews] = useState([]);
  const [umkmList, setUmkmList] = useState([]); 
  const [filterUmkm, setFilterUmkm] = useState("Semua");
  const [filterRating, setFilterRating] = useState("Semua");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchUmkmList();
    fetchReviews();
  }, []);

  // Mengambil daftar UMKM untuk dropdown filter
  async function fetchUmkmList() {
    try {
      const response = await api.get("/api/pengelola/umkm");
      if (response.data) {
        setUmkmList(response.data);
      }
    } catch (error) {
      console.error("Gagal mengambil daftar UMKM:", error);
    }
  }

  // Mengambil daftar Ulasan dari Backend
  async function fetchReviews() {
    setIsLoading(true);
    try {
      // Sekarang langsung menembak ke endpoint yang sudah kamu buat!
      const response = await api.get("/api/pengelola/ulasan");
      
      // Karena backend sudah me-return array (baik isi maupun kosong []), langsung kita set.
      setReviews(response.data);

    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil ulasan:", error);
      // Jika server mati/error, pastikan layar tidak crash
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  }

  // Filter dinamis di frontend
  const filteredReviews = reviews.filter((review) => {
    const matchUmkm = filterUmkm === "Semua" || review.umkm === filterUmkm;
    const matchRating = filterRating === "Semua" || review.rating.toString() === filterRating;
    return matchUmkm && matchRating;
  });

  // Hitung rata-rata rating
  const averageRating = filteredReviews.length > 0 
    ? (filteredReviews.reduce((acc, curr) => acc + curr.rating, 0) / filteredReviews.length).toFixed(1)
    : "0.0";

  // Render komponen Bintang
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star key={index} size={16} className={index < rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"} />
    ));
  };

  return (
    <div className="flex min-h-screen bg-[#F2F0F0]">
      <SidebarKantin />
      <div className="flex-1 ml-64 p-10">
        <TopbarKantin />

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8 border-b-2 border-gray-300 pb-4 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold uppercase">Ulasan Pelanggan</h1>
            <p className="text-gray-500 mt-1">Pantau feedback pelanggan untuk menjaga kualitas kantin</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-3">
            <Star className="fill-yellow-400 text-yellow-400" size={32} />
            <div>
              <p className="text-2xl font-bold">{averageRating} <span className="text-gray-500 text-lg font-normal">/ 5.0</span></p>
            </div>
          </div>
        </div>

        {/* FILTER CONTROLS */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 mb-8 flex items-center gap-6 animate-fade-in">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-500" />
            <span className="font-semibold text-gray-700">Filter Toko:</span>
            <select 
              value={filterUmkm} 
              onChange={(e) => setFilterUmkm(e.target.value)} 
              className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-green-700 bg-gray-50 hover:bg-white cursor-pointer"
            >
              <option value="Semua">Semua Toko</option>
              {umkmList.map((umkm) => (
                <option key={umkm.id_umkm} value={umkm.nama_umkm}>
                  {umkm.nama_umkm}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Rating Bintang:</span>
            <select 
              value={filterRating} 
              onChange={(e) => setFilterRating(e.target.value)} 
              className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-green-700 bg-gray-50 hover:bg-white cursor-pointer"
            >
              <option value="Semua">Semua Rating</option>
              <option value="5">Bintang 5</option>
              <option value="4">Bintang 4</option>
              <option value="3">Bintang 3</option>
              <option value="2">Bintang 2</option>
              <option value="1">Bintang 1</option>
            </select>
          </div>
          
          {isLoading && <span className="text-green-700 text-sm font-semibold ml-auto animate-pulse">Menarik data dari database...</span>}
        </div>

        {/* LIST REVIEW */}
        <div className="space-y-4 animate-fade-in">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <div key={review.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3 transition-all hover:shadow-md">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center font-bold text-green-700">
                      {review.customer.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="font-bold text-lg text-gray-800">{review.customer}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="bg-green-50 px-2 py-0.5 rounded text-xs font-semibold text-green-700 border border-green-200">
                          {review.umkm}
                        </span>
                        <div className="flex gap-0.5">{renderStars(review.rating)}</div>
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-400">{review.date}</span>
                </div>
                <p className="text-gray-700 mt-2 text-lg leading-relaxed">{review.comment}</p>
              </div>
            ))
          ) : (
            <div className="bg-white p-12 rounded-2xl shadow-sm flex flex-col items-center justify-center text-gray-400 border border-gray-200 gap-4">
              <MessageSquareX size={48} className="text-gray-300" />
              <p className="text-lg font-medium">
                {reviews.length === 0 
                  ? "Belum ada ulasan dari pelanggan untuk kantin ini." 
                  : "Tidak ada ulasan yang sesuai dengan filter yang dipilih."}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default ReviewsKantin;