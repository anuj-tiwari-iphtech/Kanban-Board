import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../Firebase/firebase";

export default function useAllUsers(){
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "users"),(snapshot) => {
            setUsers(snapshot.docs.map((d) => ({id:d.id, ...d.data()})))
        })
        return () => unsubscribe();
    },[])
    return users;
}