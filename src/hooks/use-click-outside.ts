import { useEffect, RefObject } from 'react';

/**
 * Hook that handles click outside of the passed ref
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void,
  active: boolean = true
): void {
  useEffect(() => {
    if (!active) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }

      handler(event);
    };

    // Use a slight delay to ensure the click event doesn't trigger immediately
    // when the element is first rendered
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', listener);
      document.addEventListener('touchstart', listener);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, active]);
}
