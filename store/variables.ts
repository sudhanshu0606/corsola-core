import { create } from 'zustand';

type Connectivity = "online" | "offline" | undefined;

interface IVariables {
    isOtpSent?: boolean;
    connectivity?: Connectivity
}

interface VariablesStore {
    variables: IVariables;
    setVariables: (variables: Partial<IVariables>) => void;
    resetVariables: () => void;
}

const initialState: IVariables = { connectivity: undefined };

const useVariablesStore = create<VariablesStore>((set) => ({
    variables: initialState,
    setVariables: (vars) =>
        set((state) => ({ variables: { ...state.variables, ...vars } })),
    resetVariables: () => set({ variables: initialState }),
}));

const useVariables = () => {
    const variables = useVariablesStore((state) => state.variables);
    const setVariables = useVariablesStore((state) => state.setVariables);
    const resetVariables = useVariablesStore((state) => state.resetVariables);

    return { variables, setVariables, resetVariables };
};

export { useVariablesStore, useVariables };
export type { IVariables };
