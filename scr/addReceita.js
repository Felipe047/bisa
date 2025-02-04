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
const ingredientesInput = document.getElementById("ingridents");
const howToInput = document.getElementById("howto");
const contextInput = document.getElementById("historia relacionada");
const postButton = document.getElementById("submit");

// 🚀 Add Recipe Function
async function addRecipe() {
  const titulo = titleInput.value.trim();
  const ingredientes = ingredientesInput.value.trim();
  const howto = howToInput.value.trim();
  const context = contextInput.value.trim();

  if (!titulo || !ingredientes || !howto) {
    alert("Por favor, preencha o título, ingredientes e modo de preparo.");
    return;
  }

  try {
    let imageURL = ""; // Placeholder for future image handling if needed

    // 🔥 Add recipe to Firestore
    await db.collection("receita").add({
      titulo,
      ingredientes,
      howto,
      context,
      imageURL,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    alert("Receita adicionada com sucesso!");
    titleInput.value = "";
    ingredientesInput.value = "";
    howToInput.value = "";
    contextInput.value = "";
  } catch (error) {
    console.error("Erro ao adicionar receita:", error);
    alert("Ocorreu um erro ao adicionar a receita.");
  }
}

// 🖱️ Event Listener
postButton.addEventListener("click", addRecipe);
