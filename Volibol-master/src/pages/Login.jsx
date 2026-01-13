import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'

export default function Login() {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()

    const email = e.target.email.value
    const password = e.target.password.value

    try {
      let userData = null

      // ===== ADMIN / ENTRENADOR FAKE =====
      if (email === 'admin@gmail.com' && password === 'admin1') {
        userData = {
          nombre: 'Administrador',
          rol: 'admin',
        }
      } else {
        // ===== USUARIO NORMAL =====
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const uid = userCredential.user.uid

        const docRef = doc(db, 'usuarios', uid)
        const docSnap = await getDoc(docRef)

        if (!docSnap.exists()) {
          setError('No se encontró la información del usuario')
          return
        }

        userData = docSnap.data()
      }

      // ===== GUARDAR DATOS EN LOCAL STORAGE =====
      localStorage.setItem('userData', JSON.stringify(userData))

      // ===== REDIRIGIR SEGÚN ROL =====
      if (userData.rol === 'admin') {
        navigate('/menu-admin')
      } else {
        navigate('/menu')
      }
    } catch (err) {
      setError('Correo o contraseña incorrectos')
    }
  }

  return (
    <main className="login-container">
      <section className="login-card">
        <h1 className="title">Iniciar Sesión</h1>

        <form className="login-form" onSubmit={handleLogin}>
          <label>Email</label>
          <input type="email" name="email" required />

          <label>Contraseña</label>
          <input type="password" name="password" required />

          <button className="btn-primary">Entrar</button>

          {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </form>

        <div className="login-links">
          <span>¿No tienes cuenta?</span>
          <Link to="/register">Crear cuenta</Link>
        </div>
      </section>
    </main>
  )
}
