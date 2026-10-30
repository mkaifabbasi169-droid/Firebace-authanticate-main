
console.log("Firebase Authentication Loaded");

import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";

import {
    getFirestore,
    setDoc,
    doc
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";


// Firebase Configuration

const firebaseConfig = {
    apiKey: "AIzaSyCLVEpkktf4bcU9Z4zXP_83aJpY68agDtA",
    authDomain: "fir-authentication-b8bed.firebaseapp.com",
    projectId: "fir-authentication-b8bed",
    storageBucket: "fir-authentication-b8bed.firebasestorage.app",
    messagingSenderId: "749222606949",
    appId: "1:749222606949:web:338fc51a8083004d33ae8c"
};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


// Current Page

const currentPage = window.location.pathname.split("/").pop();


// Show Messages

function showMessage(message, type = "danger") {

    const messageBox = document.getElementById("message");

    if (!messageBox) return;

    messageBox.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
}


// Login Function

const login = async (e) => {

    e.preventDefault();

    const email = document.getElementById("login-email").value.trim();

    const password = document.getElementById("login-password").value;

    const button = e.submitter;

    button.disabled = true;
    button.innerText = "Logging in...";

    try {

        await signInWithEmailAndPassword(auth, email, password);

        window.location.href = "dashboard.html";

    } catch (error) {

        showMessage(error.message);

        button.disabled = false;
        button.innerHTML = `Login <i class="bi bi-arrow-right ms-2"></i>`;

    }

};


// Signup Function

const register = async (e) => {

    e.preventDefault();

    const email = document.getElementById("register-email").value.trim();

    const password = document.getElementById("register-password").value;

    const button = e.submitter;

    button.disabled = true;
    button.innerText = "Creating Account...";

    try {

        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {

            email: user.email,
            username: "",
            phone: "",
            uid: user.uid

        });

        window.location.href = "dashboard.html";

    } catch (error) {

        showMessage(error.message);

        button.disabled = false;
        button.innerHTML = `Create Account <i class="bi bi-arrow-right ms-2"></i>`;

    }

};


// Logout Function

const logout = async () => {

    try {

        await signOut(auth);

        window.location.href = "login.html";

    } catch (error) {

        alert(error.message);

    }

};


// Show / Hide Password

function togglePassword(inputId, buttonId) {

    const password = document.getElementById(inputId);

    const button = document.getElementById(buttonId);

    if (!password || !button) return;

    button.addEventListener("click", () => {

        if (password.type === "password") {

            password.type = "text";

            button.innerHTML = '<i class="bi bi-eye-slash"></i>';

        } else {

            password.type = "password";

            button.innerHTML = '<i class="bi bi-eye"></i>';

        }

    });

}


// Form Events

document.getElementById("login-form")
    ?.addEventListener("submit", login);

document.getElementById("register-form")
    ?.addEventListener("submit", register);

document.getElementById("logout")
    ?.addEventListener("click", logout);


// Password Toggle Events

togglePassword("login-password", "toggle-login-password");

togglePassword("register-password", "toggle-register-password");


// Authentication State

onAuthStateChanged(auth, (user) => {

    const isDashboard = currentPage === "dashboard.html";

    const isAuthPage = currentPage === "login.html" ||
                       currentPage === "signup.html";

    if (user && isAuthPage) {

        window.location.href = "dashboard.html";

    }

    else if (!user && isDashboard) {

        window.location.href = "login.html";

    }

    if (user && isDashboard) {

        const emailElement = document.getElementById("user-email");

        if (emailElement) {

            emailElement.innerText = user.email;

        }

    }

});
