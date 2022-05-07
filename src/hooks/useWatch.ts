import { DependencyList, useCallback, useEffect } from 'react';
import type { UseBoundStore } from 'zustand';
import type { Paths } from '../lib/Paths';
import { UseSubstateResult, useSubstate } from './useSubstate';

export type UseWatchHook = <
  Store extends UseBoundStore<any>,
  Path extends Paths<ReturnType<Store['getState']>>
>(
  store: Store,
  path: Path,
  callback: (state: UseSubstateResult<Store, Path>) => void | (() => void),
  deps?: DependencyList
) => void;

export const useWatch: UseWatchHook = (store, path, callback, deps = []) => {
  const watchedState = useSubstate(store, path);

  const watchAction = useCallback(
    (state: UseSubstateResult<typeof store, typeof path>) => callback(state),
    deps
  );

  useEffect(() => watchAction(watchedState), [watchedState, watchAction]);
};
