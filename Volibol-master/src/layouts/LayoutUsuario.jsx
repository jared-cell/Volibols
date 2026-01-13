import { Link, Outlet } from "react-router-dom"
import "../styles/MenuUsuario.css"

export default function LayoutUsuario() {
  return (
    <div className="dashboard">

      {/* MENU LATERAL */}
      <aside className="sidebar">
        <h2 className="logo">VolleyDash</h2>

        <nav className="menu">
          <Link to="/menu">Dashboard</Link>
          <Link to="/mi-equipo">Mi Equipo</Link>
        </nav>
      </aside>

      {/* CONTENIDO */}
      <main className="content">
        <Outlet />
      </main>

    </div>
  )
}
