import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

import {
	getAuth,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
} from "firebase/auth";

const firebaseConfig = {
	apiKey: "AIzaSyC-O-_73a62Sbd3d-1r6ococBMGnWCI4lc",
	authDomain: "peopletell-9532a.firebaseapp.com",
	projectId: "peopletell-9532a",
	storageBucket: "peopletell-9532a.appspot.com",
	messagingSenderId: "869273724794",
	appId: "1:869273724794:web:0f69583925cbc534c6d8c3",
	measurementId: "G-BC6TH0TVLV",
};

const app = initializeApp(firebaseConfig);

// const analytics = getAnalytics(app);

export const auth = getAuth(app);

export const storage = getStorage(app, "peopletell-9532a.firebaseapp.com");

export const db = getFirestore(app);

export let signUpUser = async (auth, email, password) => {
	await createUserWithEmailAndPassword(auth, email, password);
};

export let signInUser = async (auth, email, password) => {
	await signInWithEmailAndPassword(auth, email, password);
};
