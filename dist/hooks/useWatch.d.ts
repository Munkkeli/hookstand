import { DependencyList } from 'react';
import type { UseBoundStore } from 'zustand';
import type { Paths } from '../lib/Paths';
import { UseSubstateResult } from './useSubstate';
export declare type UseWatchHook = <Store extends UseBoundStore<any>, Path extends Paths<ReturnType<Store['getState']>>>(store: Store, path: Path, callback: (state: UseSubstateResult<Store, Path>) => void | (() => void), deps?: DependencyList) => void;
export declare const useWatch: UseWatchHook;
