
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

export interface SavedTrend {
  id?: string;
  uid: string;
  title: string;
  reason: string;
  contentSuggestion: string;
  popularity: string;
  suggestedCTA: string;
  createdAt: Timestamp;
}

const trendsCollection = collection(db, 'savedTrends');

export async function saveTrend(data: Omit<SavedTrend, 'id' | 'createdAt'>): Promise<string> {
  const docRef = await addDoc(trendsCollection, {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getSavedTrends(uid: string): Promise<SavedTrend[]> {
  const q = query(trendsCollection, where('uid', '==', uid));
  const querySnapshot = await getDocs(q);
  const trends: SavedTrend[] = [];
  querySnapshot.forEach((doc) => {
    trends.push({ id: doc.id, ...doc.data() } as SavedTrend);
  });
  
  trends.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());

  return trends;
}
