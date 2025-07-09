
// src/lib/firebase/brand-kit.ts
import {
  doc,
  setDoc,
  getDoc,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';

export interface BrandKit {
  id?: string;
  uid: string;
  brandName: string;
  brandDescription: string;
  keywords: string[];
  toneOfVoice: string;
  updatedAt?: Timestamp;
}

const brandKitCollection = 'brandKits';

export async function saveBrandKit(uid: string, data: Omit<BrandKit, 'uid' | 'id' | 'updatedAt'>): Promise<void> {
  const brandKitRef = doc(db, brandKitCollection, uid);
  await setDoc(brandKitRef, {
    ...data,
    uid: uid,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function getBrandKit(uid:string): Promise<BrandKit | null> {
    const brandKitRef = doc(db, brandKitCollection, uid);
    const docSnap = await getDoc(brandKitRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as BrandKit;
    } else {
        return null;
    }
}
