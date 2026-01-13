import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import "../styles/menuadmin.css";

export default function MenuAdmin() {
  const [seccion, setSeccion] = useState("dashboard");
  const [jugadores, setJugadores] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [usuario, setUsuario] = useState({ nombre: "Admin / Entrenador", rol: "admin" });

  // =========================
  // CERRAR SESIÓN
  // =========================
  const cerrarSesion = async () => {
    await signOut(auth);
    localStorage.removeItem("userData");
    window.location.href = "/login"; // redirige al login
  };

  // =========================
  // CARGAR JUGADORES
  // =========================
  const cargarJugadores = async () => {
    const jugadoresCol = collection(db, "usuarios");
    const jugadoresSnap = await getDocs(jugadoresCol);
    const jugadoresList = jugadoresSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setJugadores(jugadoresList);
  };

  // =========================
  // CARGAR EQUIPOS
  // =========================
  const cargarEquipos = async () => {
    const equiposCol = collection(db, "equipos"); // colección "equipos"
    const equiposSnap = await getDocs(equiposCol);
    const equiposList = equiposSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setEquipos(equiposList);
  };

  useEffect(() => {
    cargarJugadores();
    cargarEquipos();
  }, []);

  // =========================
  // Contenido dinámico
  // =========================
  const renderContenido = () => {
    switch (seccion) {
      case "dashboard":
        return (
          <div>
            <h2>📊 Dashboard Admin</h2>
            <p>Jugadores registrados: {jugadores.length}</p>
            <p>Equipos creados: {equipos.length}</p>
            <p>Próximos partidos: 3</p>
          </div>
        );
      case "jugadores":
        return (
          <div>
            <h2>🧑‍🤝‍🧑 Gestión de Jugadores</h2>
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Edad</th>
                  <th>Peso</th>
                  <th>Posición</th>
                </tr>
              </thead>
              <tbody>
                {jugadores.map(j => (
                  <tr key={j.id}>
                    <td>{j.nombre}</td>
                    <td>{j.edad}</td>
                    <td>{j.peso}</td>
                    <td>{j.posicion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "equipos":
        return (
          <div>
            <h2>🏟️ Gestión de Equipos</h2>
            <button className="btn-editar" onClick={() => alert("Agregar equipo (pendiente CRUD)")}>
              ➕ Agregar equipo
            </button>
            <table>
              <thead>
                <tr>
                  <th>Nombre del equipo</th>
                  <th>Jugadores</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {equipos.map(e => (
                  <tr key={e.id}>
                    <td>{e.nombre}</td>
                    <td>{e.jugadores?.length || 0}</td>
                    <td>
                      <button className="btn-editar" onClick={() => alert("Editar equipo")}>Editar</button>
                      <button className="btn-eliminar" onClick={() => alert("Eliminar equipo")}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "partidos":
        return <h2>🏐 Gestión de Partidos (pendiente implementar CRUD)</h2>;
      case "estadisticas":
        return <h2>📊 Estadísticas del Equipo (pendiente implementar)</h2>;
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
        <h2>🏐 Admin Panel</h2>
        <nav>
          <button onClick={() => setSeccion("dashboard")}>Dashboard</button>
          <button onClick={() => setSeccion("jugadores")}>Jugadores</button>
          <button onClick={() => setSeccion("equipos")}>Equipos</button>
          <button onClick={() => setSeccion("partidos")}>Partidos</button>
          <button onClick={() => setSeccion("estadisticas")}>Estadísticas</button>
          <button onClick={() => setSeccion("perfil")}>Perfil Admin</button>
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
