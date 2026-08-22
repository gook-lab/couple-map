import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  type User,
} from "firebase/auth";
import { auth } from "@/services/firebase";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  coupleId: string | null;
}

interface AuthStore {
  state: AuthState;
  _hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  setUser: (user: User | null) => void;
  setCoupleId: (id: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AUTH_STORAGE_KEY = "couple-app-auth";

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      state: {
        isAuthenticated: false,
        user: null,
        loading: true,
        coupleId: null,
      },
      _hasHydrated: false,
      setHasHydrated: (v) => set({ _hasHydrated: v }),

      setUser: (user) => {
        set({
          state: {
            ...get().state,
            user,
            isAuthenticated: !!user,
            loading: false,
          },
        });
      },

      setCoupleId: (id) => {
        set({ state: { ...get().state, coupleId: id } });
      },

      login: async (email, password) => {
        const result = await signInWithEmailAndPassword(auth, email, password);
        get().setUser(result.user);
      },

      register: async (email, password) => {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        get().setUser(result.user);
      },

      loginWithGoogle: async () => {
        const provider = new GoogleAuthProvider();
        try {
          await signInWithPopup(auth, provider);
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : "";
          if (msg.includes("popup-closed") || msg.includes("cancelled")) {
            throw err;
          }
          // COOP 에러는 무시 — onAuthStateChanged가 유저를 감지함
          await new Promise((resolve) => {
            const unsub = onAuthStateChanged(auth, (user) => {
              if (user) {
                unsub();
                resolve(user);
              }
            });
            setTimeout(() => { unsub(); resolve(null); }, 10000);
          });
        }
      },

      logout: async () => {
        await firebaseSignOut(auth);
        set({
          state: {
            isAuthenticated: false,
            user: null,
            loading: false,
            coupleId: null,
          },
        });
        localStorage.removeItem(AUTH_STORAGE_KEY);
      },
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        state: {
          isAuthenticated: s.state.isAuthenticated,
          coupleId: s.state.coupleId,
        },
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

let listenerInitialized = false;

export function initAuthListener() {
  if (listenerInitialized) return () => {};
  listenerInitialized = true;

  const unsubscribe = onAuthStateChanged(auth, (user) => {
    useAuthStore.getState().setUser(user);
  });
  return unsubscribe;
}

export function useAuthListener() {
  return initAuthListener;
}

export function useAuth() {
  const store = useAuthStore();
  const hasHydrated = useAuthStore((s) => s._hasHydrated);
  if (!hasHydrated) return null;
  return store;
}
