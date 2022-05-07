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
import { useCallback } from 'react';
import set from 'lodash/set';
import { useSubstate } from './useSubstate';
export var useInput = function (store, path) {
    var value = useSubstate(store, path);
    var onChange = useCallback(function (event) {
        var _a;
        var value;
        if (typeof event === 'number') {
            value = event;
        }
        else if (typeof event === 'string') {
            value = event;
        }
        else if (event instanceof Date) {
            value = event;
        }
        else if (typeof event === 'object' && event.target) {
            // TODO: How to properly detect an input change event?
            value =
                ((_a = event.target) === null || _a === void 0 ? void 0 : _a.value) ||
                    '';
        }
        else {
            value = "".concat(event);
        }
        var state = store.getState();
        set(state, path, value);
        store.setState(__assign({}, state));
    }, [path]);
    // TODO: Prehaps automatic throttle & onBlur optimization here could be good?
    return { value: value, onChange: onChange };
};
export var useNativeInput = function (store, path) {
    var _a = useInput(store, path), value = _a.value, onChange = _a.onChange;
    return { value: value, onChangeText: onChange };
};
