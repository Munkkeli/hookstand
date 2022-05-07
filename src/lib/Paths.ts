type Prev = [
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

type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}${'' extends P ? '' : '.'}${P}`
    : never
  : never;

export type Paths<T, D extends number = 5> = [D] extends [never]
  ? never
  : // Do not list paths for a Date
  T extends Date
  ? never
  : // Do not list paths for a HTMLElement
  T extends HTMLElement
  ? never
  : T extends object
  ? {
      [K in keyof T]-?: K extends 'prototype'
        ? // Do not list the prototype of a class
          never
        : K extends string | number
        ? `${K}` | Join<K, Paths<T[K], Prev[D]>>
        : never;
    }[keyof T]
  : '';
