import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  
  // State untuk menyembunyikan/menampilkan role lanjutan
  const [showAdvancedRoles, setShowAdvancedRoles] = useState(false);

  // State mencakup SEMUA kolom dari database
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    peran: "MAHASISWA", // Default selalu mahasiswa

    nim: "",
    prodi: "",
    telepon: "",

    nama_u_kantin: "",
    kontak_pengelola: "",
    nama_pj_usaha: "",

    id_pengelola: "", 
    nama_umkm: "",
    lokasi: "",
    jam_operasional: "",
    deskripsi: "",
  });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  // Fungsi rahasia untuk memunculkan role admin/umkm
  function toggleAdvancedRoles() {
    if (!showAdvancedRoles) {
      // Saat mode mitra dibuka, otomatis pindahkan peran ke UMKM
      setFormData({ ...formData, peran: "UMKM" });
    } else {
      // Saat ditutup, kembalikan secara default ke MAHASISWA
      setFormData({ ...formData, peran: "MAHASISWA" });
    }
    setShowAdvancedRoles(!showAdvancedRoles);
  }

  function handleSubmit(e) {
    e.preventDefault();
    
    let payload = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      peran: formData.peran
    };

    if (formData.peran === "MAHASISWA") {
      payload = { ...payload, nim: formData.nim, prodi: formData.prodi, telepon: formData.telepon };
    } else if (formData.peran === "PENGELOLA") {
      payload = { ...payload, nama_u_kantin: formData.nama_u_kantin, kontak_pengelola: formData.kontak_pengelola, nama_pj_usaha: formData.nama_pj_usaha };
    } else if (formData.peran === "UMKM") {
      payload = { ...payload, id_pengelola: formData.id_pengelola, nama_umkm: formData.nama_umkm, lokasi: formData.lokasi, jam_operasional: formData.jam_operasional, deskripsi: formData.deskripsi };
    }

    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
    existingUsers.push(payload);
    localStorage.setItem("users", JSON.stringify(existingUsers));
    
    console.log("Data yang akan dikirim ke Backend:", payload);
    alert("Registrasi berhasil! Silakan login.");
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-[#F2F0F0] flex items-center justify-center p-5 font-sans py-10">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl p-8 relative overflow-hidden">
        
        {/* Pita penanda jika mendaftar sebagai Mitra/Pengelola */}
        {formData.peran !== "MAHASISWA" && (
          <div className="absolute top-5 right-[-35px] bg-yellow-400 text-yellow-900 text-xs font-bold px-10 py-1 rotate-45 shadow-sm">
            MITRA MODE
          </div>
        )}

        <h1 className="text-3xl font-bold text-center text-[#15803d] mb-2">Daftar AgriEats</h1>
        <p className="text-center text-gray-500 mb-8">
          {formData.peran === "MAHASISWA" ? "Buat akun mahasiswa untuk mulai memesan" : "Portal Pendaftaran Mitra & Pengelola"}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          {/* BAGIAN 1: INFORMASI AKUN DASAR */}
          <div className="p-5 border border-gray-200 rounded-2xl bg-gray-50">
            <h2 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">Informasi Akun</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">Username</label>
                <input type="text" name="username" value={formData.username} onChange={handleChange} required placeholder="Contoh: luthfimhrrm" className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-green-700 text-sm" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Contoh: email@apps.ipb.ac.id" className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-green-700 text-sm" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-semibold mb-2 text-sm">Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Minimal 8 karakter" className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-green-700 text-sm" />
              </div>
            </div>
          </div>

          {/* BAGIAN 2: PEMILIHAN PERAN (HANYA UMKM & PENGELOLA) */}
          {showAdvancedRoles && (
            <div className="animate-fade-in">
              <label className="block text-gray-700 font-bold mb-3">Pilih Jalur Pendaftaran Khusus:</label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`flex items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all ${formData.peran === "UMKM" ? "border-yellow-500 bg-yellow-50 text-yellow-800 font-bold shadow-sm" : "border-gray-200 hover:bg-gray-50 text-gray-600 font-medium"}`}>
                  <input type="radio" name="peran" value="UMKM" checked={formData.peran === "UMKM"} onChange={handleChange} className="hidden" />
                  Mitra UMKM
                </label>
                
                <label className={`flex items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all ${formData.peran === "PENGELOLA" ? "border-blue-600 bg-blue-50 text-blue-800 font-bold shadow-sm" : "border-gray-200 hover:bg-gray-50 text-gray-600 font-medium"}`}>
                  <input type="radio" name="peran" value="PENGELOLA" checked={formData.peran === "PENGELOLA"} onChange={handleChange} className="hidden" />
                  Pengelola
                </label>
              </div>
            </div>
          )}

          {/* BAGIAN 3: FORM DINAMIS (Berdasarkan Peran) */}
          
          {/* --- FORM MAHASISWA --- */}
          {formData.peran === "MAHASISWA" && (
            <div className="p-5 border border-green-200 rounded-2xl bg-white animate-fade-in shadow-sm">
              <h2 className="font-bold text-lg mb-4 text-[#15803d] border-b border-green-100 pb-2">Data Mahasiswa</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">NIM</label>
                  <input type="text" name="nim" value={formData.nim} onChange={handleChange} required placeholder="Contoh: G64012010XX" className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-green-700 text-sm" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">Program Studi</label>
                  <input type="text" name="prodi" value={formData.prodi} onChange={handleChange} required placeholder="Contoh: Ilmu Komputer" className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-green-700 text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">Nomor Telepon</label>
                  <input type="tel" name="telepon" value={formData.telepon} onChange={handleChange} required placeholder="Contoh: 081234567890" className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-green-700 text-sm" />
                </div>
              </div>
            </div>
          )}

          {/* --- FORM UMKM --- */}
          {formData.peran === "UMKM" && (
            <div className="p-5 border border-yellow-300 rounded-2xl bg-white animate-fade-in shadow-sm">
              <h2 className="font-bold text-lg mb-4 text-yellow-700 border-b border-yellow-100 pb-2">Detail Usaha (UMKM)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">Nama UMKM</label>
                  <input type="text" name="nama_umkm" value={formData.nama_umkm} onChange={handleChange} required placeholder="Contoh: Risol GC" className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-yellow-500 text-sm" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">Lokasi Kantin</label>
                  <input type="text" name="lokasi" value={formData.lokasi} onChange={handleChange} required placeholder="Contoh: Kantin FMIPA" className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-yellow-500 text-sm" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">Jam Operasional</label>
                  <input type="text" name="jam_operasional" value={formData.jam_operasional} onChange={handleChange} required placeholder="Contoh: 08:00 - 16:00" className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-yellow-500 text-sm" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">ID Pengelola (Kantin Tujuan)</label>
                  <input type="text" name="id_pengelola" value={formData.id_pengelola} onChange={handleChange} required placeholder="Masukkan ID Pengelola" className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-yellow-500 text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">Deskripsi Singkat</label>
                  <textarea name="deskripsi" value={formData.deskripsi} onChange={handleChange} rows="3" placeholder="Jelaskan sedikit tentang jualan Anda..." className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-yellow-500 text-sm resize-none"></textarea>
                </div>
              </div>
            </div>
          )}

          {/* --- FORM PENGELOLA KANTIN --- */}
          {formData.peran === "PENGELOLA" && (
            <div className="p-5 border border-blue-300 rounded-2xl bg-white animate-fade-in shadow-sm">
              <h2 className="font-bold text-lg mb-4 text-blue-700 border-b border-blue-100 pb-2">Detail Pengelola Kantin</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">Nama Unit Kantin</label>
                  <input type="text" name="nama_u_kantin" value={formData.nama_u_kantin} onChange={handleChange} required placeholder="Contoh: Kantin SSMI" className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-blue-600 text-sm" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">Nama Penanggung Jawab</label>
                  <input type="text" name="nama_pj_usaha" value={formData.nama_pj_usaha} onChange={handleChange} required placeholder="Sesuai KTP" className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-blue-600 text-sm" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">Kontak Pengelola</label>
                  <input type="tel" name="kontak_pengelola" value={formData.kontak_pengelola} onChange={handleChange} required placeholder="Nomor Aktif" className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-blue-600 text-sm" />
                </div>
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className={`w-full text-white font-bold py-4 rounded-xl mt-2 transition-all text-lg shadow-md ${
              formData.peran === "UMKM" ? "bg-yellow-500 hover:bg-yellow-600" :
              formData.peran === "PENGELOLA" ? "bg-blue-600 hover:bg-blue-700" :
              "bg-[#15803d] hover:bg-green-800"
            }`}
          >
            Selesaikan Pendaftaran
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600 font-medium">
          Sudah punya akun?{" "}
          <Link to="/" className="text-green-700 font-bold hover:underline">
            Login di sini
          </Link>
        </p>

        {/* Teks rahasia untuk memunculkan pendaftaran mitra (Sangat kecil dan samar) */}
        <div className="mt-8 text-center">
          <button 
            type="button" 
            onClick={toggleAdvancedRoles}
            className="text-[10px] text-gray-300 hover:text-gray-500 transition-colors cursor-pointer outline-none"
          >
            {showAdvancedRoles ? "Batalkan mode mitra" : "Portal internal: Daftarkan mitra / pengelola"}
          </button>
        </div>

      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default Register;