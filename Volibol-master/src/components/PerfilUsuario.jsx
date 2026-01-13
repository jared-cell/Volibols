import { useEffect, useState } from "react"
import { auth, db } from "../firebase"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import "../styles/PerfilUsuario.css"

export default function PerfilUsuario() {
  const [usuario, setUsuario] = useState(null)
  const [editando, setEditando] = useState(false)
  const [mensaje, setMensaje] = useState("")

  const [form, setForm] = useState({
    nombre: "",
    edad: "",
    peso: "",
    sexo: "",                  // <-- agregado
    posicion: "",
    tieneEnfermedad: false,
    detalleEnfermedad: "",
    metas: ""
  })

  /* =====================
     CARGAR DATOS
  ===================== */
  useEffect(() => {
    const cargarPerfil = async () => {
      if (!auth.currentUser) return

      const ref = doc(db, "usuarios", auth.currentUser.uid)
      const snap = await getDoc(ref)

      if (snap.exists()) {
        const data = snap.data()
        setUsuario(data)
        setForm({
          nombre: data.nombre || "",
          edad: data.edad || "",
          peso: data.peso || "",
          sexo: data.sexo || "",               // <-- agregado
          posicion: data.posicion || "",
          tieneEnfermedad: data.tieneEnfermedad || false,
          detalleEnfermedad: data.detalleEnfermedad || "",
          metas: data.metas || ""
        })
      }
    }

    cargarPerfil()
  }, [])

  /* =====================
     GUARDAR CAMBIOS
  ===================== */
  const guardarCambios = async () => {
    try {
      const ref = doc(db, "usuarios", auth.currentUser.uid)

      await updateDoc(ref, {
        ...form,
        detalleEnfermedad: form.tieneEnfermedad ? form.detalleEnfermedad : ""
      })

      setUsuario(form)
      setEditando(false)
      setMensaje("✅ Perfil actualizado correctamente")
    } catch (error) {
      setMensaje("❌ Error al guardar cambios")
    }
  }

  if (!usuario) return <p>Cargando perfil...</p>

  return (
    <div className="perfil-container">
      <h1>👤 Mi Perfil</h1>
      <p className="perfil-subtitle">
        Administra y actualiza tu información personal
      </p>

      {mensaje && <p className="perfil-message">{mensaje}</p>}

      <div className="perfil-form">
        <div>
          <label>Nombre</label>
          <input
            value={form.nombre}
            disabled={!editando}
            onChange={e => setForm({ ...form, nombre: e.target.value })}
          />
        </div>

        <div>
          <label>Edad</label>
          <input
            type="number"
            value={form.edad}
            disabled={!editando}
            onChange={e => setForm({ ...form, edad: e.target.value })}
          />
        </div>

        <div>
          <label>Peso (kg)</label>
          <input
            type="number"
            value={form.peso}
            disabled={!editando}
            onChange={e => setForm({ ...form, peso: e.target.value })}
          />
        </div>

        {/* SEXO */}
        <div>
          <label>Sexo</label>
          <select
            disabled={!editando}
            value={form.sexo}
            onChange={e => setForm({ ...form, sexo: e.target.value })}
          >
            <option value="">Selecciona</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <div>
          <label>Posición</label>
          <select
            disabled={!editando}
            value={form.posicion}
            onChange={e => setForm({ ...form, posicion: e.target.value })}
          >
            <option value="">Selecciona</option>
            <option value="Armador">Armador</option>
            <option value="Rematador">Rematador</option>
            <option value="Central">Central</option>
            <option value="Líbero">Líbero</option>
          </select>
        </div>

        {/* ENFERMEDAD */}
        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              disabled={!editando}
              checked={form.tieneEnfermedad}
              onChange={e =>
                setForm({ ...form, tieneEnfermedad: e.target.checked })
              }
            />
            ¿Tienes alguna enfermedad o discapacidad?
          </label>
        </div>

        {form.tieneEnfermedad && (
          <div className="dynamic-field">
            <label>¿Cuál?</label>
            <input
              disabled={!editando}
              value={form.detalleEnfermedad}
              onChange={e =>
                setForm({ ...form, detalleEnfermedad: e.target.value })
              }
            />
          </div>
        )}

        <textarea
          placeholder="Metas como jugador"
          disabled={!editando}
          value={form.metas}
          onChange={e => setForm({ ...form, metas: e.target.value })}
        />

        {!editando ? (
          <button className="perfil-button" onClick={() => setEditando(true)}>
            ✏️ Editar perfil
          </button>
        ) : (
          <>
            <button className="perfil-button" onClick={guardarCambios}>
              💾 Guardar cambios
            </button>
            <button
              className="perfil-button cancel"
              onClick={() => {
                setEditando(false)
                setForm(usuario)
              }}
            >
              ❌ Cancelar
            </button>
          </>
        )}
      </div>
    </div>
  )
}
