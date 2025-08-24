import { useEffect } from 'react';

export function useBodyScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const originalStyle = window.getComputedStyle(document.body).overflow;
    
    if (isLocked) {
      // Prevent scrolling on mount
      document.body.style.overflow = 'hidden';
      // Prevent scrolling on mobile
      document.body.style.position = 'fixed';
      document.body.style.top = `-${window.scrollY}px`;
      document.body.style.width = '100%';
    } else {
      // Re-enable scrolling when component unmounts
      document.body.style.overflow = originalStyle;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      
      // Restore scroll position
      const scrollY = document.body.style.top;
      if (scrollY) {
        const y = parseInt(scrollY || '0') * -1;
        window.scrollTo(0, y);
      }
    }

    return () => {
      // Cleanup on unmount
      document.body.style.overflow = originalStyle;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isLocked]);
}
