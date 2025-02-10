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
const textInput = document.getElementById("text");
const imageInput = document.getElementById("image");
const postButton = document.getElementById("submit");
const memoryImagePreview = document.getElementById("memory-image-preview");

// Get memory ID from URL
const urlParams = new URLSearchParams(window.location.search);
const memoryId = urlParams.get("id");

if (!memoryId) {
  alert("Erro: Nenhuma memória especificada para edição.");
  window.location.href = "memorias.html"; // Redirect if no ID
}

// Load existing memory data
async function loadMemory() {
  try {
    const docRef = doc(db, "memoria", memoryId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const memoria = docSnap.data();

      // Populate form with existing data
      titleInput.value = memoria.titulo || "";
      authorInput.value = memoria.autor || "";
      textInput.value = memoria.texto || "";

      // Show existing image if available
      if (memoria.imageURL) {
        memoryImagePreview.src = memoria.imageURL;
        memoryImagePreview.style.display = "block";
      }
    } else {
      alert("Memória não encontrada.");
      window.location.href = "memorias.html"; // Redirect if not found
    }
  } catch (error) {
    console.error("Erro ao carregar memória:", error);
    alert("Erro ao carregar os dados da memória.");
  }
}

// Update Memory Function
async function updateMemory() {
  const titulo = titleInput.value.trim();
  const autor = authorInput.value.trim();
  const texto = textInput.value.trim();
  const imageFile = imageInput.files[0];

  if (!titulo || !autor || !texto) {
    alert("Por favor, preencha o título, autor e texto.");
    return;
  }

  // Show loading spinner
  postButton.innerText = "Atualizando...";
  postButton.disabled = true; // Disable the button to prevent multiple clicks

  try {
    let imageURL = memoryImagePreview.src || ""; // Keep existing image if no new one is uploaded

    // Upload new image if provided
    if (imageFile) {
      const storageRef = ref(storage, `memorias/${Date.now()}_${imageFile.name}`);
      const snapshot = await uploadBytes(storageRef, imageFile);
      imageURL = await getDownloadURL(snapshot.ref);
    }

    // Update memory in Firestore
    const docRef = doc(db, "memoria", memoryId);
    await updateDoc(docRef, {
      titulo,
      autor,
      texto,
      imageURL,
      updatedAt: serverTimestamp(),
    });

    alert("Memória atualizada com sucesso!");
    window.location.href = "memorias.html"; // Redirect back
  } catch (error) {
    console.error("Erro ao atualizar memória:", error);
    alert("Ocorreu um erro ao atualizar a memória.");
  }
}

// Load the memory when page is loaded
document.addEventListener("DOMContentLoaded", loadMemory);

// Event Listener
postButton.addEventListener("click", updateMemory);
