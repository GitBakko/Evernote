import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface VaultState {
  isSetup: boolean;
  pinHash: string | null;
  isUnlocked: boolean;
  pin: string | null; // Store PIN in memory when unlocked
  setupVault: (pinHash: string, pin: string) => void;
  unlockVault: (pin: string) => void;
  lockVault: () => void;
  resetVault: () => void;
}

export const useVaultStore = create<VaultState>()(
  persist(
    (set) => ({
      isSetup: false,
      pinHash: null,
      isUnlocked: false,
      pin: null,

      setupVault: (pinHash, pin) => set({ isSetup: true, pinHash, isUnlocked: true, pin }),
      unlockVault: (pin) => set({ isUnlocked: true, pin }),
      lockVault: () => set({ isUnlocked: false, pin: null }),
      resetVault: () => set({ isSetup: false, pinHash: null, isUnlocked: false, pin: null }),
    }),
    {
      name: 'vault-storage',
      partialize: (state) => ({ isSetup: state.isSetup, pinHash: state.pinHash }), // Only persist setup status and hash
    }
  )
);
