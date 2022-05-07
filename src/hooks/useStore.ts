import { useState } from 'react';
import create, { State as ZustandState } from 'zustand';

const builtInStoreState = {
  error: null as string | null,
  isLoading: false as boolean,
};

/** Create a global store that can be used anywhere */
export const createStore = <T extends ZustandState>(initialData: T) =>
  create(() => ({
    ...builtInStoreState,
    ...initialData,
  }));

export const useStore = <T extends ZustandState>(initialData: T) => {
  const [store] = useState(() =>
    create(() => ({
      ...builtInStoreState,
      ...initialData,
    }))
  );

  return { store };
};
