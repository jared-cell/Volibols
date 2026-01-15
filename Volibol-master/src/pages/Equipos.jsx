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

const MAX_JUGADORES = 6

export default function EquiposAdmin() {
  const [equipos, setEquipos] = useState([])
  const [jugadores, setJugadores] = useState([])
  const [equipoActual, setEquipoActual] = useState(null)
  const [busqueda, setBusqueda] = useState("")

  /* =========================
     CARGAR DATOS
  ========================= */
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

  /* =========================
     CREAR EQUIPO
  ========================= */
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

  /* =========================
     ACTIVO / INACTIVO
  ========================= */
  const toggleActivo = async equipo => {
    await updateDoc(doc(db, "equipos", equipo.id), {
      activo: !equipo.activo,
    })
    cargarEquipos()
  }

  /* =========================
     AGREGAR / QUITAR JUGADOR
  ========================= */
  const toggleJugador = async jugadorId => {
    if (!equipoActual) return

    const yaEsta = equipoActual.jugadores.includes(jugadorId)

    // máximo 6
    if (!yaEsta && equipoActual.jugadores.length >= MAX_JUGADORES) return

    const nuevos = yaEsta
      ? equipoActual.jugadores.filter(j => j !== jugadorId)
      : [...equipoActual.jugadores, jugadorId]

    await updateDoc(doc(db, "equipos", equipoActual.id), {
      jugadores: nuevos,
    })

    setEquipoActual({ ...equipoActual, jugadores: nuevos })
    cargarEquipos()
  }

  /* =========================
     FILTRO ÚNICO
  ========================= */
  const jugadoresFiltrados = jugadores.filter(j => {
    const texto = busqueda.toLowerCase()
    return (
      j.nombre?.toLowerCase().includes(texto) ||
      String(j.edad).includes(texto) ||
      j.genero?.toLowerCase().includes(texto)
    )
  })

  return (
    <div className="equipo-admin">

      <header>
        <h1>Gestión de Equipos</h1>
        <button className="btn primary" onClick={crearEquipo}>
          ➕ Nuevo Equipo
        </button>
      </header>

      {/* ================= TABLA EQUIPOS ================= */}
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
                <td>{e.jugadores.length} / {MAX_JUGADORES}</td>
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

      {/* ================= BUSCADOR Y TABLA JUGADORES FUERA DEL MODAL ================= */}
      <div className="panel jugadores-panel">
        <h2>Jugadores</h2>
        <input
          type="text"
          className="buscador"
          placeholder="Buscar por nombre, edad o género"
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />

        <table className="tabla-jugadores compacta">
          <thead>
            <tr>
              <th>Jugador</th>
              <th>Equipo</th>
            </tr>
          </thead>
          <tbody>
            {jugadoresFiltrados.map(j => {
              const equipo = equipos.find(eq => eq.jugadores.includes(j.id))
              return (
                <tr key={j.id}>
                  <td>
                    {j.nombre} <small>{j.edad} · {j.genero}</small>
                  </td>
                  <td>{equipo ? equipo.nombre : "Sin equipo"}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL ================= */}
      {equipoActual && (
        <div className="modal-overlay">
          <div className="modal modal-sm">
            <div className="modal-header">
              <h2>{equipoActual.nombre}</h2>
              <span>{equipoActual.jugadores.length} / {MAX_JUGADORES}</span>
              <button onClick={() => setEquipoActual(null)}>✖</button>
            </div>

            {/* TABLA DE JUGADORES PARA EDITAR EQUIPO */}
            <table className="tabla-jugadores compacta">
              <thead>
                <tr>
                  <th>Jugador</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {jugadores.map(j => {
                  const enOtroEquipo = equipos.some(
                    eq => eq.id !== equipoActual.id && eq.jugadores.includes(j.id)
                  )
                  const enEste = equipoActual.jugadores.includes(j.id)
                  const lleno = !enEste && equipoActual.jugadores.length >= MAX_JUGADORES

                  return (
                    <tr key={j.id}>
                      <td>
                        {j.nombre} <small>{j.edad} · {j.genero}</small>
                      </td>
                      <td>
                        {enOtroEquipo ? (
                          <span className="ocupado">Otro equipo</span>
                        ) : lleno ? (
                          <span className="ocupado">Completo</span>
                        ) : (
                          <button className="btn small" onClick={() => toggleJugador(j.id)}>
                            {enEste ? "Quitar" : "Agregar"}
                          </button>
                        )}
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
