import { doc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'

// uid → id del usuario de Auth
// datos → objeto con nombre, edad, peso, enfermedad, email, rol
export const crearUsuarioFirestore = async (uid, datos) => {
  await setDoc(doc(db, 'usuarios', uid), {
    ...datos,                 // Guarda todos los datos que pasamos
    fechaRegistro: new Date() // Fecha de registro automática
  })
}
