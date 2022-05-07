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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';
import set from 'lodash/set';
export var deepDiff = function (a, b, path) {
    if (path === void 0) { path = []; }
    var bKeys = Object.keys(b);
    var changed = [];
    for (var _i = 0, _a = Object.keys(__assign(__assign({}, a), b)); _i < _a.length; _i++) {
        var key = _a[_i];
        var keyPath = __spreadArray(__spreadArray([], path, true), [key], false);
        if (!bKeys.includes(key)) {
            changed.push(keyPath.join('.'));
            continue;
        }
        if (typeof a[key] === 'object' || typeof a[key] === 'object') {
            if (typeof a[key] === 'object' && typeof a[key] === 'object') {
                changed.push.apply(changed, deepDiff(a[key], b[key], keyPath));
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
export var pickByGet = function (obj, paths) {
    return paths.map(function (path) { return get(obj, path); });
};
export var getPartial = function (obj, paths) {
    return paths.reduce(function (result, path) { return set(result, path, get(obj, path)); }, {});
};
export var compareByGet = function (a, b, deps) {
    var next = pickByGet(a, deps);
    var prev = pickByGet(b, deps);
    return [next, prev];
};
