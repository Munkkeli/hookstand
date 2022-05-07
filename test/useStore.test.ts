import { renderHook, act } from '@testing-library/react-hooks';
import { useStore } from '../src/hooks/useStore';

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
};

describe('useStore hook', () => {
  test('creates a store with given initial state', () => {
    const { result } = renderHook(() => useStore(testState));

    const { store } = result.current;

    expect(store.getState()).toStrictEqual({
      ...testState,
      isLoading: false,
      error: null,
    });
  });
});
