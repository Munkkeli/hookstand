import { useCallback } from 'react';
import type { UseBoundStore } from 'zustand';
import shallow from 'zustand/shallow';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import type { Paths } from '../lib/Paths';
import type { DeepPick, GetFieldType } from '../lib/DeepPick';
import { compareByGet, getPartial } from '../utils';

export type UseSubstateResult<
  Store extends UseBoundStore<any>,
  Deps extends readonly string[] | string | undefined | null
> = Deps extends undefined | null
  ? ReturnType<Store['getState']>
  : Deps extends readonly string[]
  ? DeepPick<ReturnType<Store['getState']>, Deps>
  : Deps extends string
  ? GetFieldType<ReturnType<Store['getState']>, Deps>
  : never;

type UseSubstateHook = <
  Store extends UseBoundStore<any>,
  Deps extends
    | readonly Paths<ReturnType<Store['getState']>>[]
    | Paths<ReturnType<Store['getState']>>
    | null = null
>(
  store: Store,
  deps?: Deps
) => UseSubstateResult<Store, Deps>;

export const useSubstate: UseSubstateHook = (store, deps) => {
  type State = ReturnType<typeof store['getState']>;

  return store(
    useCallback(
      (state: State) => {
        // If deps are set to "null", return everything
        if (deps === undefined || deps === null) return state;

        // If deps is a single path, return that specific value
        if (typeof deps === 'string') return get(state, deps);

        // If deps are set to an empty array, also return everything
        if (!deps.length) return state;

        // If scope is used, only return the scoped items
        return getPartial(state, deps);
      },
      [deps]
    ),
    (a, b) => {
      // If deps are set to "null", always update
      if (deps === undefined || deps === null) return false;

      // If deps is a single path, compare that specific value
      if (typeof deps === 'string') return isEqual(a, b);

      // If deps are set to an empty array, never update
      if (!deps.length) return true;

      // If scope is used, only update when items on the scope have changed
      return shallow(...compareByGet(a, b, deps));
    }
  ) as UseSubstateResult<any, any>;
};
