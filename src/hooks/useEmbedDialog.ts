import { create } from 'zustand'

interface EmbedDialogStore {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export const useEmbedDialog = create<EmbedDialogStore>((set) => ({
  isOpen: false,
  setIsOpen: (open) => set({ isOpen: open }),
}))
