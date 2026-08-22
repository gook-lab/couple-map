import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { db, auth } from "./firebase";

export interface UserProfile {
  uid: string;
  displayName: string;
  avatar?: string;
  birthday?: string;
  gender?: string;
  bio?: string;
  interests?: string[];
  notificationSettings?: Record<string, boolean>;
  themeSettings?: { palette: string; mode: string; font: string };
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  await setDoc(doc(db, "users", profile.uid), profile, { merge: true });
  if (auth.currentUser && profile.displayName) {
    await updateProfile(auth.currentUser, { displayName: profile.displayName });
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  return { uid: snap.id, ...snap.data() } as UserProfile;
}

export async function updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
  await updateDoc(doc(db, "users", uid), updates);
}
