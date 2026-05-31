import { Routes, Route } from "react-router-dom";

import Login from "./pages/umkm/Login";
import Register from "./pages/umkm/Register";
import Dashboard from "./pages/umkm/Dashboard";
import Menu from "./pages/umkm/Menu";
import MenuForm from "./pages/umkm/MenuForm";
import Orders from "./pages/umkm/Orders";
import Profile from "./pages/umkm/Profile";

import DashboardKantin from "./pages/kantin/DashboardKantin";
import UmkmManagement from "./pages/kantin/UmkmManagement";
import UmkmForm from "./pages/kantin/UmkmForm";
import UmkmEdit from "./pages/kantin/UmkmEdit";
import ProfileKantin from "./pages/kantin/ProfileKantin";
import ReportKantin from "./pages/kantin/ReportKantin"; 
import ReviewsKantin from "./pages/kantin/ReviewsKantin"; 

function App() {
  return (
    <Routes>

      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/menu/add" element={<MenuForm />} />
      <Route path="/menu/edit/:id" element={<MenuForm />} />      
      <Route path="/orders" element={<Orders />} />
      <Route path="/profile" element={<Profile />} />

      <Route path="/kantin/dashboard" element={<DashboardKantin />} />
      <Route path="/kantin/umkm" element={<UmkmManagement />} />
      <Route path="/kantin/umkm/add" element={<UmkmForm />} />
      <Route path="/kantin/umkm/edit/:id" element={<UmkmEdit />} />
      <Route path="/kantin/profile" element={<ProfileKantin />} />
      <Route path="/kantin/report" element={<ReportKantin />} />
      <Route path="/kantin/reviews" element={<ReviewsKantin />} />
      
    </Routes>
  );
}

export default App;