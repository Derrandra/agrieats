import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, getCurrentUser } from "../../services/auth"; 

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("1. Mengirim request login ke server dengan identitas:", email);
      await loginUser(email, password);
      
      console.log("2. Login API berhasil! Mengambil data profil user (me)...");
      const user = await getCurrentUser();
      
      console.log("3. Data user berhasil ditarik:", user);
      
      // Simpan data user ke localStorage
      localStorage.setItem("currentUser", JSON.stringify(user));
      
      // Gunakan toUpperCase() agar aman dari masalah huruf besar/kecil
      const userRole = user.peran ? user.peran.toUpperCase() : "";
      console.log("4. Role user terdeteksi sebagai:", userRole);
      
      if (userRole === "PENGELOLA") {
        console.log("5. Mengarahkan ke Dashboard Pengelola...");
        navigate("/kantin/dashboard");
      } else if (userRole === "UMKM") {
        console.log("5. Mengarahkan ke Dashboard UMKM...");
        navigate("/dashboard"); 
      } else if (userRole === "MAHASISWA") {
        console.log("5. Mengarahkan ke Home Mahasiswa...");
        navigate("/home");
      } else {
        console.log("Role tidak dikenali, melempar ke /home default");
        navigate("/home"); 
      }
      
    } catch (error) {
      console.error("GAGAL LOGIN. Detail Error:", error);
      alert("Gagal Masuk! Pastikan ID/NIM dan Password sesuai dengan yang ada di Database.");
    } finally {
      setIsLoading(false);
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
            <label className="block text-gray-700 font-semibold mb-2">NIM / Email / Username</label>
            <input
              type="text" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Masukkan identitas login Anda"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-green-700 transition-colors bg-gray-50 focus:bg-white"
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
              className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-green-700 transition-colors bg-gray-50 focus:bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full text-white font-bold py-4 rounded-xl mt-4 transition-all shadow-md text-lg 
              ${isLoading ? 'bg-green-400 cursor-not-allowed' : 'bg-[#15803d] hover:bg-green-800'}`}
          >
            {isLoading ? "Memeriksa Data..." : "Masuk"}
          </button>
        </form>

        <p className="text-center mt-8 text-gray-600 font-medium">
          Belum punya akun?{" "}
          <Link to="/register" className="text-green-700 font-bold hover:underline">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;