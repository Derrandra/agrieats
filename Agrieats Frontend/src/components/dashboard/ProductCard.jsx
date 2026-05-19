import { Plus } from "lucide-react";

function ProductCard({ name, price, stock, isAddCard }) {
  
  // tampilan untuk card tambah menu
  if (isAddCard) {
    return (
      <div className="border-2 border-dashed border-gray-400 rounded-2xl flex flex-col items-center 
      justify-center min-h-80 cursor-pointer hover:bg-gray-50 transition">
        <Plus size={50} className="text-gray-400" />
        <h1 className="mt-3 text-xl font-bold text-gray-500">Add Menu</h1>
      </div>
    );
  }

  // tampilan untuk card produk biasa
  return (
    <div className="bg-white p-5 rounded-2xl shadow">
      {/* placeholder gambar */}
      <div className="h-40 bg-gray-200 rounded-xl mb-4" />

      <h1 className="text-xl font-bold">{name}</h1>
      <p className="text-gray-600">Rp {price}</p>

      <p className={`mt-2 font-semibold ${stock ? "text-green-600" : "text-red-500"}`}>
        {stock ? "Stok Tersedia" : "Stok Kosong"}
      </p>

      <button className="mt-4 w-full bg-gray-200 py-2 rounded-lg">
        Detail
      </button>
    </div>
  );
}

export default ProductCard;