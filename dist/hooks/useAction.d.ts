import { DependencyList } from 'react';
import { UseBoundStore } from 'zustand';
import { Draft } from 'immer';
export declare type SetFunction<Store extends UseBoundStore<any>> = (value: Partial<ReturnType<Store['getState']>>) => void;
export declare const useAction: <Store extends UseBoundStore<any, import("zustand").StoreApi<any>>, Action extends (...args: any) => void | Promise<void>>(store: Store, action: (state: Draft<ReturnType<Store["getState"]>>, set: SetFunction<Store>) => Action, deps?: DependencyList) => (...args: Parameters<Action>) => Promise<void>;
