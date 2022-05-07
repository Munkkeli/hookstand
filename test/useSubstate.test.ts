import { renderHook, act } from '@testing-library/react-hooks';
import { isDraft } from 'immer';
import { useSubstate } from '../src/hooks/useSubstate';
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
  deep2: {
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
  const {
    result: {
      current: { store },
    },
  } = renderHook(() => useStore(testState));

  test('returns the state object', () => {
    const {
      result: { current: state },
    } = renderHook(() => useSubstate(store));

    expect(state).toStrictEqual(testState);
  });

  test('does not return an immer draft', () => {
    const {
      result: { current: state },
    } = renderHook(() => useSubstate(store));

    expect(isDraft(state)).toBe(false);
  });

  test('returns a scoped section', () => {
    const {
      result: { current: state },
    } = renderHook(() => useSubstate(store, ['one', 'two']));

    expect(state).toStrictEqual({ one: testState.one, two: testState.two });
  });

  test('returns a deeply scoped section', () => {
    const {
      result: { current: state },
    } = renderHook(() =>
      useSubstate(store, ['one', 'deep.deeper.one', 'deep2'])
    );

    expect(state).toStrictEqual({
      one: testState.one,
      deep: { deeper: { one: testState.deep.deeper.one } },
      deep2: testState.deep2,
    });
  });

  test('returns a single value', () => {
    const {
      result: { current: state },
    } = renderHook(() => useSubstate(store, 'one'));

    expect(state).toBe(testState.one);
  });

  // TODO: How to test component update triggers???
});
