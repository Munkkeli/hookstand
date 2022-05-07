import { isDraft, current } from 'immer';
import { renderHook } from '@testing-library/react-hooks';
import { useAction } from '../src/hooks/useAction';
import { createStore } from '../src/hooks/useStore';

const wait = (time: number = 1) =>
  new Promise((resolve) => setTimeout(resolve, time));

const testState = {
  one: 1,
  two: '2',
  deep: {
    one: 1,
    deeper: {
      one: 1,
      two: '2',
    },
  },
  isLoading: false,
  error: null,
};

describe('useStore hook', () => {
  test('creates a function', () => {
    const store = createStore(testState);

    const {
      result: { current: actionFunction },
    } = renderHook(() => useAction(store, (state) => () => {}));

    expect(typeof actionFunction).toBe('function');
  });

  test('allows for arguments', () => {
    const store = createStore(testState);

    let currentArguments = null;

    const {
      result: { current: actionFunction },
    } = renderHook(() =>
      useAction(store, (state) => (one: number, two: string) => {
        currentArguments = { one, two };
      })
    );

    actionFunction(1, '2');

    expect(currentArguments).toStrictEqual({ one: 1, two: '2' });
  });

  test('correctly uses immer draft', () => {
    const store = createStore(testState);

    let draftState = false;

    const {
      result: { current: actionFunction },
    } = renderHook(() =>
      useAction(store, (state) => () => {
        draftState = isDraft(state);
      })
    );

    actionFunction();

    expect(draftState).toBe(true);
  });

  test('correctly passes state', () => {
    const store = createStore(testState);

    let currentState = null;

    const {
      result: { current: actionFunction },
    } = renderHook(() =>
      useAction(store, (state) => () => {
        currentState = current(state);
      })
    );

    actionFunction();

    expect(currentState).toStrictEqual(testState);
  });

  test('will set isLoading to true if async', async () => {
    const store = createStore(testState);

    let currentState: any = null;

    const {
      result: { current: actionFunction },
    } = renderHook(() =>
      useAction(store, (state) => async () => {
        await wait();
        currentState = store.getState();
      })
    );

    await actionFunction();

    expect(currentState?.isLoading).toBe(true);
  });

  test('will set isLoading to false if async & awaited', async () => {
    const store = createStore(testState);

    const {
      result: { current: actionFunction },
    } = renderHook(() => useAction(store, () => async () => {}));

    await actionFunction();

    expect(store.getState().isLoading).toBe(false);
  });

  test('will print an error if async & throws', async () => {
    const store = createStore(testState);

    global.console = { error: jest.fn() } as any;

    const {
      result: { current: actionFunction },
    } = renderHook(() =>
      useAction(store, () => async () => {
        throw new Error('Oops');
      })
    );

    await actionFunction();

    expect(console.error).toBeCalled();
  });

  test('will set error to "unexpected error" if async & throws', async () => {
    const store = createStore(testState);

    global.console = { error: () => {} } as any;

    const {
      result: { current: actionFunction },
    } = renderHook(() =>
      useAction(store, () => async () => {
        throw new Error('Oops');
      })
    );

    await actionFunction();

    expect(store.getState().error).toBe('unexpected error');
  });

  test('will set error to null if async & called again', async () => {
    const store = createStore(testState);

    let currentState: any = null;

    global.console = { error: () => {} } as any;

    const {
      result: { current: actionFunction },
    } = renderHook(() =>
      useAction(store, (state) => async (fail: boolean) => {
        if (fail) throw new Error('Oops');
        await wait();
        currentState = current(state);
      })
    );

    await actionFunction(true);
    await actionFunction(false);

    expect(currentState?.error).toBe(null);
  });
});
