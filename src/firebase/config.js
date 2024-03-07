import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
	apiKey: "AIzaSyDbJncVqngu453A1wlMxKm4rqnUNFJs0p4",
	authDomain: "tap-to-record-demo.firebaseapp.com",
	projectId: "tap-to-record-demo",
	storageBucket: "tap-to-record-demo.appspot.com",
	messagingSenderId: "968177256742",
	appId: "1:968177256742:web:c049f1de7d5436368599e7",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage();

export default app;
