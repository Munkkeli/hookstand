import { ChangeEvent, FormEvent, useCallback } from 'react';
import type { UseBoundStore } from 'zustand';
import set from 'lodash/set';
import type { Paths } from '../lib/Paths';
import type { GetFieldType } from '../lib/DeepPick';
import { useSubstate } from './useSubstate';

export type UseInputHook = <
  Store extends UseBoundStore<any>,
  Path extends Paths<ReturnType<Store['getState']>>
>(
  store: Store,
  path: Path
) => {
  value: GetFieldType<ReturnType<Store['getState']>, Path>;
  onChange: (
    event:
      | FormEvent<HTMLInputElement>
      | ChangeEvent<HTMLInputElement>
      | GetFieldType<ReturnType<Store['getState']>, Path>
  ) => void;
};

export const useInput: UseInputHook = (store, path) => {
  const value = useSubstate(store, path) as any;

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement> | number | string | unknown) => {
      let value: number | string | Date | null;

      if (typeof event === 'number') {
        value = event;
      } else if (typeof event === 'string') {
        value = event;
      } else if (event instanceof Date) {
        value = event;
      } else if (typeof event === 'object' && (event as any).target) {
        // TODO: How to properly detect an input change event?
        value =
          (event as unknown as ChangeEvent<HTMLInputElement>).target?.value ||
          '';
      } else {
        value = `${event}`;
      }

      const state = store.getState();
      set(state, path, value);
      store.setState({ ...state });
    },
    [path]
  );

  // TODO: Prehaps automatic throttle & onBlur optimization here could be good?

  return { value, onChange };
};

export type UseNativeInputHook = <
  Store extends UseBoundStore<any>,
  Path extends Paths<ReturnType<Store['getState']>>
>(
  store: Store,
  path: Path
) => {
  value: GetFieldType<ReturnType<Store['getState']>, Path>;
  onChangeText: (
    event:
      | FormEvent<HTMLInputElement>
      | ChangeEvent<HTMLInputElement>
      | GetFieldType<ReturnType<Store['getState']>, Path>
  ) => void;
};

export const useNativeInput: UseNativeInputHook = (store, path) => {
  const { value, onChange } = useInput(store, path);
  return { value, onChangeText: onChange };
};
