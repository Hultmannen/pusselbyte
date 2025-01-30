// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, addDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// Your Firebase configuration (replace with your actual config)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_ID",
    appId: "YOUR_APP_ID",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Upload puzzle
async function uploadPuzzle() {
    const file = document.getElementById('puzzleImage').files[0];
    const name = document.getElementById('puzzleName').value;
    const description = document.getElementById('puzzleDescription').value;
    
    if (!file || !name) {
        alert("Please fill in all fields!");
        return;
    }

    const storageRef = ref(storage, `puzzles/${file.name}`);
    await uploadBytes(storageRef, file);
    const imageURL = await getDownloadURL(storageRef);

    await addDoc(collection(db, "puzzles"), {
        name: name,
        description: description,
        imageUrl: imageURL
    });

    alert("Puzzle Uploaded!");
    displayPuzzles();
}

// Display available puzzles
async function displayPuzzles() {
    const puzzleList = document.getElementById('puzzleList');
    puzzleList.innerHTML = "";

    const querySnapshot = await getDocs(collection(db, "puzzles"));
    querySnapshot.forEach((doc) => {
        const puzzle = doc.data();
        puzzleList.innerHTML += `
            <div class="puzzle">
                <img src="${puzzle.imageUrl}" width="100">
                <h3>${puzzle.name}</h3>
                <p>${puzzle.description}</p>
                <button onclick="requestTrade('${doc.id}')">Request Trade</button>
            </div>
        `;
    });
}

// Request a trade
function requestTrade(puzzleId) {
    alert(`Trade request sent for puzzle ID: ${puzzleId}`);
}

// Load puzzles on startup
displayPuzzles();
