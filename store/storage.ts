import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface IStorageState {
    value: string;
    setValue: (v: string) => void;
    removeValue: () => void;
};

const useLocalStorageStore = create<IStorageState>()(

    persist(

        (set) => ({
            value: '',
            setValue: (v) => set({ value: v }),
            removeValue: () => set({ value: '' }),
        }),

        { name: 'proton' }

    )

);

const useSessionStorageStore = create<IStorageState>()(

    persist(

        (set) => ({
            value: '',
            setValue: (v) => set({ value: v }),
            removeValue: () => set({ value: '' }),
        }),

        { name: 'electron', storage: createJSONStorage(() => sessionStorage) }

    )

);

const useLocalStorage = () => {
    const proton = useLocalStorageStore((state) => state.value);
    const setProton = useLocalStorageStore((state) => state.setValue);
    const removeProton = useLocalStorageStore((state) => state.removeValue);

    return { proton, setProton, removeProton };

};

const useSessionStorage = () => {
    const electron = useSessionStorageStore((state) => state.value);
    const setElectron = useSessionStorageStore((state) => state.setValue);
    const removeElectron = useSessionStorageStore((state) => state.removeValue);

    return { electron, setElectron, removeElectron };

};

export { useLocalStorage, useSessionStorage };
export type { IStorageState };