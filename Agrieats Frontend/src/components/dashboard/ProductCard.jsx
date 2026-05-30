import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ProductCard({ name, price, stock, isAddCard }) {
  const navigate = useNavigate();

  // tampilan untuk card tambah menu
  if (isAddCard) {
    return (
      <div
        onClick={() => navigate("/menu/add")}
        className="bg-white rounded-2xl shadow h-[250px] flex flex-col justify-center 
        items-center cursor-pointer border-2 border-dashed border-gray-300 hover:border-green-700 hover:text-green-700 transition-all"
      >
        <Plus size={40} />
        <p className="mt-3 font-semibold">Tambah Menu</p>
      </div>
    );
  }

  // tampilan untuk card produk biasa
  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <img
        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
        alt={name}
        className="h-40 w-full object-cover rounded-xl"
      />
      <h2 className="font-bold mt-3">{name}</h2>
      <p className="text-gray-500">Rp {price}</p>
      <p className={stock ? "text-green-700" : "text-red-500"}>
        {stock ? "Tersedia" : "Habis"}
      </p>
    </div>
  );
}

export default ProductCard;