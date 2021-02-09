import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyC8fpIQnzBtXQMB1gYmdTJVOLqi5UVAkLk",
    authDomain: "netflix-clone-6eefa.firebaseapp.com",
    projectId: "netflix-clone-6eefa",
    storageBucket: "netflix-clone-6eefa.appspot.com",
    messagingSenderId: "1061697924754",
    appId: "1:1061697924754:web:15b85f5bbcdd602d6f004b",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();

export { auth };
export default db;
