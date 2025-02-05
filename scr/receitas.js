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
const receitasDiv = document.getElementById("divReceitas");

// Fetch and display recipes from Firestore
async function fetchReceitas() {
  try {
    const querySnapshot = await getDocs(collection(db, "receita"));

    // Loop through each document in the "receita" collection
    querySnapshot.forEach((doc) => {
      const receita = doc.data();
      const receitaDiv = document.createElement("div");

      receitaDiv.innerHTML = `
        <h2>${receita.titulo}</h2>
        ${receita.autor ? `<p><strong>Autor:</strong> ${receita.autor}</p>` : ""}
        ${receita.imageURL ? `<img src="${receita.imageURL}" alt="${receita.titulo}" style="max-width: 200px;">` : ""}
        <p><strong>Ingredientes:</strong> ${receita.ingredientes}</p>
        <a href="receita.html?id=${doc.id}">Ver Receita Completa</a>
      `;

      receitasDiv.appendChild(receitaDiv);
    });
  } catch (error) {
    console.error("Erro ao buscar receitas:", error);
  }
}

// Trigger the fetch function once the page content is loaded
document.addEventListener("DOMContentLoaded", fetchReceitas);
