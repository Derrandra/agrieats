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
      await loginUser(email, password);

      const user = await getCurrentUser();
      
      // Simpan data user ke localStorage agar UI lain (seperti Navbar) bisa menampilkan nama/fotonya
      localStorage.setItem("currentUser", JSON.stringify(user));
      const userRole = user.peran;
      
      if (userRole === "PENGELOLA") {
        navigate("/kantin/dashboard");
      } else if (userRole === "UMKM") {
        navigate("/dashboard"); // Sesuaikan path ini dengan router di App.jsx milikmu
      } else if (userRole === "MAHASISWA") {
        navigate("/home");
      } else {
        navigate("/home"); 
      }
      
    } catch (error) {
      console.error("Gagal login:", error);
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
            <label className="block text-gray-700 font-semibold mb-2">NIM / Email</label>
            <input
              type="text" // Ubah jadi text agar mahasiswa bisa input NIM
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Masukkan NIM (Mahasiswa) atau Email (UMKM)"
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
            disabled={isLoading}
            className={`w-full text-white font-bold py-4 rounded-xl mt-4 transition-all shadow-md text-lg 
              ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#15803d] hover:bg-green-800'}`}
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