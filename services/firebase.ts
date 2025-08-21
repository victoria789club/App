// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC82Y9Z5Dt141-hpGFBDtN4sEqsGNL18DQ",
  authDomain: "mvps-vip.firebaseapp.com",
  projectId: "mvps-vip",
  storageBucket: "mvps-vip.appspot.com",
  messagingSenderId: "1095683043946",
  appId: "1:1095683043946:web:232d5eb4251e54d26e9013"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get service instances
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

/**
 * Uploads a file to Firebase Storage.
 * @param file The file to upload.
 * @param path The path in storage where the file should be saved.
 * @returns A promise that resolves with the public download URL of the file.
 */
const uploadFile = async (file: File, path: string): Promise<string> => {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
};


export { db, storage, auth, uploadFile };
