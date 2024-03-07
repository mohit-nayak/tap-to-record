import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
	apiKey: "AIzaSyCIucqRiQ0HuigH4rYNGQEhY9LruGqkUOs",
	authDomain: "tap-to-record-c490d.firebaseapp.com",
	projectId: "tap-to-record-c490d",
	storageBucket: "tap-to-record-c490d.appspot.com",
	messagingSenderId: "100726468494",
	appId: "1:100726468494:web:a675532291dc3ba11b3edf",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage();

export default app;