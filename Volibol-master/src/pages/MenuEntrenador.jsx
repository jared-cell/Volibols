import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function MenuEntrenador() {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarUsuario = async () => {
      if (!auth.currentUser) return navigate("/");
      const snap = await getDoc(doc(db, "usuarios", auth.currentUser.uid));
      if (!snap.exists()) return navigate("/");
      if (snap.data().rol !== "entrenador") return navigate("/mi-equipo");
      setUsuario(snap.data());
    };
    cargarUsuario();
  }, []);

  if (!usuario) return <p>Cargando...</p>;

  return (
    <div>
      <h1>Panel Entrenador</h1>
      <p>Bienvenido, {usuario.nombre}</p>
      {/* Aquí luego irán tablas y estadísticas de jugadores */}
    </div>
  );
}
