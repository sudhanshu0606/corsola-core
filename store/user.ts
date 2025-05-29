import { create } from 'zustand';

import { IUser } from '@/interfaces';

interface IUserStore {
    user: IUser | null;
    setUser: (user: IUser | null) => void;
    resetUser: () => void;
}

const useUserStore = create<IUserStore>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    resetUser: () => set({ user: null })
}));

const useUser = () => {
    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser);
    const resetUser = useUserStore((state) => state.resetUser);

    return { user, setUser, resetUser };
};

export { useUser };