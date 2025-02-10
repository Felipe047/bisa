// Import Firebase v9 modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

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

// Get the DOM element where the memory details will be displayed
const memoriaDiv = document.getElementById("memoria");

// Retrieve the memory ID from the URL query parameters (e.g., ?id=abc123)
function getMemoryIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// go to different page
function goToEdit() {
  window.location.href = "../pages/editMemoria.html?id=" + getMemoryIdFromURL();
}

const editButton = document.getElementById("edit-button");

editButton.addEventListener("click", goToEdit);

// Fetch and display the memory document by its ID
async function fetchMemory() {
  const memoryId = getMemoryIdFromURL();

  if (!memoryId) {
    memoriaDiv.innerHTML = "<p>ID da memória não encontrado na URL.</p>";
    return;
  }

  try {
    const memoryDoc = await getDoc(doc(db, "memoria", memoryId));

    memoriaDiv.innerHTML = "";

    if (!memoryDoc.exists()) {
      memoriaDiv.innerHTML = "<p>Memória não encontrada.</p>";
      return;
    }

    const memory = memoryDoc.data();

    console.log()

    // Build the HTML to display the memory details, including author and image if available
    memoriaDiv.innerHTML = `
      <h2>${memory.titulo}</h2>
      ${memory.autor ? `<p><strong>Autor:</strong> ${memory.autor}</p>` : ""}
      ${memory.imageURL ? `<img src="${memory.imageURL}" alt="${memory.titulo}" style="max-width: 400px;">` : ""}
      <p>${memory.texto ? memory.texto.replace(/\n/g, "<br>") : ""}</p>
    `;
  } catch (error) {
    console.error("Erro ao buscar a memória:", error);
    memoriaDiv.innerHTML = "<p>Ocorreu um erro ao carregar a memória.</p>";
  }
}

// Trigger fetching of the memory when the page loads
document.addEventListener("DOMContentLoaded", fetchMemory);
