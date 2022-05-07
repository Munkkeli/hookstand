import type { UseBoundStore } from 'zustand';
declare type Prev = [
    never,
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    ...0[]
];
declare type Join<K, P> = K extends string | number ? P extends string | number ? `${K}${'' extends P ? '' : '.'}${P}` : never : never;
export declare type StatePaths<T, D extends number = 10> = [D] extends [never] ? never : T extends object ? {
    [K in keyof T]-?: K extends string | number ? `${K}` | Join<K, StatePaths<T[K], Prev[D]>> : never;
}[keyof T] : '';
export declare type StateToStore<Store extends UseBoundStore<any>> = ReturnType<Store['getState']>;
export declare type Store = UseBoundStore<any>;
export {};
