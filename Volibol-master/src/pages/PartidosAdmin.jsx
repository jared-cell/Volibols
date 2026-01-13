import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc
} from "firebase/firestore";
import "../styles/partidosadmin.css";

export default function PartidosAdmin() {
  const [partidos, setPartidos] = useState([]);
  const [filtro, setFiltro] = useState("todos"); // todos, proximo, encurso, finalizado
  const [formVisible, setFormVisible] = useState(false);
  const [nuevoPartido, setNuevoPartido] = useState({
    local: "",
    visitante: "",
    fecha: "",
    lugar: "",
    estado: "Próximo"
  });

  // =========================
  // CARGAR PARTIDOS
  // =========================
  const cargarPartidos = async () => {
    try {
      const partidosCol = collection(db, "partidos");
      const partidosSnap = await getDocs(partidosCol);
      const lista = partidosSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPartidos(lista);
    } catch (err) {
      console.error("Error al cargar partidos:", err);
    }
  };

  useEffect(() => {
    cargarPartidos();
  }, []);

  // =========================
  // AGREGAR PARTIDO
  // =========================
  const agregarPartido = async (e) => {
    e.preventDefault();
    if (!nuevoPartido.local || !nuevoPartido.visitante || !nuevoPartido.fecha || !nuevoPartido.lugar) {
      return alert("Completa todos los campos del partido");
    }
    try {
      await addDoc(collection(db, "partidos"), nuevoPartido);
      setNuevoPartido({ local: "", visitante: "", fecha: "", lugar: "", estado: "Próximo" });
      setFormVisible(false);
      cargarPartidos();
    } catch (err) {
      console.error(err);
      alert("Error al agregar partido");
    }
  };

  // =========================
  // ELIMINAR PARTIDO
  // =========================
  const eliminarPartido = async (id) => {
    if (!window.confirm("¿Eliminar este partido?")) return;
    try {
      await deleteDoc(doc(db, "partidos", id));
      cargarPartidos();
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar el partido");
    }
  };

  // =========================
  // EDITAR PARTIDO
  // =========================
  const editarPartido = async (p) => {
    const nuevoLocal = prompt("Equipo local:", p.local) || p.local;
    const nuevoVisitante = prompt("Equipo visitante:", p.visitante) || p.visitante;
    const nuevaFecha = prompt("Fecha:", p.fecha) || p.fecha;
    const nuevoLugar = prompt("Lugar:", p.lugar) || p.lugar;
    const nuevoEstado = prompt("Estado (Próximo/En curso/Finalizado):", p.estado) || p.estado;

    try {
      const partidoRef = doc(db, "partidos", p.id);
      await updateDoc(partidoRef, {
        local: nuevoLocal,
        visitante: nuevoVisitante,
        fecha: nuevaFecha,
        lugar: nuevoLugar,
        estado: nuevoEstado
      });
      cargarPartidos();
    } catch (err) {
      console.error(err);
      alert("Error al actualizar partido");
    }
  };

  // =========================
  // FILTRAR PARTIDOS
  // =========================
  const partidosFiltrados = partidos.filter(p => {
    if (filtro === "todos") return true;
    return p.estado.toLowerCase() === filtro;
  });

  return (
    <div className="partidos-admin-page">
      <aside className="sidebar">
        <h2>🏐 Panel Admin - Partidos</h2>
        <p>Gestiona todos los partidos del equipo</p>
      </aside>

      <main className="content">
        <h1>📋 Partidos</h1>

        {/* FILTROS */}
        <div className="filtros">
          {["todos", "proximo", "encurso", "finalizado"].map(f => (
            <button
              key={f}
              className={filtro === f ? "active" : ""}
              onClick={() => setFiltro(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
          <button className="btn-primary" onClick={() => setFormVisible(!formVisible)}>
            {formVisible ? "Cancelar" : "➕ Agregar Partido"}
          </button>
        </div>

        {/* FORMULARIO AGREGAR PARTIDO */}
        {formVisible && (
          <form className="form-partido" onSubmit={agregarPartido}>
            <input
              type="text"
              placeholder="Equipo Local"
              value={nuevoPartido.local}
              onChange={e => setNuevoPartido({...nuevoPartido, local: e.target.value})}
            />
            <input
              type="text"
              placeholder="Equipo Visitante"
              value={nuevoPartido.visitante}
              onChange={e => setNuevoPartido({...nuevoPartido, visitante: e.target.value})}
            />
            <input
              type="date"
              value={nuevoPartido.fecha}
              onChange={e => setNuevoPartido({...nuevoPartido, fecha: e.target.value})}
            />
            <input
              type="text"
              placeholder="Lugar"
              value={nuevoPartido.lugar}
              onChange={e => setNuevoPartido({...nuevoPartido, lugar: e.target.value})}
            />
            <select
              value={nuevoPartido.estado}
              onChange={e => setNuevoPartido({...nuevoPartido, estado: e.target.value})}
            >
              <option value="Próximo">Próximo</option>
              <option value="En curso">En curso</option>
              <option value="Finalizado">Finalizado</option>
            </select>
            <button type="submit" className="btn-primary">Guardar Partido</button>
          </form>
        )}

        {/* TABLA PARTIDOS */}
        <table className="tabla-partidos">
          <thead>
            <tr>
              <th>ID</th>
              <th>Encuentro</th>
              <th>Fecha</th>
              <th>Lugar</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {partidosFiltrados.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.local} vs {p.visitante}</td>
                <td>{p.fecha}</td>
                <td>{p.lugar}</td>
                <td>
                  <span className={`badge ${p.estado.toLowerCase().replace(" ", "")}`}>{p.estado}</span>
                </td>
                <td>
                  <button onClick={() => editarPartido(p)}>Editar</button>
                  <button onClick={() => eliminarPartido(p.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
