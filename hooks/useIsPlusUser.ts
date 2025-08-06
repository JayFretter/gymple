import { useState, useEffect } from 'react';
import { getAuth } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

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

    const unsubscribe = firestore()
      .collection('users')
      .where('uid', '==', uid)
      .onSnapshot(snapshot => {
        let foundPlus = false;
        snapshot.forEach(doc => {
          const userData = doc.data() as UserData;
          if (userData.isPlusUser === true) {
            foundPlus = true;
          }
        });
        setIsPlusUser(foundPlus);
      });

    return () => {
      unsubscribe();
    };
  }, [uid]);

  return isPlusUser;
}