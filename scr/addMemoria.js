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

// 🔗 DOM Elements
const titleInput = document.getElementById("title");
const textInput = document.getElementById("text");
const postButton = document.getElementById("submit");

// 🚀 Add Memory Function
async function addMemory() {
  const titulo = titleInput.value.trim();
  const texto = textInput.value.trim();
  console.log("its in")

  if (!titulo || !texto) {
    alert("Por favor, preencha o título e o texto.");
    return;
  }

  try {
    let imageURL = "";


    // 🔥 Add memory to Firestore
    await db.collection("memoria").add({
      titulo,
      texto,
      imageURL,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    alert("Memória adicionada com sucesso!");
    titleInput.value = "";
    textInput.value = "";
  } catch (error) {
    console.error("Erro ao adicionar memória:", error);
    alert("Ocorreu um erro ao adicionar a memória.");
  }
}

// 🖱️ Event Listener
postButton.addEventListener("click", addMemory);
