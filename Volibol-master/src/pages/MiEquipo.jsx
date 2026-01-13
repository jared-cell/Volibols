import { useState, useEffect } from "react";
import "../styles/menuusuario.css";
import "../styles/miequipo.css";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { FaHome, FaUsers, FaVolleyballBall, FaSignOutAlt } from "react-icons/fa";

export default function MiEquipo() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [equipo, setEquipo] = useState(null);
  const [jugadores, setJugadores] = useState([]);

  // =========================
  // PROTECCIÓN Y DATOS DEL USUARIO
  // =========================
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData) {
      navigate("/login");
    } else {
      setUsuario(userData);
    }
  }, [navigate]);

  // =========================
  // CARGAR EQUIPO DEL USUARIO
  // =========================
  const cargarEquipo = async () => {
    if (!usuario) return;

    try {
      const equiposCol = collection(db, "equipos");
      const equiposSnap = await getDocs(equiposCol);
      const equiposList = equiposSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const miEquipo = equiposList.find(e => e.jugadores?.includes(usuario.uid));
      setEquipo(miEquipo);

      if (miEquipo) {
        // Cargar info de jugadores
        const jugadoresCol = collection(db, "usuarios");
        const jugadoresSnap = await getDocs(jugadoresCol);
        const jugadoresList = jugadoresSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const jugadoresEquipo = jugadoresList.filter(j => miEquipo.jugadores.includes(j.uid));
        setJugadores(jugadoresEquipo);
      }
    } catch (err) {
      console.error("Error al cargar equipo:", err);
    }
  };

  useEffect(() => {
    cargarEquipo();
  }, [usuario]);

  // =========================
  // CERRAR SESIÓN
  // =========================
  const cerrarSesion = async () => {
    await signOut(auth);
    localStorage.removeItem("userData");
    navigate("/login");
  };

  return (
    <div className="dashboard team-page">

      <aside className="sidebar">
        <div>
          <h2 className="logo">VolleyApp</h2>
          <nav className="menu">
            <button onClick={() => navigate("/menu")}><FaHome /> Inicio</button>
            <button className="active"><FaUsers /> Mi equipo</button>
            <button onClick={() => navigate("/partidos")}><FaVolleyballBall /> Partidos</button>
          </nav>
        </div>
        <button className="logout" onClick={cerrarSesion}><FaSignOutAlt /> Cerrar sesión</button>
      </aside>

      <main className="content team-page">
        <h1>Mi Equipo</h1>
        {!equipo && <p>No perteneces a ningún equipo todavía.</p>}

        {equipo && (
          <>
            <section className="team-card">
              <h2>{equipo.nombre}</h2>
              <div className="team-info">
                <div>
                  <span>Jugadores</span>
                  <strong>{jugadores.length}</strong>
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
                  {jugadores.map(j => (
                    <tr key={j.uid}>
                      <td>{j.nombre}</td>
                      <td>{j.edad}</td>
                      <td>{j.posicion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
