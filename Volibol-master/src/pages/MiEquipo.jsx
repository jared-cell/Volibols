import "../styles/MenuUsuario.css"
import "../styles/MiEquipo.css"
import { useNavigate } from "react-router-dom"
import { signOut } from "firebase/auth"
import { auth } from "../firebase"
import {
  FaHome,
  FaUsers,
  FaVolleyballBall,
  FaSignOutAlt
} from "react-icons/fa"

export default function MiEquipo() {

  const navigate = useNavigate()

  const cerrarSesion = async () => {
    await signOut(auth)
    navigate("/login")
  }

  return (
    <div className="dashboard">

      <aside className="sidebar">
        <div>
          <h2 className="logo">VolleyApp</h2>

          <nav className="menu">
            <button onClick={() => navigate("/menu")}>
              <FaHome /> Inicio
            </button>

            <button className="active">
              <FaUsers /> Mi equipo
            </button>

            <button onClick={() => navigate("/partidos")}>
              <FaVolleyballBall /> Partidos
            </button>
          </nav>
        </div>

        <button className="logout" onClick={cerrarSesion}>
          <FaSignOutAlt /> Cerrar sesión
        </button>
      </aside>

      <main className="content team-page">
        <h1>Mi Equipo</h1>
        <p className="subtitle">
          Información general del equipo
        </p>

        <section className="team-card">
          <h2>Thunder</h2>

          <div className="team-info">
            <div>
              <span>Categoría</span>
              <strong>Juvenil</strong>
            </div>

            <div>
              <span>Estado</span>
              <strong className="active">Activo</strong>
            </div>

            <div>
              <span>Jugadores</span>
              <strong>12</strong>
            </div>
          </div>
        </section>

        <section className="players-section">
          <h3>Compañeros de equipo</h3>

          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Edad</th>
                <th>Posición</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Juan Pérez</td>
                <td>18</td>
                <td>Rematador</td>
              </tr>
              <tr>
                <td>Carlos Gómez</td>
                <td>17</td>
                <td>Colocador</td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
    </div>
  )
}
