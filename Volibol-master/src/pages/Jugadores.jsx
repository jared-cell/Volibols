import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import "../styles/menuadmin.css";

export default function Jugadores() {
  const [jugadores, setJugadores] = useState([]);
  const [filtro, setFiltro] = useState("");

  // =========================
  // CARGAR JUGADORES
  // =========================
  const cargarJugadores = async () => {
    try {
      const jugadoresCol = collection(db, "usuarios");
      const jugadoresSnap = await getDocs(jugadoresCol);
      const jugadoresList = jugadoresSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setJugadores(jugadoresList);
    } catch (err) {
      console.error("Error al cargar jugadores:", err);
    }
  };

  useEffect(() => {
    cargarJugadores();
  }, []);

  // =========================
  // ACTUALIZAR RENDIMIENTO
  // =========================
  const actualizarRendimiento = async (id, rendimiento) => {
    try {
      const jugadorRef = doc(db, "usuarios", id);
      await updateDoc(jugadorRef, { rendimiento });
      cargarJugadores();
    } catch (err) {
      console.error("Error al actualizar rendimiento:", err);
      alert("No se pudo actualizar el rendimiento");
    }
  };

  // =========================
  // DAR DE BAJA
  // =========================
  const darDeBaja = async (id) => {
    if (window.confirm("¿Dar de baja a este jugador?")) {
      try {
        const jugadorRef = doc(db, "usuarios", id);
        await updateDoc(jugadorRef, { activo: false });
        cargarJugadores();
      } catch (err) {
        console.error("Error al dar de baja:", err);
        alert("No se pudo dar de baja al jugador");
      }
    }
  };

  // =========================
  // FILTRAR JUGADORES
  // =========================
  const jugadoresFiltrados = jugadores.filter(j =>
    j.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div>
      <h2>🧑‍🤝‍🧑 Gestión de Jugadores</h2>

      {/* BUSCADOR */}
      <input
        type="text"
        placeholder="Buscar jugador por nombre..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="input-buscar"
      />

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Edad</th>
            <th>Peso</th>
            <th>Posición</th>
            <th>Rendimiento</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {jugadoresFiltrados.map(j => (
            <tr key={j.id} className={j.activo === false ? "inactivo" : ""}>
              <td>{j.nombre}</td>
              <td>{j.edad}</td>
              <td>{j.peso}</td>
              <td>{j.posicion}</td>
              <td>{j.rendimiento || "Sin evaluar"}</td>
              <td>{j.activo === false ? "No" : "Sí"}</td>
              <td>
                <button onClick={() => actualizarRendimiento(j.id, "Bueno")}>Bueno</button>
                <button onClick={() => actualizarRendimiento(j.id, "Regular")}>Regular</button>
                <button onClick={() => actualizarRendimiento(j.id, "Malo")}>Malo</button>
                <button onClick={() => darDeBaja(j.id)}>Dar de baja</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
