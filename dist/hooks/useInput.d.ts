import { ChangeEvent, FormEvent } from 'react';
import type { UseBoundStore } from 'zustand';
import type { Paths } from '../lib/Paths';
import type { GetFieldType } from '../lib/DeepPick';
export declare type UseInputHook = <Store extends UseBoundStore<any>, Path extends Paths<ReturnType<Store['getState']>>>(store: Store, path: Path) => {
    value: GetFieldType<ReturnType<Store['getState']>, Path>;
    onChange: (event: FormEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement> | GetFieldType<ReturnType<Store['getState']>, Path>) => void;
};
export declare const useInput: UseInputHook;
export declare type UseNativeInputHook = <Store extends UseBoundStore<any>, Path extends Paths<ReturnType<Store['getState']>>>(store: Store, path: Path) => {
    value: GetFieldType<ReturnType<Store['getState']>, Path>;
    onChangeText: (event: FormEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement> | GetFieldType<ReturnType<Store['getState']>, Path>) => void;
};
export declare const useNativeInput: UseNativeInputHook;
