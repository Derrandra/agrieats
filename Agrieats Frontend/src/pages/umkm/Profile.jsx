import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Edit2, Save } from "lucide-react";
import api from "../../services/api"; 

import Sidebar from "../../components/umkm/layout/Sidebar";
import Topbar from "../../components/umkm/layout/Topbar";

function Profile() {
  const navigate = useNavigate();
  const [storeOpen, setStoreOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  // State disesuaikan dengan schema UmkmResponse backend
  const [user, setUser] = useState({
    id_umkm: "",
    nama_umkm: "",
    username: "",
    email: "",
    lokasi: "",
    jam_operasional: "",
    deskripsi: "",
    peran: ""
  });

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const response = await api.get("/api/umkm/me"); 
      setUser(response.data);
      // Sinkronisasi status buka toko dengan database
      setStoreOpen(response.data.status_buka); 
    } catch (error) {
      console.error("Gagal memuat profil", error);
    }
  }

  // Fungsi Toggle Status Buka/Tutup Toko
  async function updateStoreStatus() {
    const newStatus = !storeOpen;
    // Set UI lebih dulu agar terasa cepat
    setStoreOpen(newStatus); 
    try {
      // Tembak endpoint toggle manual milikmu
      await api.put(`/api/umkm/${user.id_umkm}/toggle`, { status_buka: newStatus });
    } catch (error) {
      console.error("Gagal mengubah status toko", error);
      // Kembalikan ke asal jika gagal
      setStoreOpen(!newStatus); 
    }
  }

  async function handleSave() {
    try {
      // CATATAN: Pastikan kamu membuat endpoint PUT /api/umkm/me di backend nanti
      await api.put("/api/umkm/me", user);
      setIsEditing(false);
      alert("Profil berhasil diperbarui!");
    } catch (error) {
      console.warn("Gagal memperbarui profil (Pastikan endpoint PUT /me sudah dibuat di backend).", error);
      setIsEditing(false); // Tetap tutup mode edit sementara
    }
  }

  function handleLogout() {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <div className="flex min-h-screen bg-[#F2F0F0]">
      <Sidebar />
      <div className="flex-1 ml-64 p-10">
        {/* Topbar sekarang terhubung langsung ke database untuk buka/tutup toko */}
        <Topbar storeOpen={storeOpen} updateStoreStatus={updateStoreStatus} />

        <div className="bg-white rounded-3xl shadow p-10">
          {/* HEADER PROFIL */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-8">
              <img 
                src="https://ui-avatars.com/api/?name=UMKM&background=15803d&color=fff" 
                alt="profile" 
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-100 shadow-sm" 
              />
              <div>
                <h1 className="text-4xl font-bold">{user.nama_umkm || "Nama Toko"}</h1>
                <p className="text-gray-500 mt-2">{user.email}</p>
                <div className="mt-2 inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                  {user.peran}
                </div>
              </div>
            </div>
            <button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="bg-[#15803d] text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold hover:bg-[#166534] transition-all"
            >
              {isEditing ? <><Save size={18}/> Simpan</> : <><Edit2 size={18}/> Edit Profil</>}
            </button>
          </div>

          {/* GRID DATA DIRI */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <label className="font-semibold text-gray-700">Nama Toko / UMKM</label>
              <input
                value={user.nama_umkm || ""}
                onChange={(e) => isEditing && setUser({...user, nama_umkm: e.target.value})}
                readOnly={!isEditing}
                className={`w-full border p-3 rounded-xl mt-2 outline-none ${isEditing ? "border-green-500" : "bg-gray-50 border-gray-200"}`}
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700">Nama Pemilik (Username)</label>
              <input
                value={user.username || ""}
                onChange={(e) => isEditing && setUser({...user, username: e.target.value})}
                readOnly={!isEditing}
                className={`w-full border p-3 rounded-xl mt-2 outline-none ${isEditing ? "border-green-500" : "bg-gray-50 border-gray-200"}`}
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700">Email (Tidak bisa diubah)</label>
              <input
                value={user.email || ""}
                readOnly
                className="w-full border p-3 rounded-xl mt-2 outline-none bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700">Jam Operasional</label>
              <input
                value={user.jam_operasional || ""}
                onChange={(e) => isEditing && setUser({...user, jam_operasional: e.target.value})}
                readOnly={!isEditing}
                placeholder="Contoh: Senin - Jumat (08:00 - 16:00)"
                className={`w-full border p-3 rounded-xl mt-2 outline-none ${isEditing ? "border-green-500" : "bg-gray-50 border-gray-200"}`}
              />
            </div>
          </div>

          {/* ALAMAT & DESKRIPSI */}
          <div className="mt-8 space-y-6">
            <div>
              <label className="font-semibold text-gray-700">Lokasi / Alamat Lengkap</label>
              <textarea
                value={user.lokasi || ""}
                onChange={(e) => isEditing && setUser({...user, lokasi: e.target.value})}
                readOnly={!isEditing}
                rows="3"
                className={`w-full border p-3 rounded-xl mt-2 outline-none ${isEditing ? "border-green-500" : "bg-gray-50 border-gray-200"}`}
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700">Deskripsi Singkat Toko</label>
              <textarea
                value={user.deskripsi || ""}
                onChange={(e) => isEditing && setUser({...user, deskripsi: e.target.value})}
                readOnly={!isEditing}
                rows="2"
                placeholder="Deskripsikan makanan/minuman yang dijual..."
                className={`w-full border p-3 rounded-xl mt-2 outline-none ${isEditing ? "border-green-500" : "bg-gray-50 border-gray-200"}`}
              />
            </div>
          </div>

          {/* TOMBOL LOGOUT */}
          <div className="mt-10 pt-8 border-t border-gray-100">
            <button 
              onClick={() => setShowLogoutModal(true)} 
              className="bg-red-50 hover:bg-red-100 text-red-600 px-6 py-3 rounded-xl flex items-center gap-2 font-semibold transition-all"
            >
              <LogOut size={20} /> Logout Akun UMKM
            </button>
          </div>
        </div>
      </div>

      {/* MODAL LOGOUT */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-[420px] shadow-2xl">
            <h2 className="text-2xl font-bold mb-3">Konfirmasi Logout</h2>
            <p className="text-gray-500">Apakah Anda yakin ingin keluar dari akun toko ini?</p>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-2.5 rounded-xl transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;