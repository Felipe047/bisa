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
const receitasDiv = document.getElementById("divReceitas");

// 🚀 Fetch and Display Recipes
async function fetchReceitas() {
  try {
    // 🔑 Get all documents from the "receita" collection
    const querySnapshot = await db.collection("receita").get();

    // Loop through each document
    querySnapshot.forEach((doc) => {
      const receita = doc.data();
      const receitaDiv = document.createElement("div");

      receitaDiv.innerHTML = `
        <h2>${receita.titulo}</h2>
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

// 🖱️ Trigger on Page Load
document.addEventListener("DOMContentLoaded", fetchReceitas);
