// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBg2BsiQ5uB8ULAgl9mvU0ilTJzT-oYFc0",
  authDomain: "bisa-8d6fb.firebaseapp.com",
  projectId: "bisa-8d6fb",
  storageBucket: "bisa-8d6fb.appspot.com",
  messagingSenderId: "667766718405",
  appId: "1:667766718405:web:919e201256be887a3b55ac",
  measurementId: "G-JXMBFD0YMC"
};

// ✅ Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 🔗 DOM Element
const body = document.body; // Appending content directly to the body

// 🔍 Get Recipe ID from URL
function getRecipeIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id"); // e.g., ?id=abc123
}

// 🚀 Fetch and Display Recipe by ID
async function fetchRecipe() {
  const recipeId = getRecipeIdFromURL();

  if (!recipeId) {
    body.innerHTML += "<p>ID da receita não encontrado na URL.</p>";
    return;
  }

  try {
    const doc = await db.collection("receita").doc(recipeId).get();

    if (!doc.exists) {
      body.innerHTML += "<p>Receita não encontrada.</p>";
      return;
    }

    const recipe = doc.data();

    body.innerHTML += `
      <h2>${recipe.titulo}</h2>
      <h3>Ingredientes:</h3>
      <p>${recipe.ingredientes}</p>
      <h3>Modo de Preparo:</h3>
      <p>${recipe.howto}</p>
      ${recipe.context ? `<h3>História Relacionada:</h3><p>${recipe.context}</p>` : ""}
    `;
  } catch (error) {
    console.error("Erro ao buscar a receita:", error);
    body.innerHTML += "<p>Ocorreu um erro ao carregar a receita.</p>";
  }
}

// 🖱️ Trigger on Page Load
document.addEventListener("DOMContentLoaded", fetchRecipe);
