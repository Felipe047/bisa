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
const storage = firebase.storage(); // ✅ Firebase Storage

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

  try {
    let imageURL = "";

    // 📤 Upload Image if provided
    if (imageFile) {
      const storageRef = storage.ref(`memorias/${Date.now()}_${imageFile.name}`);

      // ✅ Upload the file using uploadBytes
      const snapshot = await storageRef.put(imageFile);

      // 🔗 Get the download URL after successful upload
      //imageURL = await snapshot.ref.getDownloadURL();
    }

    // 🔥 Add memory to Firestore
    await db.collection("memoria").add({
      titulo,
      autor,
      texto,
      imageURL, // ✅ Save the image URL in Firestore
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    alert("Memória adicionada com sucesso!");

    // 🔄 Clear inputs
    titleInput.value = "";
    authorInput.value = "";
    textInput.value = "";
    imageInput.value = ""; 
  } catch (error) {
    console.error("Erro ao adicionar memória:", error);
    alert("Ocorreu um erro ao adicionar a memória.");
  }
}

// 🖱️ Event Listener
postButton.addEventListener("click", addMemory);
