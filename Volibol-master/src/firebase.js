// Importar Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuración Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCxqSiLV7TlD03DqEvIyaPIc8PKm-Z26X8",
  authDomain: "volibol-2b433.firebaseapp.com",
  projectId: "volibol-2b433",
  storageBucket: "volibol-2b433.appspot.com",
  messagingSenderId: "507286337250",
  appId: "1:507286337250:web:94ac51b822eac53df390bb"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// EXPORTS IMPORTANTES
export const auth = getAuth(app);
export const db = getFirestore(app);
