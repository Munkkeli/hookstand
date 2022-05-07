/**
 * @see https://dev.to/tipsy_dev/advanced-typescript-reinventing-lodash-get-4fhe
 */
import { String, Object, Union } from 'ts-toolbelt';
declare type GetIndexedField<T, K> = K extends keyof T ? T[K] : K extends `${number}` ? '0' extends keyof T ? undefined : number extends keyof T ? T[number] : undefined : undefined;
declare type FieldWithPossiblyUndefined<T, Key> = GetFieldType<Exclude<T, undefined>, Key> | Extract<T, undefined>;
declare type IndexedFieldWithPossiblyUndefined<T, Key> = GetIndexedField<Exclude<T, undefined>, Key> | Extract<T, undefined>;
export declare type GetFieldType<T, P> = P extends `${infer Left}.${infer Right}` ? Left extends keyof T ? FieldWithPossiblyUndefined<T[Left], Right> : Left extends `${infer FieldKey}[${infer IndexKey}]` ? FieldKey extends keyof T ? FieldWithPossiblyUndefined<IndexedFieldWithPossiblyUndefined<T[FieldKey], IndexKey>, Right> : undefined : undefined : P extends keyof T ? T[P] : P extends `${infer FieldKey}[${infer IndexKey}]` ? FieldKey extends keyof T ? IndexedFieldWithPossiblyUndefined<T[FieldKey], IndexKey> : undefined : undefined;
declare type DeepPickMap<T extends object, D extends readonly string[]> = {
    [P in D[number]]: Object.P.Pick<T, String.Split<P, '.'>>;
};
export declare type DeepPick<T extends object, D extends readonly string[]> = Union.Merge<DeepPickMap<T, D>[keyof DeepPickMap<T, D>]>;
export {};
