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
const memoriaDiv = document.getElementById("memoria");

// 🔍 Get Memory ID from URL
function getMemoryIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id"); // e.g., ?id=abc123
}

// 🚀 Fetch and Display Memory by ID
async function fetchMemory() {
  const memoryId = getMemoryIdFromURL();

  if (!memoryId) {
    memoriaDiv.innerHTML = "<p>ID da memória não encontrado na URL.</p>";
    return;
  }

  try {
    const doc = await db.collection("memoria").doc(memoryId).get();

    if (!doc.exists) {
      memoriaDiv.innerHTML = "<p>Memória não encontrada.</p>";
      return;
    }

    const memory = doc.data();

    memoriaDiv.innerHTML = `
      <h2>${memory.titulo}</h2>
      <p>${memory.texto}</p>
    `;
  } catch (error) {
    console.error("Erro ao buscar a memória:", error);
    memoriaDiv.innerHTML = "<p>Ocorreu um erro ao carregar a memória.</p>";
  }
}

// 🖱️ Trigger on Page Load
document.addEventListener("DOMContentLoaded", fetchMemory);
