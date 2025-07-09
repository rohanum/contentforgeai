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
import type { ViralVideoConcept as ViralVideoConceptType } from '@/ai/flows/find-viral-video-ideas';

export interface SavedViralVideoConcept extends ViralVideoConceptType {
  id?: string;
  uid: string;
  niche: string;
  createdAt: Timestamp;
}

const conceptsCollection = collection(db, 'savedVideoConcepts');

export async function saveViralVideoConcept(data: Omit<SavedViralVideoConcept, 'id' | 'createdAt'>): Promise<string> {
  const docRef = await addDoc(conceptsCollection, {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getSavedViralVideoConcepts(uid: string): Promise<SavedViralVideoConcept[]> {
  const q = query(conceptsCollection, where('uid', '==', uid));
  const querySnapshot = await getDocs(q);
  const concepts: SavedViralVideoConcept[] = [];
  querySnapshot.forEach((doc) => {
    concepts.push({ id: doc.id, ...doc.data() } as SavedViralVideoConcept);
  });
  
  concepts.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());

  return concepts;
}
