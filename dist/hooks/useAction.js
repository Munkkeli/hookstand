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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { useCallback } from 'react';
import { createDraft, finishDraft, current, enablePatches, applyPatches, isDraft, } from 'immer';
import get from 'lodash/get';
import set from 'lodash/set';
import { deepDiff } from '../utils';
/**
 * @see https://immerjs.github.io/immer/patches/
 */
enablePatches();
var createSetFunction = function (store) {
    /**
     * Allows updating store state immediately.
     * Can be passed the entire state object to update everything that has changed.
     * NOTE: Will NOT update the current action state.
     */
    return function (value) {
        // Take a snapshot of a draft state (if the irgument is a draft)
        var currentDraftState = isDraft(value) ? current(value) : value;
        var currentState = store.getState();
        // Compare state objects deeply to get all changed paths
        var changedPaths = deepDiff(currentState, currentDraftState);
        // Set values of the changed paths to current store state
        for (var _i = 0, changedPaths_1 = changedPaths; _i < changedPaths_1.length; _i++) {
            var path = changedPaths_1[_i];
            set(currentState, path, get(currentDraftState, path));
        }
        store.setState(__assign({}, currentState));
    };
};
export var useAction = function (store, action, deps) {
    if (deps === void 0) { deps = []; }
    return useCallback(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return __awaiter(void 0, void 0, void 0, function () {
            var stateDraft, actionResult, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        stateDraft = createDraft(__assign(__assign({}, store.getState()), { error: null }));
                        actionResult = action(stateDraft, createSetFunction(store)).apply(void 0, args);
                        if (!(actionResult instanceof Promise)) return [3 /*break*/, 6];
                        store.setState({ isLoading: true, error: null });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        // Wait for the action Promise to complete, the changes will be applied to the Immer draft
                        return [4 /*yield*/, actionResult];
                    case 2:
                        // Wait for the action Promise to complete, the changes will be applied to the Immer draft
                        _a.sent();
                        finishDraft(stateDraft, function (patches) {
                            // We use patches here to allow for changes to state during this async action to persist & not be overwritten
                            var stateResult = applyPatches(store.getState(), patches);
                            // Apply all changes from the draft patches to the actual state
                            store.setState(stateResult);
                        });
                        return [3 /*break*/, 5];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Action failed', error_1);
                        store.setState({ error: 'unexpected error' });
                        return [3 /*break*/, 5];
                    case 4:
                        store.setState({ isLoading: false });
                        return [7 /*endfinally*/];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        // No need to wait for anything, apply changes from draft right away
                        store.setState(finishDraft(stateDraft));
                        _a.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    }, deps);
};
