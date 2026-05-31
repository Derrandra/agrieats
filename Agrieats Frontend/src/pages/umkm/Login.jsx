import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    // 1. Ambil data pengguna dari localStorage (hasil register)
    const users = JSON.parse(localStorage.getItem("users")) || [];
    
    // 2. Cari pengguna yang email dan passwordnya cocok
    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      // 3. Simpan sesi login
      localStorage.setItem("currentUser", JSON.stringify(foundUser));
      
      // 4. Arahkan berdasarkan peran
      // (Memakai .peran sesuai database, tapi sedia .role sebagai cadangan)
      const userRole = foundUser.peran || foundUser.role; 
      
      if (userRole === "PENGELOLA") {
        navigate("/kantin/dashboard");
      } else if (userRole === "UMKM") {
        navigate("/dashboard");
      } else if (userRole === "MAHASISWA") {
        navigate("/home");
      } else {
        // Default jika perannya kosong atau tidak dikenali
        navigate("/home"); 
      }
    } else {
      // Bantuan Data Dummy untuk Testing Cepat (jika belum mendaftar)
      if (email === "mahasiswa@ipb.ac.id" && password === "12345678") {
        localStorage.setItem("currentUser", JSON.stringify({ name: "Mahasiswa IPB", email, peran: "MAHASISWA" }));
        navigate("/home");
      } else if (email === "umkm@agrieats.com" && password === "12345678") {
        localStorage.setItem("currentUser", JSON.stringify({ name: "Risol GC", email, peran: "UMKM" }));
        navigate("/dashboard");
      } else if (email === "pengelola@agrieats.com" && password === "12345678") {
        localStorage.setItem("currentUser", JSON.stringify({ name: "Admin Kantin", email, peran: "PENGELOLA" }));
        navigate("/kantin/dashboard");
      } else {
        alert("Email atau password salah! Silakan register terlebih dahulu jika belum punya akun.");
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#F2F0F0] flex items-center justify-center p-5 font-sans">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#15803d] mb-2">AgriEats</h1>
          <p className="text-gray-500">Silakan login ke akun Anda</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Masukkan email Anda"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-green-700 transition-colors"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Masukkan password Anda"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-green-700 transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#15803d] hover:bg-green-800 text-white font-bold py-4 rounded-xl mt-4 transition-all shadow-md text-lg"
          >
            Masuk
          </button>
        </form>

        <p className="text-center mt-8 text-gray-600 font-medium">
          Belum punya akun?{" "}
          <Link to="/register" className="text-green-700 font-bold hover:underline">
            Daftar di sini
          </Link>
        </p>

        {/* Info akun dummy untuk kemudahan testing */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800">
          <p className="font-bold mb-1">Akun Testing (Pass: 12345678):</p>
          <ul className="list-disc pl-4 space-y-0.5">
            <li>mahasiswa@ipb.ac.id (Mahasiswa)</li>
            <li>umkm@agrieats.com (UMKM)</li>
            <li>pengelola@agrieats.com (Pengelola)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Login;