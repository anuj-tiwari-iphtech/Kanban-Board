import { createContext, useContext, useState, useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "../Firebase/firebase"

const AuthContext = createContext();

export default function AuthProvider({children}) {

    const [currentUser, setCurrentUser] = useState(null);
    const [loading , setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            try {
                if(firebaseUser){
                    const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))
                    if(userDoc.exists()){
                        setCurrentUser({id : firebaseUser.uid, ...userDoc.data()});
                    }else{
                        setCurrentUser(null);
                    }
                }else{
                    setCurrentUser(null)
                }
                setLoading(false)
            }catch(error){
                console.error("Error loading user:", error);
                setCurrentUser(null)
            } finally {
                setLoading(false);
            }
        })

        return () => unsubscribe();
    }, [])

  return(
    <AuthContext.Provider value={{currentUser, setCurrentUser, loading}}>
        {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext(){
    return useContext(AuthContext);
}