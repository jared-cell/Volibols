import { useState } from "react"
import { db } from "../firebase"
import { doc, updateDoc } from "firebase/firestore"

export default function ModalEditarEquipo({ equipo, jugadoresLibres, onClose, onSave }) {
  const [nombre, setNombre] = useState(equipo.nombre)
  const [jugadores, setJugadores] = useState(equipo.jugadores)

  const toggle = (jugador) => {
    if (jugadores.find(j => j.id === jugador.id)) {
      setJugadores(jugadores.filter(j => j.id !== jugador.id))
    } else {
      setJugadores([...jugadores, jugador])
    }
  }

  const guardar = async () => {
    await updateDoc(doc(db, "equipos", equipo.id), {
      nombre,
      jugadores,
    })
    onSave()
    onClose()
  }

  return (
    <div className="modal-bg">
      <div className="modal">
        <h3>Editar equipo</h3>

        <input value={nombre} onChange={e => setNombre(e.target.value)} />

        <h4>Jugadores</h4>

        {[...jugadores, ...jugadoresLibres].map(j => (
          <div
            key={j.id}
            className={`jugador ${jugadores.find(x => x.id === j.id) ? "activo" : ""}`}
            onClick={() => toggle(j)}
          >
            {j.nombre}
          </div>
        ))}

        <div className="acciones">
          <button onClick={guardar}>Guardar</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  )
}
