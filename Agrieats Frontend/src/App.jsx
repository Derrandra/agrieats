import {
  Routes,
  Route,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import MenuForm from "./pages/MenuForm";
import Menu from "./pages/Menu";

function App() {

  return (

    <Routes>

      <Route
        path="/"
        element={<Dashboard />}
      />

      <Route
        path="/orders"
        element={<Orders />}
      />

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