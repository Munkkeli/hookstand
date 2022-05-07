import { renderHook } from '@testing-library/react-hooks';
import { useInput } from '../src/hooks/useInput';
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
  isError: false,
  isLoading: false,
};

describe('useInput hook', () => {
  const {
    result: {
      current: { store },
    },
  } = renderHook(() => useStore(testState));

  test('returns a value & onChange callback', () => {
    const {
      result: { current: input },
    } = renderHook(() => useInput(store, 'two'));

    expect(input.value).toBe(testState.two);
    expect(typeof input.onChange).toBe('function');
  });
});
