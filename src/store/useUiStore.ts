import { create } from 'zustand'

interface UiState {
  isGlobalLoading: boolean
  setLoading: (state: boolean) => void
}

export const useUiStore = create<UiState>((set) => ({
  isGlobalLoading: false,
  setLoading: (state) => set({ isGlobalLoading: state }),
}))
