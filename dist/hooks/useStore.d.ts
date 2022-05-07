/** Create a global store that can be used anywhere */
export declare const createStore: <T extends object>(initialData: T) => import("zustand").UseBoundStore<{
    error: string | null;
    isLoading: boolean;
} & T, import("zustand").StoreApi<{
    error: string | null;
    isLoading: boolean;
} & T>>;
export declare const useStore: <T extends object>(initialData: T) => {
    store: import("zustand").UseBoundStore<{
        error: string | null;
        isLoading: boolean;
    } & T, import("zustand").StoreApi<{
        error: string | null;
        isLoading: boolean;
    } & T>>;
};
