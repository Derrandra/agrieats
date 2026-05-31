import { useState, useEffect } from "react";
import { Star, Search, Filter } from "lucide-react";

import api from "../../services/api";
import SidebarKantin from "../../components/kantin/SidebarKantin";
import TopbarKantin from "../../components/kantin/TopbarKantin";

function ReviewsKantin() {
  const [reviews, setReviews] = useState([]);
  const [filterUmkm, setFilterUmkm] = useState("Semua");
  const [filterRating, setFilterRating] = useState("Semua");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    setIsLoading(true);
    try {
      /* // TODO: KONEKSI BACKEND
      const response = await api.get("/kantin/reviews");
      setReviews(response.data);
      */
      
      // JIKA BACKEND BELUM SIAP
      throw new Error("Backend belum siap");

    } catch (error) {
      console.log("Menggunakan fallback data dummy review:", error);
      // Dummy Data Ulasan
      setReviews([
        { id: 1, customer: "Andi Wijaya", umkm: "Risol GC", rating: 5, date: "30 Mei 2026", comment: "Risolnya enak banget, isiannya full daging dan pelayanannya cepat!" },
        { id: 2, customer: "Siti Aminah", umkm: "Cireng BC", rating: 4, date: "29 Mei 2026", comment: "Bumbunya mantap, tapi antrinya agak lama karena lagi rame." },
        { id: 3, customer: "Budi Santoso", umkm: "Ayam Geprek", rating: 5, date: "29 Mei 2026", comment: "Ayamnya krispi, sambalnya nendang pol. Rekomen buat makan siang." },
        { id: 4, customer: "Dina Lestari", umkm: "Jus Andra", rating: 3, date: "28 Mei 2026", comment: "Jus alpukatnya agak kemanisan buat saya, mungkin gulanya bisa dikurangin dikit." },
        { id: 5, customer: "Kevin", umkm: "Risol GC", rating: 5, date: "28 Mei 2026", comment: "Udah langganan banget selalu beli kalau ke kantin." },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  // Filter berjalan di sisi frontend agar lebih responsif
  const filteredReviews = reviews.filter((review) => {
    const matchUmkm = filterUmkm === "Semua" || review.umkm === filterUmkm;
    const matchRating = filterRating === "Semua" || review.rating.toString() === filterRating;
    return matchUmkm && matchRating;
  });

  // Render Bintang
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
        <div className="flex justify-between items-center mb-8 border-b-2 border-gray-300 pb-4">
          <div>
            <h1 className="text-3xl font-bold uppercase">Ulasan Pelanggan</h1>
            <p className="text-gray-500 mt-1">Pantau feedback pelanggan untuk menjaga kualitas kantin</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-3">
            <Star className="fill-yellow-400 text-yellow-400" size={32} />
            <div>
              <p className="text-2xl font-bold">4.7 <span className="text-gray-500 text-lg font-normal">/ 5.0</span></p>
            </div>
          </div>
        </div>

        {/* FILTER CONTROLS */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 mb-8 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-500" />
            <span className="font-semibold text-gray-700">Filter UMKM:</span>
            <select value={filterUmkm} onChange={(e) => setFilterUmkm(e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-green-700">
              <option value="Semua">Semua UMKM</option>
              <option value="Risol GC">Risol GC</option>
              <option value="Cireng BC">Cireng BC</option>
              <option value="Ayam Geprek">Ayam Geprek</option>
              <option value="Jus Andra">Jus Andra</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Rating Bintang:</span>
            <select value={filterRating} onChange={(e) => setFilterRating(e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-green-700">
              <option value="Semua">Semua Rating</option>
              <option value="5">Bintang 5</option>
              <option value="4">Bintang 4</option>
              <option value="3">Bintang 3</option>
              <option value="2">Bintang 2</option>
              <option value="1">Bintang 1</option>
            </select>
          </div>
          
          {isLoading && <span className="text-gray-400 text-sm italic ml-auto">Memuat ulasan...</span>}
        </div>

        {/* LIST REVIEW */}
        <div className="space-y-4">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <div key={review.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
                      {review.customer.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="font-bold text-lg">{review.customer}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-semibold text-gray-600 border border-gray-200">
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
            <div className="bg-white p-10 rounded-2xl shadow-sm text-center text-gray-500 border border-gray-200">
              Tidak ada ulasan yang sesuai dengan filter.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default ReviewsKantin;