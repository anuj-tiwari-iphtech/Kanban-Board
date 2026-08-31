import { initializeApp, deleteApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { firebaseConfig, db } from "../Firebase/firebase";

const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin;

export const inviteUser = async (email, role = "restricted") => {
  
  const tempApp = initializeApp(firebaseConfig, "TempApp");
  const tempAuth = getAuth(tempApp);

  try {
    
    const tempPassword = Math.random().toString(36).slice(-10) + "A1!";

   
    const userCredential = await createUserWithEmailAndPassword(tempAuth, email, tempPassword);
    const newUser = userCredential.user;

    const defaultAvatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`;

    await setDoc(doc(db, "users", newUser.uid), {
      id: newUser.uid,
      email: email,
      name: email.split("@")[0],
      role: role,
      avatar: defaultAvatarUrl,
      createdAt: new Date().toISOString()
    });

    
    const actionCodeSettings = {
      url: `${baseUrl}/reset-password`,
      handleCodeInApp: true,
    };

    await sendPasswordResetEmail(tempAuth, email, actionCodeSettings);

    
    await deleteApp(tempApp);

    return { success: true };
  } catch (error) {
    await deleteApp(tempApp);
    throw error;
  }
};