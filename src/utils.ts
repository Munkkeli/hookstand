import isEqual from 'lodash/isEqual';
import get from 'lodash/get';
import set from 'lodash/set';

export const deepDiff = (a: any, b: any, path: string[] = []) => {
  const bKeys = Object.keys(b);

  let changed: string[] = [];
  for (const key of Object.keys({ ...a, ...b })) {
    const keyPath = [...path, key];

    if (!bKeys.includes(key)) {
      changed.push(keyPath.join('.'));
      continue;
    }

    if (typeof a[key] === 'object' || typeof a[key] === 'object') {
      if (typeof a[key] === 'object' && typeof a[key] === 'object') {
        changed.push(...deepDiff(a[key], b[key], keyPath));
        continue;
      }

      changed.push(keyPath.join('.'));
      continue;
    }

    if (!isEqual(a[key], b[key])) {
      changed.push(keyPath.join('.'));
      continue;
    }
  }

  return changed;
};

export const pickByGet = (obj: any, paths: readonly string[]): any =>
  paths.map((path) => get(obj, path));

export const getPartial = (obj: any, paths: readonly string[]): any =>
  paths.reduce((result, path) => set(result, path, get(obj, path)), {});

export const compareByGet = (
  a: any,
  b: any,
  deps: readonly string[]
): [any, any] => {
  const next = pickByGet(a, deps);
  const prev = pickByGet(b, deps);

  return [next, prev];
};
