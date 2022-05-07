import type { UseBoundStore } from 'zustand';
import type { Paths } from '../lib/Paths';
import type { DeepPick, GetFieldType } from '../lib/DeepPick';
export declare type UseSubstateResult<Store extends UseBoundStore<any>, Deps extends readonly string[] | string | undefined | null> = Deps extends undefined | null ? ReturnType<Store['getState']> : Deps extends readonly string[] ? DeepPick<ReturnType<Store['getState']>, Deps> : Deps extends string ? GetFieldType<ReturnType<Store['getState']>, Deps> : never;
declare type UseSubstateHook = <Store extends UseBoundStore<any>, Deps extends readonly Paths<ReturnType<Store['getState']>>[] | Paths<ReturnType<Store['getState']>> | null = null>(store: Store, deps?: Deps) => UseSubstateResult<Store, Deps>;
export declare const useSubstate: UseSubstateHook;
export {};
