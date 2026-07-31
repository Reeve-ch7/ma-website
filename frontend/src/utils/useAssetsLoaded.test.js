import { renderHook, waitFor, act } from '@testing-library/react';
import useAssetsLoaded from './useAssetsLoaded';

class MockImage {
  set src(_value) {
    if (MockImage.hang) return; // simulate an asset that never fires load/error
    Promise.resolve().then(() => this.onload && this.onload());
  }
}

describe('useAssetsLoaded', () => {
  const OriginalImage = global.Image;

  afterEach(() => {
    global.Image = OriginalImage;
    MockImage.hang = false;
    jest.useRealTimers();
  });

  test('resolves once every asset fires load/error', async () => {
    global.Image = MockImage;
    const { result } = renderHook(() => useAssetsLoaded(['/a.jpg', '/b.jpg']));

    expect(result.current).toBe(false);
    await waitFor(() => expect(result.current).toBe(true));
  });

  test('resolves via the safety timeout even if an asset never loads or errors', async () => {
    jest.useFakeTimers();
    MockImage.hang = true;
    global.Image = MockImage;

    const { result } = renderHook(() => useAssetsLoaded(['/stuck.jpg']));
    expect(result.current).toBe(false);

    // Just under the timeout: still stuck, as a real hung asset would be.
    await act(async () => {
      jest.advanceTimersByTime(5999);
      await Promise.resolve();
    });
    expect(result.current).toBe(false);

    // Crossing the timeout unblocks the page regardless.
    await act(async () => {
      jest.advanceTimersByTime(1);
      await Promise.resolve();
    });
    expect(result.current).toBe(true);
  });
});
