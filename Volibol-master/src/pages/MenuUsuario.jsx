import "../styles/menuusuario.css";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import Calendario from "../components/Calendario.jsx";
import PerfilUsuario from "../components/PerfilUsuario.jsx"; // IMPORTAMOS tu componente
import {
  FaHome,
  FaUsers,
  FaVolleyballBall,
  FaSignOutAlt
} from "react-icons/fa";

export default function MenuUsuario() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [filterDate, setFilterDate] = useState("");
  const [modalPerfil, setModalPerfil] = useState(false);

  /* =========================
     PROTECCIÓN DE SESIÓN
  ========================= */
  useEffect(() => {
    const cargarUsuario = async () => {
      if (!auth.currentUser) {
        navigate("/login");
        return;
      }

      const uid = auth.currentUser.uid;
      const docRef = doc(db, "usuarios", uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        navigate("/login");
        return;
      }

      setUsuario(docSnap.data());
    };

    cargarUsuario();
  }, [navigate]);

  /* =========================
     CERRAR SESIÓN
  ========================= */
  const cerrarSesion = async () => {
    await signOut(auth);
    navigate("/login");
  };

  /* =========================
     PARTIDOS (EJEMPLO)
  ========================= */
  const partidos = [
    { id: "M-201", rival: "Thunder vs Lightning", fecha: "2023-10-20", estado: "Próximo" },
    { id: "M-198", rival: "Thunder vs Nets", fecha: "2023-10-10", estado: "Finalizado" },
    { id: "M-205", rival: "Thunder vs Storm", fecha: "2023-10-25", estado: "Próximo" }
  ];

  const partidosFiltrados = filterDate
    ? partidos.filter(p => p.fecha === filterDate)
    : partidos;

  if (!usuario) return <p style={{ padding: 30 }}>Cargando...</p>;

  return (
    <div className="dashboard">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div>
          <h2 className="logo">🏐 VolleyApp</h2>

          <nav className="menu">
            <button className="active">
              <FaHome /> Inicio
            </button>

            <button onClick={() => navigate("/mi-equipo")}>
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

      {/* CONTENIDO */}
      <main className="content">

        {/* HEADER */}
        <header className="header">
          <div>
            <h1>Mi Panel</h1>
            <p>Hola, {usuario.nombre?.split(" ")[0]} 👋</p>
          </div>

          <div className="user-box" onClick={() => setModalPerfil(true)}>
            <img src="https://i.pravatar.cc/100" alt="usuario" />
          </div>
        </header>

        {/* CARDS */}
        <section className="cards">
          <div className="card blue">
            <span>🏐</span>
            <small>Mi posición</small>
            <strong>{usuario.posicion || "Soy nuevo"}</strong>
          </div>

          <div className="card orange">
            <span>📊</span>
            <small>Experiencia</small>
            <strong>
              {usuario.experiencia
                ? `${usuario.aniosExperiencia} años`
                : "Nuevo"}
            </strong>
          </div>

          <div className="card green">
            <span>📅</span>
            <small>Próximo partido</small>
            <strong>2 días</strong>
          </div>
        </section>

        {/* TABLA */}
        <section className="table-section">
          <div className="table-header">
            <h2>Mis partidos</h2>
            <Calendario onFiltrar={setFilterDate} />
          </div>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Rival</th>
                <th>Fecha</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {partidosFiltrados.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.rival}</td>
                  <td>{p.fecha}</td>
                  <td>
                    <span className={`badge ${p.estado === "Próximo" ? "upcoming" : "done"}`}>
                      {p.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      {/* MODAL PERFIL EDITABLE */}
      {modalPerfil && (
        <div className="modal" onClick={() => setModalPerfil(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button
              className="cerrar-modal"
              onClick={() => setModalPerfil(false)}
            >
              ❌
            </button>

            {/* Aquí insertamos el componente PerfilUsuario */}
            <PerfilUsuario />

          </div>
        </div>
      )}
    </div>
  );
}
