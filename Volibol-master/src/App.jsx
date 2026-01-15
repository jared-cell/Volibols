import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "./pages/Login"
import Register from "./pages/Register"

// USUARIO
import MenuUsuario from "./pages/MenuUsuario"
import MiEquipo from "./pages/MiEquipo"
import Partidos from "./pages/Partidos"

// ENTRENADOR
import MenuEntrenador from "./pages/MenuEntrenador"

// ADMIN
import MenuAdmin from "./pages/MenuAdmin"
import EquiposAdmin from "./pages/EquipoAdmin"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN ÚNICO */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* USUARIO */}
        <Route path="/menu" element={<MenuUsuario />} />
        <Route path="/mi-equipo" element={<MiEquipo />} />
        <Route path="/partidos" element={<Partidos />} />

        {/* ENTRENADOR */}
        <Route path="/menu-entrenador" element={<MenuEntrenador />} />

        {/* ADMIN */}
        <Route path="/menu-admin" element={<MenuAdmin />} />
        <Route path="/equipos-admin" element={<EquiposAdmin />} />

      </Routes>
    </BrowserRouter>
  )
}
