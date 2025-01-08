import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { auth } from '../config/firebase';

// Generic type for all items
interface BaseItem {
  id?: string;
  userId?: string;
}

// Helper function to convert Firestore document to item
const convertDoc = <T extends BaseItem>(
  doc: QueryDocumentSnapshot<DocumentData>
): T => {
  return {
    id: doc.id,
    ...doc.data()
  } as T;
};

// Generic CRUD operations
export const firestoreService = {
  // Create
  async create<T extends BaseItem>(collectionName: string, data: T): Promise<T> {
    if (!auth.currentUser) throw new Error('No authenticated user');
    
    const dataWithUser = {
      ...data,
      userId: auth.currentUser.uid,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const docRef = await addDoc(collection(db, collectionName), dataWithUser);
    return {
      ...data,
      id: docRef.id,
      userId: auth.currentUser.uid
    };
  },

  // Read all for current user
  async getAll<T extends BaseItem>(collectionName: string): Promise<T[]> {
    if (!auth.currentUser) throw new Error('No authenticated user');
    
    const q = query(
      collection(db, collectionName),
      where('userId', '==', auth.currentUser.uid)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => convertDoc<T>(doc));
  },

  // Update
  async update<T extends BaseItem>(
    collectionName: string,
    id: string,
    data: Partial<T>
  ): Promise<void> {
    if (!auth.currentUser) throw new Error('No authenticated user');
    
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date()
    });
  },

  // Delete
  async delete(collectionName: string, id: string): Promise<void> {
    if (!auth.currentUser) throw new Error('No authenticated user');
    
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  }
};

// Collection names
export const COLLECTIONS = {
  INGREDIENTS: 'ingredients',
  RECIPES: 'recipes',
  PACKAGING: 'packaging',
  PACKAGING_BUNDLES: 'packagingBundles'
}; 