import { renderHook, cleanup } from '@testing-library/react-hooks';
import usePrevious from './usePrevious';

beforeAll(cleanup);
afterEach(cleanup);

it('should return previous value', () => {
    let value = 'value_1';
    const { result, rerender } = renderHook(() => usePrevious(value));

    expect(result.current).toBeUndefined();

    value = 'value_2';
    rerender();

    expect(result.current).toBe('value_1');
});
