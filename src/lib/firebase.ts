import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  AuthError, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { doc, getDocFromServer, getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const dbId = firebaseConfig.firestoreDatabaseId;
export const db = (dbId === '(default)' || !dbId) ? getFirestore(app) : getFirestore(app, dbId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithEmail = (email: string, pass: string) => signInWithEmailAndPassword(auth, email, pass);
export const signUpWithEmail = (email: string, pass: string) => createUserWithEmailAndPassword(auth, email, pass);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  console.log('Current User on Error:', auth.currentUser ? { uid: auth.currentUser.uid, email: auth.currentUser.email } : 'Not logged in');
  console.error('Detailed Firestore Error Object:', error);
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  const message = JSON.stringify(errInfo);
  console.error('Firestore Error: ', message);
  return message; // Return the message instead of throwing immediately to allow components to handle it
}

let isSigningIn = false;

export const signInWithGoogle = async () => {
  if (isSigningIn) return null;
  isSigningIn = true;
  try {
    return await signInWithPopup(auth, googleProvider);
  } catch (error) {
    const authError = error as AuthError;
    if (authError.code === 'auth/user-cancelled' || 
        authError.code === 'auth/cancelled-popup-request' ||
        authError.code === 'auth/popup-closed-by-user') {
        console.log('User closed the sign-in popup or overlapping flow.');
        return null;
    }
    
    if (authError.code === 'auth/network-request-failed') {
      const message = "Network request failed. This is often caused by an ad-blocker or a firewall blocking Firebase's authentication domain. Please disable any ad-blockers for this site and try again.";
      console.error('Sign-in Error:', message);
      alert(message);
      return null;
    }

    if (authError.code === 'auth/unauthorized-domain') {
      const currentDomain = window.location.hostname;
      const message = `This domain (${currentDomain}) is not authorized in your Firebase project. \n\nPlease go to the Firebase Console -> Authentication -> Settings -> Authorized domains and add "${currentDomain}" to the list.`;
      console.error('Sign-in Error:', message);
      alert(message);
      return null;
    }

    console.error('Sign-in Error:', authError.message);
    throw authError;
  } finally {
    isSigningIn = false;
  }
};

export const logout = () => signOut(auth);
