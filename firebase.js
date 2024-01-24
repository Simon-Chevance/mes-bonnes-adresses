import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { useEffect } from 'react';

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
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage();

export { app, auth, db };

export function useAuth() {
    const [currentUser, setCurrentUser] = useState();

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, user => setCurrentUser(user));
        return unsub;
    }, []);

    return currentUser;
}

export async function upload(file, currentUser, setLoading) {
    const fileRef = ref(storage, currentUser.uid + '.png');
    
    setLoading(true);
    const snapshot = uploadBytes(fileRef, file);
    setLoading(false);
    alert("Uploaded File")
}
