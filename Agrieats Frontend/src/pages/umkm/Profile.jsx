import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

import Sidebar from "../../components/umkm/layout/Sidebar";
import Topbar from "../../components/umkm/layout/Topbar";

function Profile() {
  const navigate = useNavigate();
  const [storeOpen, setStoreOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  function updateStoreStatus() {
    setStoreOpen(!storeOpen);
  }

  function handleLogout() {
    localStorage.removeItem("currentUser");
    navigate("/");
  }

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    setUser(currentUser);
  }, []);

  if (!user) {
    return <div className="p-10">User tidak ditemukan</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#F2F0F0]">
      <Sidebar />

      <div className="flex-1 ml-64 p-10">
        <Topbar 
          storeOpen={storeOpen} 
          updateStoreStatus={updateStoreStatus} 
        />

        <div className="bg-white rounded-3xl shadow p-10">
          {/* header profil */}
          <div className="flex items-center gap-8">
            <img
              src={user.image}
              alt="profile"
              className="w-40 h-40 rounded-full object-cover"
            />
            <div>
              <h1 className="text-4xl font-bold">{user.name}</h1>
              <p className="text-gray-500 mt-2">{user.email}</p>
            </div>
          </div>

          {/* grid data diri */}
          <div className="grid grid-cols-2 gap-8 mt-10">
            <div>
              <label className="font-semibold">Nama Lengkap</label>
              <input
                value={user.name}
                readOnly
                className="w-full border p-3 rounded-xl mt-2"
              />
            </div>

            <div>
              <label className="font-semibold">Email</label>
              <input
                value={user.email}
                readOnly
                className="w-full border p-3 rounded-xl mt-2"
              />
            </div>

            <div>
              <label className="font-semibold">Nomor HP</label>
              <input
                value={user.phone}
                readOnly
                className="w-full border p-3 rounded-xl mt-2"
              />
            </div>

            <div>
              <label className="font-semibold">Role</label>
              <input
                value={
                  user.role === "PENGELOLA"
                    ? "Pengelola Kantin"
                    : "UMKM"
                }
                readOnly
                className="w-full border p-3 rounded-xl mt-2"
              />
            </div>
          </div>

          {/* alamat */}
          <div className="mt-8">
            <label className="font-semibold">Alamat</label>
            <textarea
              value={user.address}
              readOnly
              rows="4"
              className="w-full border p-3 rounded-xl mt-2"
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

export default Profile;