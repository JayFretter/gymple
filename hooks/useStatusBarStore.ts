import { create } from 'zustand';

interface StatusBarState {
    node: React.ReactNode | undefined;
    setNode: (node: React.ReactNode) => void;
    removeNode: () => void;
}

const useStatusBarStore = create<StatusBarState>((set) => ({
    node: undefined,
    setNode: (node) => set({ node }),
    removeNode: () => set({ node: undefined })
}))

export default useStatusBarStore;