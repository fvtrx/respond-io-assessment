import { create } from 'zustand';
import { mockAuth, type MockUser } from '@/lib/mockAuth';

type AuthState = {
  user: MockUser | null;
  initializing: boolean;
  setUser: (user: MockUser | null) => void;
  setInitializing: (v: boolean) => void;
  init: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  initializing: true,
  setUser: (user) => set({ user }),
  setInitializing: (v) => set({ initializing: v }),

  init: async () => {
    const user = await mockAuth.getSession();
    set({ user, initializing: false });
  },

  signIn: async (email, password) => {
    const user = await mockAuth.signIn(email, password);
    set({ user });
  },

  signUp: async (email, password) => {
    const user = await mockAuth.signUp(email, password);
    set({ user });
  },

  signOut: async () => {
    await mockAuth.signOut();
    set({ user: null });
  },
}));

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const initializing = useAuthStore((s) => s.initializing);
  return { user, initializing };
}
