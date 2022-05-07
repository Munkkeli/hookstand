import { useCallback, useEffect } from 'react';
import { useSubstate } from './useSubstate';
export var useWatch = function (store, path, callback, deps) {
    if (deps === void 0) { deps = []; }
    var watchedState = useSubstate(store, path);
    var watchAction = useCallback(function (state) { return callback(state); }, deps);
    useEffect(function () { return watchAction(watchedState); }, [watchedState, watchAction]);
};
