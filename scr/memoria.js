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

// Get memory ID from URL
function getMemoryIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// Fetch and display memory
async function fetchMemory() {
  const memoriaDiv = document.getElementById("memoria");
  const memoryId = getMemoryIdFromURL();

  if (!memoryId) {
    memoriaDiv.innerHTML = "<p>ID da memória não encontrado na URL.</p>";
    return;
  }

  try {
    const memoryDoc = await getDoc(doc(db, "memoria", memoryId));

    if (!memoryDoc.exists()) {
      memoriaDiv.innerHTML = "<p>Memória não encontrada.</p>";
      return;
    }

    const memory = memoryDoc.data();
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

// Add comment function
async function addComment(event) {
  event.preventDefault();

  const memoryId = getMemoryIdFromURL();
  const name = document.getElementById("name").value.trim();
  const comment = document.getElementById("comment").value.trim();

  if (!name || !comment) {
    alert("Por favor, preencha o nome e o comentário.");
    return;
  }

  try {
    await addDoc(collection(db, "memoria", memoryId, "comments"), {
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
  const memoryId = getMemoryIdFromURL();
  const commentsDiv = document.getElementById("comments");
  commentsDiv.innerHTML = "<p>Carregando comentários...</p>";

  const commentsRef = collection(db, "memoria", memoryId, "comments");
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
  fetchMemory();
  loadComments();
});

document.querySelector("#comment-form button").addEventListener("click", addComment);
