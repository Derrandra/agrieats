import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, saveLogin } from "../../services/auth";

function Login() {
  const navigate = useNavigate();

  // state form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // login
  function handleLogin(event) {
    event.preventDefault();

    const user = loginUser(email, password);
    console.log("USER LOGIN =", user);

    if (user) {
      saveLogin(user);

      if (user.role === "PENGELOLA") {
        navigate("/kantin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } else {
      setError("Email atau password yang Anda masukkan salah.");
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#F2F0F0]">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-[450px]">

        {/* HEADER */}
        <h1 className="text-4xl font-bold text-green-700 mb-2">AgriEats</h1>
        <p className="text-gray-500 mb-8">Login UMKM Dashboard</p>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-500 p-3 rounded-xl mb-5">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="font-medium">Email</label>
            <input
              type="email"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-3 rounded-xl mt-2 outline-none"
              required
            />
          </div>

          <div>
            <label className="font-medium">Password</label>
            <input
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-3 rounded-xl mt-2 outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-xl font-semibold"
          >
            Login
          </button>
        </form>

        {/* REGISTER */}
        <p className="text-center mt-6 text-gray-500">
          Belum punya akun?
          <Link to="/register" className="text-green-700 font-semibold ml-2">
            Sign Up
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;