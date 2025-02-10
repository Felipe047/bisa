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

// Get the container element for memories
const memoriesDiv = document.getElementById("memorias");

// Fetch and display all memory documents from the "memoria" collection
async function fetchMemories() {
  try {
    const querySnapshot = await getDocs(collection(db, "memoria"));

    // remove loading spinner
    memoriesDiv.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const memory = doc.data();
      const memoryDiv = document.createElement("div");
      memoryDiv.classList.add("memory-card");

      memoryDiv.innerHTML = `
        <a class="memory-container" href="memoria.html?id=${doc.id}">
          <h2 class="memory-title">${memory.titulo}</h2>
          ${memory.autor ? `<p class="memory-author">${memory.autor}</p>` : ""}
          ${memory.imageURL ? `<img class="memory-image" src="${memory.imageURL}" alt="${memory.titulo}">` : ""}
          <p class="memory-text">${memory.texto ? memory.texto.substring(0, 150) + "..." : ""}</p>
          <p class="memory-link">Read More</p>
        </a>
      `;

      memoriesDiv.appendChild(memoryDiv);
    });
  } catch (error) {
    console.error("Error fetching memories:", error);
  }
}

// Trigger fetching of memories once the page content has loaded
document.addEventListener("DOMContentLoaded", fetchMemories);
