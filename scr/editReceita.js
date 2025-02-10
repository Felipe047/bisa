// Import Firebase v9 modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getFirestore, doc, getDoc, updateDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import {
  getStorage, ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

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
const authorInput = document.getElementById("author");
const ingredientesInput = document.getElementById("ingridents");
const howToInput = document.getElementById("howto");
const contextInput = document.getElementById("historia-relacionada");
const imageInput = document.getElementById("image");
const postButton = document.getElementById("submit");
const recipeImagePreview = document.getElementById("recipe-image-preview");

// Get recipe ID from URL
const urlParams = new URLSearchParams(window.location.search);
const recipeId = urlParams.get("id");

if (!recipeId) {
  alert("Erro: Nenhuma receita especificada para edição.");
  window.location.href = "receitas.html"; // Redirect if no ID
}

// Load existing recipe data
async function loadRecipe() {
  try {
    const docRef = doc(db, "receita", recipeId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const receita = docSnap.data();

      // Populate form with existing data
      titleInput.value = receita.titulo || "";
      authorInput.value = receita.autor || "";
      ingredientesInput.value = receita.ingredientes || "";
      howToInput.value = receita.howto || "";
      contextInput.value = receita.context || "";

      // Show existing image if available
      if (receita.imageURL) {
        recipeImagePreview.src = receita.imageURL;
        recipeImagePreview.style.display = "block";
      }
    } else {
      alert("Receita não encontrada.");
      window.location.href = "receitas.html"; // Redirect if not found
    }
  } catch (error) {
    console.error("Erro ao carregar receita:", error);
    alert("Erro ao carregar os dados da receita.");
  }
}

// Update Recipe Function
async function updateRecipe() {
  const titulo = titleInput.value.trim();
  const autor = authorInput.value.trim();
  const ingredientes = ingredientesInput.value.trim();
  const howto = howToInput.value.trim();
  const context = contextInput.value.trim();
  const imageFile = imageInput.files[0];

  if (!titulo || !autor || !ingredientes || !howto) {
    alert("Por favor, preencha o título, autor, ingredientes e modo de preparo.");
    return;
  }

  // Show loading spinner
  postButton.innerText = "Atualizando...";
  postButton.disabled = true; // Disable the button to prevent multiple clicks

  try {
    let imageURL = recipeImagePreview.src || ""; // Keep existing image if no new one is uploaded

    // Upload new image if provided
    if (imageFile && imageFile.size > 0) {
      const storageRef = ref(storage, `receitas/${Date.now()}_${imageFile.name}`);
      const snapshot = await uploadBytes(storageRef, imageFile);
      imageURL = await getDownloadURL(snapshot.ref);
    }

    // Update recipe in Firestore
    const docRef = doc(db, "receita", recipeId);
    await updateDoc(docRef, {
      titulo,
      autor,
      ingredientes,
      howto,
      context,
      imageURL,
      updatedAt: serverTimestamp(),
    });

    alert("Receita atualizada com sucesso!");
    window.location.href = "receitas.html"; // Redirect back
  } catch (error) {
    console.error("Erro ao atualizar receita:", error);
    alert("Ocorreu um erro ao atualizar a receita.");
  }
}

// Load the recipe when page is loaded
document.addEventListener("DOMContentLoaded", loadRecipe);

// Event Listener
postButton.addEventListener("click", updateRecipe);
