import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ProductCard({ name, price, stock, image }) {
  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden flex flex-col">
      <div className="h-40 bg-gray-200">
        {/* Gunakan gambar dari database, kalau kosong pakai placeholder */}
        <img 
          src={image || "https://via.placeholder.com/300?text=No+Image"} 
          alt={name} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-lg mb-1">{name}</h3>
          <p className="text-gray-500 mb-3">Rp {price}</p>
        </div>
        <div className="flex justify-between items-center">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {stock ? 'Tersedia' : 'Habis'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;