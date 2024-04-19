import { create } from "zustand";

export interface ImportDialogStore {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export const useImportDialogStore = create<ImportDialogStore>((set) => ({
  open: false,
  setOpen: (value) => set({ open: value }),
}));
