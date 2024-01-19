import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDUr8r4BMBg5_SL2XV7c7QZqoXWCq2Kz5M",
    authDomain: "webd-project-27c5e.firebaseapp.com",
    projectId: "webd-project-27c5e",
    storageBucket: "webd-project-27c5e.appspot.com",
    messagingSenderId: "834211829253",
    appId: "1:834211829253:web:01814dd1336890ea57ae6c",
    measurementId: "G-3ESB7VNCHW"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };