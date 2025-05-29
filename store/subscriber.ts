import { create } from 'zustand';

import { ISubscriber } from '@/interfaces/subscriber';

interface ISubscriberStore {
    subscriber: ISubscriber | null;
    setSubscriber: (subscriber: ISubscriber | null) => void;
    resetSubscriber: () => void;
}

const useSubscriberStore = create<ISubscriberStore>((set) => ({
    subscriber: null,
    setSubscriber: (subscriber) => set({ subscriber }),
    resetSubscriber: () => set({ subscriber: null })
}));

const useSubscriber = () => {
    const subscriber = useSubscriberStore((state) => state.subscriber);
    const setSubscriber = useSubscriberStore((state) => state.setSubscriber);
    const resetSubscriber = useSubscriberStore((state) => state.resetSubscriber);

    return { subscriber, setSubscriber, resetSubscriber };
};

export { useSubscriber };