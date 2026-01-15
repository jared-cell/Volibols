import { useEffect, useState } from "react"
import { db } from "../firebase"
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore"
import "../styles/equipoadmin.css"

export default function EquiposAdmin() {
  const [equipos, setEquipos] = useState([])
  const [jugadores, setJugadores] = useState([])
  const [equipoActual, setEquipoActual] = useState(null)
  const [busqueda, setBusqueda] = useState("")

  // =========================
  // CARGAR DATOS
  // =========================
  const cargarEquipos = async () => {
    const snap = await getDocs(collection(db, "equipos"))
    setEquipos(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  }

  const cargarJugadores = async () => {
    const snap = await getDocs(collection(db, "usuarios"))
    setJugadores(
      snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(u => u.rol === "jugador")
    )
  }

  useEffect(() => {
    cargarEquipos()
    cargarJugadores()
  }, [])

  // =========================
  // CREAR EQUIPO
  // =========================
  const crearEquipo = async () => {
    const nombre = prompt("Nombre del equipo:")
    if (!nombre) return

    await addDoc(collection(db, "equipos"), {
      nombre,
      jugadores: [],
      activo: true,
    })

    cargarEquipos()
  }

  // =========================
  // TOGGLE ACTIVO
  // =========================
  const toggleActivo = async equipo => {
    await updateDoc(doc(db, "equipos", equipo.id), {
      activo: !equipo.activo,
    })
    cargarEquipos()
  }

  // =========================
  // TOGGLE JUGADOR
  // =========================
  const toggleJugador = async jugadorId => {
    const yaEsta = equipoActual.jugadores.includes(jugadorId)

    const nuevos = yaEsta
      ? equipoActual.jugadores.filter(j => j !== jugadorId)
      : [...equipoActual.jugadores, jugadorId]

    await updateDoc(doc(db, "equipos", equipoActual.id), {
      jugadores: nuevos,
    })

    setEquipoActual({ ...equipoActual, jugadores: nuevos })
    cargarEquipos()
  }

  // =========================
  // FILTRO JUGADORES
  // =========================
  const jugadoresFiltrados = jugadores.filter(j =>
    j.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className="equipo-admin">

      <header>
        <h1>Gestión de Equipos</h1>
        <button className="btn primary" onClick={crearEquipo}>
          ➕ Nuevo Equipo
        </button>
      </header>

      {/* TABLA EQUIPOS */}
      <div className="panel">
        <table>
          <thead>
            <tr>
              <th>Equipo</th>
              <th>Jugadores</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {equipos.map(e => (
              <tr key={e.id}>
                <td>{e.nombre}</td>
                <td>{e.jugadores.length}</td>
                <td>
                  <span className={`estado ${e.activo ? "activo" : "inactivo"}`}>
                    {e.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="acciones">
                  <button className="btn edit" onClick={() => setEquipoActual(e)}>
                    Editar
                  </button>
                  <button className="btn danger" onClick={() => toggleActivo(e)}>
                    {e.activo ? "Dar de baja" : "Activar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {equipoActual && (
        <div className="modal-overlay">
          <div className="modal">

            <div className="modal-header">
              <h2>{equipoActual.nombre}</h2>
              <button onClick={() => setEquipoActual(null)}>✖</button>
            </div>

            <input
              type="text"
              placeholder="Buscar jugador..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            />

            <table className="tabla-jugadores">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {jugadoresFiltrados.map(j => {
                  const ocupado = equipos.some(
                    eq => eq.id !== equipoActual.id && eq.jugadores.includes(j.id)
                  )

                  return (
                    <tr key={j.id} className={ocupado ? "bloqueado" : ""}>
                      <td>{j.nombre}</td>
                      <td>
                        {!ocupado && (
                          <button
                            className="btn small"
                            onClick={() => toggleJugador(j.id)}
                          >
                            {equipoActual.jugadores.includes(j.id)
                              ? "Quitar"
                              : "Agregar"}
                          </button>
                        )}
                        {ocupado && <span className="ocupado">En otro equipo</span>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

          </div>
        </div>
      )}
    </div>
  )
}
