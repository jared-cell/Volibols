import { useState } from "react"

export default function Calendario({ onFiltrar }) {
  const [fecha, setFecha] = useState("")

  const handleChange = (e) => {
    setFecha(e.target.value)
    onFiltrar(e.target.value) // Enviamos la fecha seleccionada al componente padre
  }

  const limpiarFiltro = () => {
    setFecha("")
    onFiltrar("")
  }

  return (
    <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
      <input type="date" value={fecha} onChange={handleChange} />
      <button onClick={limpiarFiltro}>Mostrar todos</button>
    </div>
  )
}
