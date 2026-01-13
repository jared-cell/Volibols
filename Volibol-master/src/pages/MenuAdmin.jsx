import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Jugadores from "./Jugadores"; 
import Equipos from "./Equipos"; 
import PartidosAdmin from "./PartidosAdmin"; // <-- tu componente de partidos
import "../styles/menuadmin.css";

export default function MenuAdmin() {
  const navigate = useNavigate();
  const [seccion, setSeccion] = useState("dashboard");
  const [usuario, setUsuario] = useState({ nombre: "Admin / Entrenador", rol: "admin" });
  const [jugadoresCount, setJugadoresCount] = useState(0);
  const [equiposCount, setEquiposCount] = useState(0);

  // =========================
  // PROTECCIÓN DEL PANEL
  // =========================
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData || userData.rol !== "admin") {
      navigate("/login");
    } else {
      setUsuario(userData);
    }
  }, [navigate]);

  // =========================
  // CERRAR SESIÓN
  // =========================
  const cerrarSesion = () => {
    localStorage.removeItem("userData");
    navigate("/login");
  };

  // =========================
  // CONTADOR DE JUGADORES Y EQUIPOS
  // =========================
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const { db } = await import("../firebase");
        const { collection, getDocs } = await import("firebase/firestore");

        // Contar jugadores activos
        const jugadoresCol = collection(db, "usuarios");
        const jugadoresSnap = await getDocs(jugadoresCol);
        const jugadoresList = jugadoresSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setJugadoresCount(jugadoresList.filter(j => j.activo !== false).length);

        // Contar equipos
        const equiposCol = collection(db, "equipos");
        const equiposSnap = await getDocs(equiposCol);
        setEquiposCount(equiposSnap.docs.length);
      } catch (err) {
        console.error("Error al contar jugadores/equipos:", err);
      }
    };

    fetchCounts();
  }, []);

  // =========================
  // RENDER DEL CONTENIDO
  // =========================
  const renderContenido = () => {
    switch (seccion) {
      case "dashboard":
        return (
          <div className="dashboard-content">
            <h2>📊 Dashboard Admin</h2>
            <div className="cards">
              <div className="card">
                <h3>Jugadores activos</h3>
                <p>{jugadoresCount}</p>
              </div>
              <div className="card">
                <h3>Equipos creados</h3>
                <p>{equiposCount}</p>
              </div>
              <div className="card">
                <h3>Próximos partidos</h3>
                <p>3</p>
              </div>
            </div>
          </div>
        );
      case "jugadores":
        return <Jugadores />;
      case "equipos":
        return <Equipos />;
      case "partidos":
        return <PartidosAdmin />; // <-- aquí tu JSX de PartidosAdmin
      case "estadisticas":
        return <h2>📊 Estadísticas del Equipo (pendiente)</h2>;
      case "perfil":
        return (
          <div>
            <h2>👤 Perfil Admin</h2>
            <p>Nombre: {usuario.nombre}</p>
            <p>Rol: {usuario.rol}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="admin-dashboard">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2 className="logo">🏐 Admin Panel</h2>
        <nav>
          {[
            { key: "dashboard", label: "Dashboard" },
            { key: "jugadores", label: "Jugadores" },
            { key: "equipos", label: "Equipos" },
            { key: "partidos", label: "Partidos" },
            { key: "estadisticas", label: "Estadísticas" },
            { key: "perfil", label: "Perfil Admin" },
          ].map(item => (
            <button
              key={item.key}
              className={seccion === item.key ? "active" : ""}
              onClick={() => setSeccion(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <button className="logout" onClick={cerrarSesion}>
          Cerrar sesión
        </button>
      </aside>

      {/* CONTENIDO */}
      <main className="content">{renderContenido()}</main>
    </div>
  );
}
