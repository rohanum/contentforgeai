// src/lib/firebase/firestore.ts
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  Timestamp,
  orderBy
} from 'firebase/firestore';
import { db } from './config';

export interface ContentIdea {
    id?: string;
    uid: string;
    date: string; // YYYY-MM-DD format
    text: string;
    createdAt: Timestamp;
}

const ideasCollection = collection(db, 'contentIdeas');

export async function addContentIdea(idea: Omit<ContentIdea, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(ideasCollection, {
        ...idea,
        createdAt: Timestamp.now(),
    });
    return docRef.id;
}

export async function getContentIdeas(uid: string): Promise<ContentIdea[]> {
  const q = query(ideasCollection, where('uid', '==', uid), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  const ideas: ContentIdea[] = [];
  querySnapshot.forEach((doc) => {
    ideas.push({ id: doc.id, ...doc.data() } as ContentIdea);
  });
  return ideas;
}
