import { useCallback } from 'react';
import shallow from 'zustand/shallow';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import { compareByGet, getPartial } from '../utils';
export var useSubstate = function (store, deps) {
    return store(useCallback(function (state) {
        // If deps are set to "null", return everything
        if (deps === undefined || deps === null)
            return state;
        // If deps is a single path, return that specific value
        if (typeof deps === 'string')
            return get(state, deps);
        // If deps are set to an empty array, also return everything
        if (!deps.length)
            return state;
        // If scope is used, only return the scoped items
        return getPartial(state, deps);
    }, [deps]), function (a, b) {
        // If deps are set to "null", always update
        if (deps === undefined || deps === null)
            return false;
        // If deps is a single path, compare that specific value
        if (typeof deps === 'string')
            return isEqual(a, b);
        // If deps are set to an empty array, never update
        if (!deps.length)
            return true;
        // If scope is used, only update when items on the scope have changed
        return shallow.apply(void 0, compareByGet(a, b, deps));
    });
};
