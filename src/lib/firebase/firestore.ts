// src/lib/firebase/firestore.ts
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  Timestamp
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
  const q = query(ideasCollection, where('uid', '==', uid));
  const querySnapshot = await getDocs(q);
  const ideas: ContentIdea[] = [];
  querySnapshot.forEach((doc) => {
    ideas.push({ id: doc.id, ...doc.data() } as ContentIdea);
  });

  // Sort client-side to avoid needing a composite index
  ideas.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
  
  return ideas;
}
