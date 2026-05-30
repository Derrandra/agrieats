import {
  Routes,
  Route
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Menu from "./pages/Menu";
import MenuForm from "./pages/MenuForm";

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

    </Routes>

  );

}

export default App;