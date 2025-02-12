// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

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
const fotosDiv = document.getElementById("fotos");
const loadingText = document.getElementById("loading");
const uploadForm = document.getElementById("photo-form");
const photoInput = document.getElementById("photoInput");

// Fetch and display photos from Firestore & Storage
async function fetchPhotos() {

  let photoURLs = [];

  try {
    // Fetch photos from Firestore (memorias collection)
    const querySnapshot = await getDocs(collection(db, "memoria"));
    await querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.imageURL) {
        photoURLs.push(data.imageURL);
      }
    });

    // Fetch photos from Firebase Storage (fotos folder)
    const fotosRef = ref(storage, "fotos");
    const fotosList = await listAll(fotosRef);

    for (const item of fotosList.items) {
      const url = await getDownloadURL(item);
      photoURLs.push(url);
    }

    // sort photos by date
    photoURLs.sort((a, b) => a.localeCompare(b));

    
    fotosDiv.innerHTML = "";
    loadingText.style.display = "block";

    // Display photos
    loadingText.style.display = "none";
    if (photoURLs.length === 0) {
      fotosDiv.innerHTML = "<p>Nenhuma foto encontrada.</p>";
    } else {
      photoURLs.forEach((url) => {
        const img = document.createElement("img");
        img.src = url;
        img.alt = "Foto";
        img.classList.add("photo");
        fotosDiv.appendChild(img);
      });
    }
  } catch (error) {
    console.error("Erro ao buscar fotos:", error);
    fotosDiv.innerHTML = "<p>Erro ao carregar fotos.</p>";
  }
}

// Upload photo to Firebase Storage and Firestore
uploadForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const file = photoInput.files[0];
  if (!file) return;

  try {
    const storageRef = ref(storage, `fotos/${file.name}`);
    await uploadBytes(storageRef, file);

    alert("Foto enviada com sucesso!");
    photoInput.value = "";
    fetchPhotos(); // Refresh photos
  } catch (error) {
    console.error("Erro ao enviar foto:", error);
    alert("Erro ao enviar foto.");
  }
});

// Load photos when page loads
document.addEventListener("DOMContentLoaded", fetchPhotos);
