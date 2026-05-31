import {
  Routes,
  Route
} from "react-router-dom";

import Login from "./pages/umkm/Login";
import Register from "./pages/umkm/Register";
import Profile from "./pages/umkm/Profile";
import Dashboard from "./pages/umkm/Dashboard";
import Orders from "./pages/umkm/Orders";
import Menu from "./pages/umkm/Menu";
import MenuForm from "./pages/umkm/MenuForm";

import DashboardKantin from "./pages/kantin/DashboardKantin";
import UmkmManagement from "./pages/kantin/UmkmManagement";
import UmkmForm from "./pages/kantin/UmkmForm";
import UmkmEdit from "./pages/kantin/UmkmEdit";

function App() {

  return (

    <Routes>

      <Route
        path="/profile"
        element={<Profile />}
      />

      {/* AUTH */}

      <Route
        path="/"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      {/* DASHBOARD */}

      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      {/* ORDERS */}

      <Route
        path="/orders"
        element={<Orders />}
      />

      {/* MENU */}

      <Route
        path="/menu"
        element={<Menu />}
      />

      <Route
        path="/menu/add"
        element={<MenuForm />}
      />

      <Route
        path="/menu/edit/:id"
        element={<MenuForm />}
      />
      
      <Route
        path="/kantin/dashboard"
        element={<DashboardKantin />}
      />

      <Route 
        path="/kantin/umkm"
        element={<UmkmManagement />}
      />

      <Route
        path="/kantin/umkm/add"
        element={<UmkmForm />}
      />

      <Route
        path="/kantin/umkm/edit/:id"
        element={<UmkmEdit />}
      />

    </Routes>

  );

}

export default App;