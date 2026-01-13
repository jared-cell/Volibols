import "../styles/menuusuario.css"
import "../styles/partidos.css"
import { useNavigate } from "react-router-dom"
import { signOut } from "firebase/auth"
import { auth } from "../firebase"
import {
  FaHome,
  FaUsers,
  FaVolleyballBall,
  FaSignOutAlt
} from "react-icons/fa"

export default function Partidos() {

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

            <button onClick={() => navigate("/mi-equipo")}>
              <FaUsers /> Mi equipo
            </button>

            <button className="active">
              <FaVolleyballBall /> Partidos
            </button>
          </nav>
        </div>

        <button className="logout" onClick={cerrarSesion}>
          <FaSignOutAlt /> Cerrar sesión
        </button>
      </aside>

      <main className="content partidos-page">
        <h1>Mis Partidos</h1>
        <p className="subtitle">
          Consulta los enfrentamientos de tu equipo
        </p>

        <section className="partidos-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Encuentro</th>
                <th>Fecha</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>P-301</td>
                <td>Thunder vs Lightning</td>
                <td>20 Oct 2023</td>
                <td><span className="badge upcoming">Próximo</span></td>
              </tr>

              <tr>
                <td>P-288</td>
                <td>Thunder vs Nets</td>
                <td>10 Oct 2023</td>
                <td><span className="badge done">Finalizado</span></td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
    </div>
  )
}
