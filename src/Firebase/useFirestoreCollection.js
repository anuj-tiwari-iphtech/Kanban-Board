import { useState, useEffect } from "react";
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  writeBatch
} from "firebase/firestore";
import { db } from "./firebase";

export default function useFirestoreCollection(collectionName, userId, isShared = true) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if ( !isShared && !userId) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const q = isShared 
        ? query(collection(db, collectionName))
        : query(collection(db, collectionName), where("userId","==", userId))

    const unsubscribe = onSnapshot(q,(snapshot) => {
        const items = snapshot.docs.map((docItem) => ({
          id: docItem.id,
          ...docItem.data(),
        }));

        setData(items);
        setLoading(false);
      },
      (error) => {
        console.error(`Error loading ${collectionName}:`, error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, userId]);

  const add = async (item) => {
    if (!userId) {
      throw new Error("User is not authenticated");
    }

    const payload = {
      ...item,
      userId,
      createdAt: item.createdAt || new Date().toISOString(),
    };

    return await addDoc(collection(db, collectionName), payload);
  };

  const update = async (id, updates) => {
    if (!userId) throw new Error("User is not authenticated");

    const docRef = doc(db, collectionName, id);
    return await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  };

  const remove = async (id) => {
    if (!userId) {
      throw new Error("User is not authenticated");
    }
    const docRef = doc(db, collectionName, id);
    return await deleteDoc(docRef);
  };

  const batchUpdate = async (updates) => {
    const batch = writeBatch(db);
    updates.forEach(({id, data}) => {
      batch.update(doc(db, collectionName, id), data);
    })
    await batch.commit();
  }

  return { data, loading, add, update, remove , batchUpdate};
}