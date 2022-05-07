import { DependencyList, useCallback } from 'react';
import type { UseBoundStore } from 'zustand';
import {
  Draft,
  createDraft,
  finishDraft,
  current,
  enablePatches,
  applyPatches,
  isDraft,
} from 'immer';
import get from 'lodash/get';
import set from 'lodash/set';
import { deepDiff } from '../utils';

/**
 * @see https://immerjs.github.io/immer/patches/
 */
enablePatches();

export type SetFunction<Store extends UseBoundStore<any>> = (
  value: Partial<ReturnType<Store['getState']>>
) => void;

const createSetFunction = <Store extends UseBoundStore<any>>(store: Store) => {
  type State = Partial<ReturnType<Store['getState']>>;

  /**
   * Allows updating store state immediately.
   * Can be passed the entire state object to update everything that has changed.
   * NOTE: Will NOT update the current action state.
   */
  return (value: State | Draft<State>) => {
    // Take a snapshot of a draft state (if the irgument is a draft)
    const currentDraftState = isDraft(value) ? current(value) : value;
    const currentState = store.getState();

    // Compare state objects deeply to get all changed paths
    const changedPaths = deepDiff(currentState, currentDraftState);

    // Set values of the changed paths to current store state
    for (const path of changedPaths) {
      set(currentState, path, get(currentDraftState, path));
    }

    store.setState({ ...currentState });
  };
};

export const useAction = <
  Store extends UseBoundStore<any>,
  Action extends (...args: any) => void | Promise<void>
>(
  store: Store,
  action: (
    state: Draft<ReturnType<Store['getState']>>,
    set: SetFunction<Store>
  ) => Action,
  deps: DependencyList = []
) =>
  useCallback(async (...args: Parameters<Action>) => {
    // Create an Immer draft proxy from the current state
    const stateDraft = createDraft<ReturnType<Store['getState']>>({
      ...store.getState(),
      error: null,
    });

    // Call the "action" function with the state draft & provided arguments
    const actionResult = action(stateDraft, createSetFunction(store))(...args);

    // If the "action" result is a Promise, we want to apply some extra sugar on top
    if (actionResult instanceof Promise) {
      store.setState({ isLoading: true, error: null });

      // We set isLoading & isError on the draft too to retain parity
      // stateDraft.isLoading = true;
      // stateDraft.error = null;

      try {
        // Wait for the action Promise to complete, the changes will be applied to the Immer draft
        await actionResult;

        finishDraft(stateDraft, (patches) => {
          // We use patches here to allow for changes to state during this async action to persist & not be overwritten
          const stateResult = applyPatches(store.getState(), patches);

          // Apply all changes from the draft patches to the actual state
          store.setState(stateResult);
        });
      } catch (error) {
        console.error('Action failed', error);
        store.setState({ error: 'unexpected error' });
      } finally {
        store.setState({ isLoading: false });
      }
    } else {
      // No need to wait for anything, apply changes from draft right away
      store.setState(finishDraft(stateDraft));
    }
  }, deps);
