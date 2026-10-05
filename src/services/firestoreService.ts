import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase';
import { StudentProgress, DiscussionPost } from '../types';

const COLLECTION_PROGRESS = 'student_progress';
const COLLECTION_DISCUSSIONS = 'discussions';

/**
 * Saves or updates student progress in Firestore in real time.
 */
export const saveStudentProgressToFirestore = async (progress: StudentProgress): Promise<void> => {
  if (!progress.nisn) return;
  try {
    const docRef = doc(db, COLLECTION_PROGRESS, progress.nisn);
    const dataToSave = {
      ...progress,
      updatedAt: new Date().toISOString()
    };
    await setDoc(docRef, dataToSave, { merge: true });
  } catch (error) {
    console.error("Gagal menyimpan progress ke Firestore:", error);
  }
};

/**
 * Subscribes to real-time updates for ALL students' progress.
 * Used by the Teacher Gradebook to instantly receive submissions from all student devices.
 */
export const subscribeToAllStudentsProgress = (
  callback: (allProgress: Record<string, StudentProgress>) => void
): (() => void) => {
  try {
    const colRef = collection(db, COLLECTION_PROGRESS);
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const result: Record<string, StudentProgress> = {};
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as StudentProgress;
          if (data && data.nisn) {
            result[data.nisn] = data;
          }
        });
        callback(result);
      },
      (error) => {
        console.warn("Real-time listener student_progress notice:", error);
      }
    );
    return unsubscribe;
  } catch (e) {
    console.error("Error setting up real-time listener:", e);
    return () => {};
  }
};

/**
 * Subscribes to an individual student's progress in real-time.
 */
export const subscribeToStudentProgress = (
  nisn: string,
  callback: (prog: StudentProgress | null) => void
): (() => void) => {
  if (!nisn) return () => {};
  try {
    const docRef = doc(db, COLLECTION_PROGRESS, nisn);
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          callback(docSnap.data() as StudentProgress);
        } else {
          callback(null);
        }
      },
      (error) => {
        console.warn("Student progress snapshot notice:", error);
      }
    );
    return unsubscribe;
  } catch (e) {
    console.error("Error subscribing to student progress:", e);
    return () => {};
  }
};

/**
 * Subscribes to class discussions in real time.
 */
export const subscribeToDiscussions = (
  callback: (posts: DiscussionPost[]) => void
): (() => void) => {
  try {
    const colRef = collection(db, COLLECTION_DISCUSSIONS);
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        if (snapshot.empty) return;
        const posts: DiscussionPost[] = [];
        snapshot.forEach((d) => {
          posts.push(d.data() as DiscussionPost);
        });
        // Sort by id or timestamp
        posts.sort((a, b) => b.id.localeCompare(a.id));
        callback(posts);
      },
      (error) => {
        console.warn("Discussions listener notice:", error);
      }
    );
    return unsubscribe;
  } catch (e) {
    console.error("Error subscribing to discussions:", e);
    return () => {};
  }
};

/**
 * Saves a discussion post or reply to Firestore.
 */
export const saveDiscussionToFirestore = async (post: DiscussionPost): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_DISCUSSIONS, post.id);
    await setDoc(docRef, post, { merge: true });
  } catch (error) {
    console.error("Gagal menyimpan diskusi ke Firestore:", error);
  }
};
