// Import Firebase v9 modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

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

// DOM Element for displaying recipes
const receitasDiv = document.getElementById("receitas");

// Fetch and display recipes from Firestore
async function fetchReceitas() {
  try {
    const querySnapshot = await getDocs(collection(db, "receita"));
    receitasDiv.innerHTML = "";

    function hasImage(receita) {
      return receita.imageURL && receita.imageURL.length > 0;
    }

    // Convert Firestore documents to an array
    const receitas = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Sort recipes alphabetically by title (or modify for other sorting logic)
    receitas.sort((a, b) => a.titulo.localeCompare(b.titulo));

    // Display sorted recipes
    receitas.forEach(receita => {
      const receitaDiv = document.createElement("div");
      receitaDiv.classList.add("receita-card");

      receitaDiv.innerHTML = `
        <a class="receita-container" href="receita.html?id=${receita.id}">
          <h2 class="receita-title">${receita.titulo}</h2>
          ${receita.autor ? `<p class="receita-author">${receita.autor}</p>` : ""}
          ${hasImage(receita) ? `<img class="receita-image" src="${receita.imageURL}" alt="${receita.titulo}">` : ""}
          <p class="receita-text">${receita.descricao ? receita.descricao.substring(0, 150) + "..." : ""}</p>
          <p class="receita-link">Ver Receita Completa</p>
        </a>
      `;

      receitasDiv.appendChild(receitaDiv);
    });
  } catch (error) {
    console.error("Erro ao buscar receitas:", error);
  }
}

// Trigger the fetch function once the page content is loaded
document.addEventListener("DOMContentLoaded", fetchReceitas);
