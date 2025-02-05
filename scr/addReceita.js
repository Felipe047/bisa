// Import Firebase v9 modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBg2BsiQ5uB8ULAgl9mvU0ilTJzT-oYFc0",
  authDomain: "bisa-8d6fb.firebaseapp.com",
  projectId: "bisa-8d6fb",
  storageBucket: "gs://bisa-8d6fb.firebasestorage.app",
  messagingSenderId: "667766718405",
  appId: "1:667766718405:web:919e201256be887a3b55ac",
  measurementId: "G-JXMBFD0YMC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// DOM Elements
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author"); // New author field
const ingredientesInput = document.getElementById("ingridents");
const howToInput = document.getElementById("howto");
const contextInput = document.getElementById("historia-relacionada"); // ID without spaces
const imageInput = document.getElementById("image");
const postButton = document.getElementById("submit");

// Add Recipe Function
async function addRecipe() {
  const titulo = titleInput.value.trim();
  const autor = authorInput.value.trim();
  const ingredientes = ingredientesInput.value.trim();
  const howto = howToInput.value.trim();
  const context = contextInput.value.trim();
  const imageFile = imageInput.files[0];

  // Check required fields (including author)
  if (!titulo || !autor || !ingredientes || !howto) {
    alert("Por favor, preencha o título, autor, ingredientes e modo de preparo.");
    return;
  }

  try {
    let imageURL = "";

    // Upload image if provided
    if (imageFile) {
      const storageRef = ref(storage, `receitas/${Date.now()}_${imageFile.name}`);
      const snapshot = await uploadBytes(storageRef, imageFile);
      imageURL = await getDownloadURL(snapshot.ref);
    }

    // Add recipe to Firestore
    await addDoc(collection(db, "receita"), {
      titulo,
      autor,           // Save the author
      ingredientes,
      howto,
      context,
      imageURL,
      createdAt: serverTimestamp(),
    });

    alert("Receita adicionada com sucesso!");

    // Clear inputs
    titleInput.value = "";
    authorInput.value = "";
    ingredientesInput.value = "";
    howToInput.value = "";
    contextInput.value = "";
    imageInput.value = "";
  } catch (error) {
    console.error("Erro ao adicionar receita:", error);
    alert("Ocorreu um erro ao adicionar a receita.");
  }
}

// Event Listener
postButton.addEventListener("click", addRecipe);
