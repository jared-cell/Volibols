import '../styles/register.css'
import { Link, useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../firebase'
import { doc, setDoc } from 'firebase/firestore'
import { useState } from 'react'

export default function Register() {
  const navigate = useNavigate()

  const [esMenor, setEsMenor] = useState(false)
  const [tieneExperiencia, setTieneExperiencia] = useState(null)
  const [tieneCondicion, setTieneCondicion] = useState(null)

  const handleRegister = async (e) => {
    e.preventDefault()
    const form = e.target

    const nombre = form.nombre.value
    const edad = parseInt(form.edad.value)
    const peso = form.peso.value
    const sexo = form.sexo.value                // <-- agregado
    const telefono = form.telefono.value
    const email = form.email.value
    const password = form.password.value

    const posicion =
      tieneExperiencia === true ? form.posicion.value : 'Soy nuevo'
    const aniosExperiencia =
      tieneExperiencia === true ? parseInt(form.aniosExperiencia.value) : 0

    const condicionDetalle =
      tieneCondicion === true ? form.enfermedad.value : ''

    const tutorNombre = esMenor ? form.tutorNombre.value : ''
    const tutorTelefono = esMenor ? form.tutorTelefono.value : ''

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      const uid = userCredential.user.uid

      await setDoc(doc(db, 'usuarios', uid), {
        nombre,
        edad,
        peso,
        sexo,                           // <-- agregado
        telefono,
        email,

        experiencia: tieneExperiencia,
        posicion,
        aniosExperiencia,

        tieneCondicion,
        condicionDetalle,

        esMenor,
        tutorNombre,
        tutorTelefono,

        rol: 'jugador',
        fechaRegistro: new Date()
      })

      navigate('/')
    } catch (error) {
      alert(error.message)
    }
  }

  const handleEdadChange = (e) => {
    setEsMenor(parseInt(e.target.value) < 18)
  }

  return (
    <main className="login-container">
      <section className="login-card">
        <h1 className="title">🏐 Crear cuenta</h1>

        <form className="login-form" onSubmit={handleRegister}>
          {/* DATOS BÁSICOS */}
          <label>Nombre completo</label>
          <input type="text" name="nombre" required />

          <label>Edad</label>
          <input type="number" name="edad" required onChange={handleEdadChange} />

          <label>Peso (kg)</label>
          <input type="number" name="peso" required />

          <label>Sexo</label>
          <select name="sexo" required>       {/* <-- agregado */}
            <option value="">Selecciona sexo</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Otro">Otro</option>
          </select>

          <label>Teléfono</label>
          <input type="text" name="telefono" required />

          {/* EXPERIENCIA */}
          <label>¿Has jugado voleibol antes?</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="experiencia"
                checked={tieneExperiencia === false}
                onChange={() => setTieneExperiencia(false)}
              />
              🆕 No, soy nuevo
            </label>

            <label>
              <input
                type="radio"
                name="experiencia"
                checked={tieneExperiencia === true}
                onChange={() => setTieneExperiencia(true)}
              />
              🏐 Sí, tengo experiencia
            </label>
          </div>

          {tieneExperiencia === true && (
            <>
              <label>Posición de juego</label>
              <select name="posicion" required>
                <option value="">Selecciona una</option>
                <option value="Colocador">Colocador</option>
                <option value="Rematador">Rematador</option>
                <option value="Central">Central</option>
                <option value="Líbero">Líbero</option>
                <option value="Opuesto">Opuesto</option>
              </select>

              <label>Años de experiencia</label>
              <input type="number" name="aniosExperiencia" min="1" required />
            </>
          )}

          {/* CONDICIÓN MÉDICA */}
          <label>¿Tienes alguna enfermedad o discapacidad?</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="condicion"
                checked={tieneCondicion === false}
                onChange={() => setTieneCondicion(false)}
              />
              ❌ No
            </label>

            <label>
              <input
                type="radio"
                name="condicion"
                checked={tieneCondicion === true}
                onChange={() => setTieneCondicion(true)}
              />
              ⚠️ Sí
            </label>
          </div>

          {tieneCondicion === true && (
            <>
              <label>Describe la condición</label>
              <input
                type="text"
                name="enfermedad"
                placeholder="Ej. asma, lesión en rodilla..."
                required
              />
            </>
          )}

          {/* TUTOR */}
          {esMenor && (
            <>
              <label>Nombre del tutor</label>
              <input type="text" name="tutorNombre" required />

              <label>Teléfono del tutor</label>
              <input type="text" name="tutorTelefono" required />
            </>
          )}

          {/* AUTH */}
          <label>Email</label>
          <input type="email" name="email" required />

          <label>Contraseña</label>
          <input type="password" name="password" required />

          <button className="btn-primary">Crear cuenta</button>
        </form>

        <div className="login-links">
          <span>¿Ya tienes cuenta?</span>
          <Link to="/">Inicia sesión</Link>
        </div>
      </section>
    </main>
  )
}
