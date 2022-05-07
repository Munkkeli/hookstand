var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { useState } from 'react';
import create from 'zustand';
var builtInStoreState = {
    error: null,
    isLoading: false,
};
/** Create a global store that can be used anywhere */
export var createStore = function (initialData) {
    return create(function () { return (__assign(__assign({}, builtInStoreState), initialData)); });
};
export var useStore = function (initialData) {
    var store = useState(function () {
        return create(function () { return (__assign(__assign({}, builtInStoreState), initialData)); });
    })[0];
    return { store: store };
};
