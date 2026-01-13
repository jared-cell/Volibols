import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import "../styles/equipo.css";

export default function Equipos() {
  const [equipos, setEquipos] = useState([]);
  const [jugadores, setJugadores] = useState([]);
  const [nombreEquipo, setNombreEquipo] = useState("");
  const [jugadoresSeleccionados, setJugadoresSeleccionados] = useState([]);

  // =========================
  // CARGAR JUGADORES
  // =========================
  const cargarJugadores = async () => {
    try {
      const jugadoresCol = collection(db, "usuarios");
      const jugadoresSnap = await getDocs(jugadoresCol);
      const jugadoresList = jugadoresSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Filtrar jugadores activos y que no estén ya en un equipo
      const jugadoresEnEquipos = equipos.flatMap(e => e.jugadores || []);
      const disponibles = jugadoresList.filter(j => j.activo !== false && !jugadoresEnEquipos.includes(j.uid));
      
      setJugadores(disponibles);
    } catch (err) {
      console.error("Error al cargar jugadores:", err);
    }
  };

  // =========================
  // CARGAR EQUIPOS
  // =========================
  const cargarEquipos = async () => {
    try {
      const equiposCol = collection(db, "equipos");
      const equiposSnap = await getDocs(equiposCol);
      const equiposList = equiposSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEquipos(equiposList);
    } catch (err) {
      console.error("Error al cargar equipos:", err);
    }
  };

  useEffect(() => {
    cargarEquipos();
  }, []);

  useEffect(() => {
    cargarJugadores();
  }, [equipos]);

  // =========================
  // SELECCIONAR / DESELECCIONAR JUGADORES
  // =========================
  const toggleJugador = (uid) => {
    setJugadoresSeleccionados(prev =>
      prev.includes(uid) ? prev.filter(j => j !== uid) : [...prev, uid]
    );
  };

  // =========================
  // AGREGAR EQUIPO
  // =========================
  const agregarEquipo = async (e) => {
    e.preventDefault();
    if (!nombreEquipo) return alert("Ingresa el nombre del equipo");
    if (jugadoresSeleccionados.length === 0) return alert("Selecciona al menos un jugador");

    try {
      await addDoc(collection(db, "equipos"), {
        nombre: nombreEquipo,
        jugadores: jugadoresSeleccionados, // guardamos UID
      });
      setNombreEquipo("");
      setJugadoresSeleccionados([]);
      cargarEquipos();
    } catch (err) {
      console.error("Error al agregar equipo:", err);
      alert("No se pudo agregar el equipo");
    }
  };

  // =========================
  // ELIMINAR EQUIPO
  // =========================
  const eliminarEquipo = async (id) => {
    if (!window.confirm("¿Eliminar este equipo?")) return;
    try {
      await deleteDoc(doc(db, "equipos", id));
      cargarEquipos();
    } catch (err) {
      console.error("Error al eliminar equipo:", err);
      alert("No se pudo eliminar el equipo");
    }
  };

  // =========================
  // EDITAR NOMBRE DEL EQUIPO
  // =========================
  const editarEquipo = async (id) => {
    const nuevoNombre = prompt("Ingresa el nuevo nombre del equipo:");
    if (!nuevoNombre) return;
    try {
      const equipoRef = doc(db, "equipos", id);
      await updateDoc(equipoRef, { nombre: nuevoNombre });
      cargarEquipos();
    } catch (err) {
      console.error("Error al editar equipo:", err);
      alert("No se pudo actualizar el nombre del equipo");
    }
  };

  return (
    <div>
      <h2>🏟️ Gestión de Equipos</h2>

      {/* FORMULARIO AGREGAR EQUIPO */}
      <form onSubmit={agregarEquipo} className="form-equipo">
        <input
          type="text"
          placeholder="Nombre del equipo"
          value={nombreEquipo}
          onChange={(e) => setNombreEquipo(e.target.value)}
        />

        <div className="jugadores-checkbox">
          {jugadores.map(j => (
            <label key={j.uid}>
              <input
                type="checkbox"
                checked={jugadoresSeleccionados.includes(j.uid)}
                onChange={() => toggleJugador(j.uid)}
              />
              {j.nombre}
            </label>
          ))}
        </div>

        <button type="submit" className="btn-primary">
          ➕ Agregar Equipo
        </button>
      </form>

      {/* LISTADO DE EQUIPOS */}
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
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
                <button className="btn-editar" onClick={() => editarEquipo(e.id)}>Editar</button>
                <button className="btn-eliminar" onClick={() => eliminarEquipo(e.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
