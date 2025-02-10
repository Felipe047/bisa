// Import Firebase v9 modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

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

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Initialize Firestore
const storage = getStorage(app); // Initialize Storage

// 🔗 DOM Elements
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author"); // ✅ Author Field
const textInput = document.getElementById("text");
const imageInput = document.getElementById("image");   // ✅ Image Input
const postButton = document.getElementById("submit");

// 🚀 Add Memory Function
async function addMemory() {
  const titulo = titleInput.value.trim();
  const autor = authorInput.value.trim();
  const texto = textInput.value.trim();
  const imageFile = imageInput.files[0]; // ✅ Get the image file

  if (!titulo || !autor || !texto) {
    alert("Por favor, preencha o título, autor e o texto.");
    return;
  }

  // show loading spinner
  postButton.innerText = "Adicionando...";
  // Disable the button to prevent multiple clicks
  postButton.disabled = true;

  try {
    let imageURL = "";

    // 📤 Upload Image if provided
    if (imageFile) {
      const storageRef = ref(storage, `memorias/${Date.now()}_${imageFile.name}`);

      // Use `uploadBytes` to upload the file
      const snapshot = await uploadBytes(storageRef, imageFile);

      // 🔗 Get the download URL after successful upload
      imageURL = await getDownloadURL(snapshot.ref);
    }

    // 🔥 Add memory to Firestore
    await addDoc(collection(db, "memoria"), {
      titulo,
      autor,
      texto,
      imageURL, // ✅ Save the image URL in Firestore
      createdAt: serverTimestamp(), // Use serverTimestamp from Firebase v9
    });

    alert("Memória adicionada com sucesso!");
    // send user back to receita page
    location.href = "./memorias.html";

  } catch (error) {
    console.error("Erro ao adicionar memória:", error);
    alert("Ocorreu um erro ao adicionar a memória.");
  }
}

// 🖱️ Event Listener
postButton.addEventListener("click", addMemory);