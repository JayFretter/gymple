import { useState, useEffect } from 'react';
import { getAuth } from '@react-native-firebase/auth';
import firestore, {
  doc,
  onSnapshot,
  getFirestore,
} from '@react-native-firebase/firestore';

interface UserData {
  isPlusUser?: boolean;
  [key: string]: any;
}

export default function useIsPlusUser(): boolean {
  const [isPlusUser, setIsPlusUser] = useState<boolean>(false);
  const auth = getAuth();
  const uid = auth.currentUser?.uid;

  useEffect(() => {
    if (!uid) {
      setIsPlusUser(false);
      return;
    }

    // Modular API usage
    const db = getFirestore();
    const userDocRef = doc(db, 'users', uid);

    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      const userData = docSnap.data() as UserData | undefined;
      if (!userData) {
        setIsPlusUser(false);
        return;
      }
      setIsPlusUser(userData.isPlusUser === true);
    });

    return () => {
      unsubscribe();
    };
  }, [uid]);

  return isPlusUser;
}