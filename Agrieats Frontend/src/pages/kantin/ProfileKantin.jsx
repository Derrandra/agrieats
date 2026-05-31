import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

import SidebarKantin from "../../components/kantin/SidebarKantin";
import TopbarKantin from "../../components/kantin/TopbarKantin";

function ProfileKantin() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  function handleLogout() {
    localStorage.removeItem("currentUser");
    navigate("/");
  }

  useEffect(() => {
    // Coba ambil data dari local storage
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    
    if (currentUser) {
      setUser(currentUser);
    } else {
      // DATA DUMMY FALLBACK
      setUser({
        name: "", // Dibiarkan kosong sesuai request sebelumnya
        email: "admin.kantin@agrieats.com",
        phone: "081234567890",
        role: "PENGELOLA",
        address: "Gedung Kantin Utama",
        image: null,
      });
    }
  }, []);

  if (!user) {
    return <div className="p-10">User tidak ditemukan</div>;
  }

  // Ambil nama (biarkan kosong jika tidak ada)
  const displayName = user.name || user.username || "";
  
  // Buat inisial untuk avatar dari nama atau email
  const initials = displayName 
    ? displayName.substring(0, 2).toUpperCase() 
    : (user.email ? user.email.substring(0, 2).toUpperCase() : "UP");

  return (
    <div className="flex min-h-screen bg-[#F2F0F0]">
      <SidebarKantin />

      <div className="flex-1 ml-64 p-10">
        <TopbarKantin />

        <div className="bg-white rounded-3xl shadow p-10">
          {/* header profil */}
          <div className="flex items-center gap-8">
            {user.image ? (
              <img
                src={user.image}
                alt="profile"
                className="w-40 h-40 rounded-full object-cover"
              />
            ) : (
              <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center text-5xl font-normal text-black">
                {initials}
              </div>
            )}
            
            <div>
              <h1 className="text-4xl font-bold">{displayName}</h1>
              <p className="text-gray-500 mt-2">{user.email}</p>
            </div>
          </div>

          {/* grid data diri */}
          <div className="grid grid-cols-2 gap-8 mt-10">
            <div>
              <label className="font-semibold">Nama Lengkap</label>
              <input
                value={displayName}
                readOnly
                className="w-full border p-3 rounded-xl mt-2 outline-none"
              />
            </div>

            <div>
              <label className="font-semibold">Email</label>
              <input
                value={user.email}
                readOnly
                className="w-full border p-3 rounded-xl mt-2 outline-none"
              />
            </div>

            <div>
              <label className="font-semibold">Nomor HP</label>
              <input
                value={user.phone || ""}
                readOnly
                className="w-full border p-3 rounded-xl mt-2 outline-none"
              />
            </div>

            <div>
              <label className="font-semibold">Role</label>
              <input
                value={
                  user.role === "PENGELOLA"
                    ? "Pengelola Kantin"
                    : "Pengelola Kantin"
                }
                readOnly
                className="w-full border p-3 rounded-xl mt-2 outline-none"
              />
            </div>
          </div>

          {/* alamat */}
          <div className="mt-8">
            <label className="font-semibold">Alamat</label>
            <textarea
              value={user.address || ""}
              readOnly
              rows="4"
              className="w-full border p-3 rounded-xl mt-2 outline-none resize-none"
            />
          </div>

          {/* tombol logout */}
          <div className="mt-8">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* modal konfirmasi logout */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-[420px]">
            <h2 className="text-2xl font-bold mb-3">Konfirmasi Logout</h2>
            <p className="text-gray-500">Apakah Anda yakin ingin keluar dari akun ini?</p>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="bg-gray-200 px-5 py-2 rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg"
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

export default ProfileKantin;