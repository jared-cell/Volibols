import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import MenuUsuario from "./pages/MenuUsuario"
import MiEquipo from "./pages/MiEquipo"
import Partidos from "./pages/Partidos"
import MenuAdmin from "./pages/MenuAdmin"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Páginas públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Páginas de usuario */}
        <Route path="/menu" element={<MenuUsuario />} />
        <Route path="/mi-equipo" element={<MiEquipo />} />
        <Route path="/partidos" element={<Partidos />} />

        {/* Página admin protegida desde MenuAdmin.jsx */}
        <Route path="/menu-admin" element={<MenuAdmin />} />
      </Routes>
    </BrowserRouter>
  )
}
