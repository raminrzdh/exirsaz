'use client';

import { useEffect, useState, useRef } from 'react';
import { trackEvent } from '@/lib/utils/analytics';

interface UseExitIntentOptions {
  enabled?: boolean;
  mobileIdleTimeoutMs?: number;
}

export function useExitIntent({ enabled = true, mobileIdleTimeoutMs = 30000 }: UseExitIntentOptions = {}) {
  const [hasTriggered, setHasTriggered] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled || hasTriggered) return;

    // Desktop Exit Intent: Mouse leaves the top of the viewport
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 10) {
        triggerExitIntent('desktop_mouse_leave');
      }
    };

    // Mobile Exit Intent: Rapid scroll up
    let lastScrollY = window.scrollY;
    let lastScrollTime = Date.now();
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const currentTime = Date.now();
      const timeDiff = currentTime - lastScrollTime;
      
      // If scrolling up fast
      if (currentScrollY < lastScrollY && timeDiff < 100) {
        const speed = (lastScrollY - currentScrollY) / timeDiff;
        if (speed > 5) { // Rapid scroll threshold
          triggerExitIntent('mobile_rapid_scroll_up');
        }
      }
      
      lastScrollY = currentScrollY;
      lastScrollTime = currentTime;
      resetIdleTimer();
    };

    // Mobile Exit Intent: Idle timeout
    const triggerExitIntent = (reason: string) => {
      if (!hasTriggered) {
        setHasTriggered(true);
        setShouldShow(true);
        trackEvent('exit_intent_triggered', { reason });
      }
    };

    const handleIdle = () => {
      triggerExitIntent('mobile_idle_timeout');
    };

    const resetIdleTimer = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(handleIdle, mobileIdleTimeoutMs);
    };

    const handleTouchStart = () => resetIdleTimer();

    // Attach listeners
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    
    // Initial timer start
    resetIdleTimer();

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', handleTouchStart);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [enabled, hasTriggered, mobileIdleTimeoutMs]);

  const dismiss = () => {
    setShouldShow(false);
    trackEvent('exit_intent_dismissed');
  };

  return { shouldShow, dismiss };
}
