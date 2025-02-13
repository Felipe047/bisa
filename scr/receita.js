// Import Firebase v9 modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get Recipe ID from URL (e.g., receita.html?id=abc123)
function getRecipeIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// go to different page
function goToEdit() {
  window.location.href = "../pages/editReceita.html?id=" + getRecipeIdFromURL();
}

const editButton = document.getElementById("edit-button");

editButton.addEventListener("click", goToEdit);


// Fetch and display the recipe
async function fetchRecipe() {
  const recipeContainer = document.getElementById("receita");
  const recipeId = getRecipeIdFromURL();

  if (!recipeId) {
    recipeContainer.innerHTML = "<p>ID da receita não encontrado na URL.</p>";
    return;
  }

  try {
    const recipeDoc = await getDoc(doc(db, "receita", recipeId));

    if (!recipeDoc.exists()) {
      recipeContainer.innerHTML = "<p>Receita não encontrada.</p>";
      return;
    }

    const recipe = recipeDoc.data();
    recipeContainer.innerHTML = `
      <h2>${recipe.titulo}</h2>
      ${recipe.imageURL ? `<img src="${recipe.imageURL}" alt="${recipe.titulo}" style="max-width: 400px;">` : ""}
      ${recipe.autor ? `<p><strong>Autor:</strong> ${recipe.autor}</p>` : ""}
      <h3>Ingredientes:</h3>
      <p>${recipe.ingredientes.replace(/\n/g, "<br>")}</p>
      <h3>Modo de Preparo:</h3>
      <p>${recipe.howto.replace(/\n/g, "<br>")}</p>
      ${recipe.context ? `<h3>História Relacionada:</h3><p>${recipe.context.replace(/\n/g, "<br>")}</p>` : ""}
    `;
  } catch (error) {
    console.error("Erro ao buscar a receita:", error);
    recipeContainer.innerHTML = "<p>Ocorreu um erro ao carregar a receita.</p>";
  }
}

// Add comment function
async function addComment(event) {
  event.preventDefault();

  const recipeId = getRecipeIdFromURL();
  const name = document.getElementById("name").value.trim();
  const comment = document.getElementById("comment").value.trim();

  if (!name || !comment) {
    alert("Por favor, preencha o nome e o comentário.");
    return;
  }

  try {
    await addDoc(collection(db, "receita", recipeId, "comments"), {
      name,
      comment,
      timestamp: serverTimestamp()
    });

    document.getElementById("name").value = "";
    document.getElementById("comment").value = "";
  } catch (error) {
    console.error("Erro ao enviar comentário:", error);
    alert("Erro ao enviar o comentário.");
  }
}

// Load comments
function loadComments() {
  const recipeId = getRecipeIdFromURL();
  const commentsDiv = document.getElementById("comments");
  commentsDiv.innerHTML = "<p>Carregando comentários...</p>";

  const commentsRef = collection(db, "receita", recipeId, "comments");
  const q = query(commentsRef, orderBy("timestamp", "desc"));

  onSnapshot(q, (snapshot) => {
    commentsDiv.innerHTML = "";

    if (snapshot.empty) {
      commentsDiv.innerHTML = "<p>Sem comentários ainda.</p>";
      return;
    }

    snapshot.forEach((doc) => {
      const comment = doc.data();
      commentsDiv.innerHTML += `
        <div class="comment-card">
          <p><strong>${comment.name}:</strong> ${comment.comment}</p>
          <small>${comment.timestamp?.toDate().toLocaleString() || "Agora"}</small>
        </div>
      `;
    });
  });
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  fetchRecipe();
  loadComments();
});

document.querySelector("#comment-form button").addEventListener("click", addComment);
