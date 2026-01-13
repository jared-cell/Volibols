import { useState, useEffect } from "react"
import { db } from "../firebase"
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore"
import "../styles/equipoadmin.css"

export default function EquiposAdmin() {
  const [equipos, setEquipos] = useState([])
  const [nombre, setNombre] = useState("")
  const [idEditar, setIdEditar] = useState(null)
  const [filtro, setFiltro] = useState("")

  const equiposCollection = collection(db, "equipos")

  // 1️⃣ Cargar todos los equipos
  const cargarEquipos = async () => {
    let q = equiposCollection
    if (filtro) {
      q = query(equiposCollection, where("nombre", ">=", filtro), where("nombre", "<=", filtro + "\uf8ff"))
    }
    const snapshot = await getDocs(q)
    const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    setEquipos(lista)
  }

  useEffect(() => {
    cargarEquipos()
  }, [filtro])

  // 2️⃣ Crear o actualizar equipo
  const guardarEquipo = async (e) => {
    e.preventDefault()
    if (!nombre.trim()) return alert("El nombre no puede estar vacío")

    try {
      if (idEditar) {
        const ref = doc(db, "equipos", idEditar)
        await updateDoc(ref, { nombre })
        setIdEditar(null)
      } else {
        await addDoc(equiposCollection, { nombre })
      }
      setNombre("")
      cargarEquipos()
    } catch (err) {
      alert("Error al guardar equipo")
    }
  }

  // 3️⃣ Editar equipo
  const editarEquipo = (equipo) => {
    setNombre(equipo.nombre)
    setIdEditar(equipo.id)
  }

  // 4️⃣ Eliminar equipo
  const eliminarEquipo = async (id) => {
    if (confirm("¿Seguro que quieres eliminar este equipo?")) {
      await deleteDoc(doc(db, "equipos", id))
      cargarEquipos()
    }
  }

  return (
    <div className="equipos-admin-container">
      <h1>⚡ Gestión de Equipos</h1>

      <form className="form-equipo" onSubmit={guardarEquipo}>
        <input
          type="text"
          placeholder="Nombre del equipo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <button type="submit">{idEditar ? "Actualizar" : "Agregar"}</button>
      </form>

      <input
        type="text"
        placeholder="Buscar equipo..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="search-input"
      />

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre del Equipo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {equipos.map((e) => (
            <tr key={e.id}>
              <td>{e.id}</td>
              <td>{e.nombre}</td>
              <td>
                <button className="btn-editar" onClick={() => editarEquipo(e)}>✏️</button>
                <button className="btn-eliminar" onClick={() => eliminarEquipo(e.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
