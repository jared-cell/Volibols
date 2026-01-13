import { useState } from "react"
import "../styles/partidosadmin.css"

export default function PartidosAdmin() {
  // Lista de equipos registrados
  const [equipos, setEquipos] = useState([
    { id: 1, nombre: "Thunder" },
    { id: 2, nombre: "Lightning" },
    { id: 3, nombre: "Storm" },
    { id: 4, nombre: "Nets" },
  ])

  // Partidos generados
  const [partidos, setPartidos] = useState([])

  // Genera partidos aleatorios
  const organizarPartidos = () => {
    const shuffled = [...equipos].sort(() => Math.random() - 0.5)
    const nuevosPartidos = []

    for (let i = 0; i < shuffled.length; i += 2) {
      if (shuffled[i + 1]) {
        nuevosPartidos.push({
          id: `P-${Math.floor(Math.random() * 1000)}`,
          equipo1: shuffled[i].nombre,
          equipo2: shuffled[i + 1].nombre,
          fecha: new Date().toLocaleDateString(),
          estado: "Pendiente",
        })
      }
    }

    setPartidos(nuevosPartidos)
  }

  return (
    <div className="partidos-admin-container">
      <header>
        <h1>📅 Gestión de Partidos</h1>
        <button className="btn-organizar" onClick={organizarPartidos}>
          ⚡ Organizar Partidos
        </button>
      </header>

      <section className="equipos-section">
        <h2>Equipos Registrados</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre del Equipo</th>
            </tr>
          </thead>
          <tbody>
            {equipos.map((e) => (
              <tr key={e.id}>
                <td>{e.id}</td>
                <td>{e.nombre}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="partidos-section">
        <h2>Partidos Generados</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Equipo 1</th>
              <th>Equipo 2</th>
              <th>Fecha</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {partidos.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.equipo1}</td>
                <td>{p.equipo2}</td>
                <td>{p.fecha}</td>
                <td>
                  <span className={`badge ${p.estado === "Pendiente" ? "pending" : "done"}`}>
                    {p.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
