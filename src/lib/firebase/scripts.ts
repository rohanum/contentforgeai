
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';

export interface SavedYoutubeScript {
  id?: string;
  uid: string;
  topic: string;
  tone?: string;
  scriptLength: 'short-form' | 'long-form';
  script: string;
  createdAt: Timestamp;
}

const scriptsCollection = collection(db, 'savedYoutubeScripts');

export async function saveYoutubeScript(data: Omit<SavedYoutubeScript, 'id' | 'createdAt'>): Promise<string> {
  const docRef = await addDoc(scriptsCollection, {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getSavedYoutubeScripts(uid: string): Promise<SavedYoutubeScript[]> {
  const q = query(scriptsCollection, where('uid', '==', uid));
  const querySnapshot = await getDocs(q);
  const scripts: SavedYoutubeScript[] = [];
  querySnapshot.forEach((doc) => {
    scripts.push({ id: doc.id, ...doc.data() } as SavedYoutubeScript);
  });
  
  // Sort client-side to avoid needing a composite index
  scripts.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());

  return scripts;
}
