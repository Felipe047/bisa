// Import Firebase v9 modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBg2BsiQ5uB8ULAgl9mvU0ilTJzT-oYFc0",
  authDomain: "bisa-8d6fb.firebaseapp.com",
  projectId: "bisa-8d6fb",
  storageBucket: "bisa-8d6fb.appspot.com", // Corrected storage bucket ID
  messagingSenderId: "667766718405",
  appId: "1:667766718405:web:919e201256be887a3b55ac",
  measurementId: "G-JXMBFD0YMC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Use a dedicated container for the recipe details
const recipeContainer = document.getElementById("receita");

// Get Recipe ID from URL (e.g., receita.html?id=abc123)
function getRecipeIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// Fetch and display the recipe
async function fetchRecipe() {
  const recipeId = getRecipeIdFromURL();

  if (!recipeId) {
    recipeContainer.innerHTML = "<p>ID da receita não encontrado na URL.</p>";
    return;
  }

  try {
    // Fetch the recipe document
    const recipeDoc = await getDoc(doc(db, "receita", recipeId));

    if (!recipeDoc.exists()) {
      recipeContainer.innerHTML = "<p>Receita não encontrada.</p>";
      return;
    }

    const recipe = recipeDoc.data();

    // Display the recipe details
    recipeContainer.innerHTML = `
      <h2>${recipe.titulo}</h2>
      ${recipe.imageURL ? `<img src="${recipe.imageURL}" alt="${recipe.titulo}" style="max-width: 400px;">` : ""}
      ${recipe.autor ? `<p><strong>Autor:</strong> ${recipe.autor}</p>` : ""}
      <h3>Ingredientes:</h3>
      <p>${recipe.ingredientes}</p>
      <h3>Modo de Preparo:</h3>
      <p>${recipe.howto}</p>
      ${recipe.context ? `<h3>História Relacionada:</h3><p>${recipe.context}</p>` : ""}
    `;
  } catch (error) {
    console.error("Erro ao buscar a receita:", error);
    recipeContainer.innerHTML = "<p>Ocorreu um erro ao carregar a receita.</p>";
  }
}

// Fetch the recipe when the page loads
document.addEventListener("DOMContentLoaded", fetchRecipe);