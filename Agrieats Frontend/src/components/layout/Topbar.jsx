import { Bell, UserCircle } from "lucide-react";

function Topbar({ storeOpen, updateStoreStatus }) {
  return (
    <div className="bg-green-800 rounded-2xl p-5 shadow flex justify-between items-center mb-8">
      {/* info admin */}
      <div>
        <h1 className="text-2xl font-bold text-white">Welcome, UMKM X!</h1>
        <p className="text-white">Dashboard Admin</p>
      </div>

      {/* kontrol status toko & icon profil */}
      <div className="flex items-center gap-5 text-white">
        <div className="flex items-center gap-3">
          <p className="font-medium">
            {storeOpen ? "Toko Buka" : "Toko Tutup"}
          </p>

          <button
            onClick={updateStoreStatus}
            className={`w-16 h-8 rounded-full flex items-center px-1 transition-all ${
              storeOpen ? "bg-green-400 justify-end" : "bg-red-600 justify-start"
            }`}
          >
            <div className="w-6 h-6 bg-white rounded-full" />
          </button>
        </div>
        
        <Bell />
        <UserCircle size={35} />
      </div>
    </div>
  );
}

export default Topbar;