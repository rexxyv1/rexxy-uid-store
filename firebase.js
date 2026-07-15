// ==============================
// Firebase Configuration
// ==============================

const firebaseConfig = {
  apiKey: "AIzaSyDp_p8Fbxr7gp-au1CXCGP-uSpGTEOGnlI",
  authDomain: "rexxy-uid-store.firebaseapp.com",
  projectId: "rexxy-uid-store",
  storageBucket: "rexxy-uid-store.firebasestorage.app",
  messagingSenderId: "285573461304",
  appId: "1:285573461304:web:0a4f82ea78d1c8949b7dcd"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firestore
window.db = firebase.firestore();

async function saveEdit(){

const harga=
Number(document.getElementById("editHarga").value);

const login=
document.getElementById("editLogin").value;

const status=
document.getElementById("editStatus").value;

await db.collection("uids")
.doc(currentDoc)
.update({

harga,
login,
status

});

closeModal();

}