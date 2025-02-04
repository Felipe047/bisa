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
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const memoriesDiv = document.getElementById("memorias");

async function fetchMemories() {
  try {
    // 🔑 Get all documents from the "memoria" collection
    const querySnapshot = await db.collection("memoria").get();

    // Loop through each document
    querySnapshot.forEach((doc) => {
      const memory = doc.data();
      const memoryDiv = document.createElement("div");

      memoryDiv.innerHTML = `
        <h2>${memory.titulo}</h2>
        <img src="${memory.imageURL}" alt="${memory.titulo}" style="max-width: 200px;">
        <p>${memory.texto}...</p>
        <a href="memoria.html?id=${doc.id}">Read More</a>
      `;

      memoriesDiv.appendChild(memoryDiv);
    });
  } catch (error) {
    console.error("Error fetching memories:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fetchMemories();
});