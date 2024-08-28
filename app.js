let queue = [];
let currentUser = null;
// Import Firebase modules
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, deleteDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDxQrydR8u69TZL4Hl09lYwB1bgyRzs_WQ",
  authDomain: "kataar-69.firebaseapp.com",
  databaseURL: "https://kataar-69-default-rtdb.firebaseio.com",
  projectId: "kataar-69",
  storageBucket: "kataar-69.appspot.com",
  messagingSenderId: "624433221651",
  appId: "1:624433221651:web:97cb03c7f698999a73afe6",
  measurementId: "G-RJ1DP6NCCM"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

function joinQueue(name) {
    currentUser = {
        name: name,
        joinedAt: new Date()
    };
    queue.push(currentUser);
    updateQueueStatus();
}

function leaveQueue() {
    if (currentUser) {
        queue = queue.filter(user => user !== currentUser);
        currentUser = null;
        window.location.href = 'thankyou.html';
    }
}

function updateQueueStatus() {
    const position = queue.indexOf(currentUser) + 1;
    document.getElementById('queue-position').textContent = `Position: ${position}`;
    document.getElementById('queue-time').textContent = `Estimated Wait Time: ${position * 5} minutes`; // Assuming 5 minutes per user

    // Simulating organization actions for demo purposes
    // Removed automatic redirection to thank you page
}

function removeFromQueue() {
    if (currentUser) {
        queue = queue.filter(user => user !== currentUser);
        currentUser = null;
        window.location.href = 'removed.html';
    }
}

async function joinQueue(name) {
    console.log("joinQueue function called"); // Add this line
    try {
        const docRef = await addDoc(collection(db, "queues"), {
            name: name,
            joinedAt: serverTimestamp(),
        });
        console.log("User added to queue with ID: ", docRef.id); // Add this line
    } catch (e) {
        console.error("Error adding user: ", e);
    }
}


document.getElementById('join-queue-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const userName = document.getElementById('user-name-input').value;
    joinQueue(userName);
});

async function leaveQueue(docId) {
    try {
        await deleteDoc(doc(db, "queues", docId));
        console.log("User removed from queue");
        window.location.href = 'thankyou.html';
    } catch (e) {
        console.error("Error removing user: ", e);
    }
}

// Example: Call leaveQueue when a button is clicked
document.getElementById('leave-queue-button').addEventListener('click', () => {
    leaveQueue(currentUserDocId);
});

function updateQueueStatus() {
    const q = query(collection(db, "queues"), orderBy("joinedAt"));
    onSnapshot(q, (snapshot) => {
        let queue = [];
        snapshot.forEach((doc) => {
            queue.push({ ...doc.data(), id: doc.id });
        });

        // Update the UI with the queue status
        console.log(queue);

        // Example: Update queue position on the webpage
        const currentUser = queue.find(user => user.id === currentUserDocId);
        if (currentUser) {
            const position = queue.indexOf(currentUser) + 1;
            document.getElementById('queue-position').textContent = `Position: ${position}`;
            document.getElementById('queue-time').textContent = `Estimated Wait Time: ${position * 5} minutes`;
        }
    });
}

// Example: Call updateQueueStatus when the page loads
document.addEventListener('DOMContentLoaded', updateQueueStatus);

async function removeFromQueue(docId) {
    try {
        await deleteDoc(doc(db, "queues", docId));
        console.log("User removed from queue");
        window.location.href = 'removed.html';
    } catch (e) {
        console.error("Error removing user: ", e);
    }
}

// Example: Call removeFromQueue when an admin removes a user
document.getElementById('remove-user-button').addEventListener('click', () => {
    removeFromQueue(userDocIdToRemove);
});
