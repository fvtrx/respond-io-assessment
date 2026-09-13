import { create } from 'zustand';
import type { BlockedContact } from '@/lib/types';

type BlockedContactState = {
  blocked: Record<number, BlockedContact>;
  blockContact: (contactId: number, name: string, avatar?: string | null) => void;
  unblockContact: (contactId: number) => void;
  isBlocked: (contactId: number) => boolean;
  reset: () => void;
};

export const useBlockedContactsStore = create<BlockedContactState>((set, get) => ({
  blocked: {},

  blockContact: (contactId, name, avatar) => {
    if (get().blocked[contactId]) return;
    set((state) => ({
      blocked: {
        ...state.blocked,
        [contactId]: {
          id: Date.now(),
          user_id: '',
          contact_id: contactId,
          contact_name: name,
          contact_avatar: avatar ?? null,
          created_at: new Date().toISOString(),
        },
      },
    }));
  },

  unblockContact: (contactId) => {
    set((state) => {
      const next = { ...state.blocked };
      delete next[contactId];
      return { blocked: next };
    });
  },

  isBlocked: (contactId) => Boolean(get().blocked[contactId]),

  reset: () => set({ blocked: {} }),
}));
