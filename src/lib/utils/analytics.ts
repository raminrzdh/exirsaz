'use client';

// Lightweight Background Event Batching Utility
// Protects the main thread by deferring analytics flushes to idle times.

interface AnalyticsEvent {
  eventName: string;
  payload?: Record<string, any>;
  timestamp: number;
}

declare global {
  interface Window {
    _eventQueue: AnalyticsEvent[];
    _analyticsIdleHandle?: number;
  }
}

// Fallback for browsers that don't support requestIdleCallback
const requestIdle = (
  typeof window !== 'undefined' && window.requestIdleCallback
) ? window.requestIdleCallback : (cb: Function) => setTimeout(cb, 1000);

export function trackEvent(eventName: string, payload?: Record<string, any>) {
  if (typeof window === 'undefined') return;

  if (!window._eventQueue) {
    window._eventQueue = [];
  }

  window._eventQueue.push({
    eventName,
    payload,
    timestamp: Date.now(),
  });

  if (!window._analyticsIdleHandle) {
    window._analyticsIdleHandle = requestIdle(flushQueue);
  }
}

function flushQueue() {
  if (typeof window === 'undefined' || !window._eventQueue || window._eventQueue.length === 0) {
    window._analyticsIdleHandle = undefined;
    return;
  }

  const batch = [...window._eventQueue];
  window._eventQueue = [];
  window._analyticsIdleHandle = undefined;

  // In a real scenario, this would POST to /api/analytics or push to dataLayer
  // fetch('/api/analytics', { method: 'POST', body: JSON.stringify(batch), keepalive: true }).catch(()=>{});
  
  // For now, simulating GTM DataLayer push
  console.log('[Analytics Batch Flush]', batch);
  
  if ((window as any).dataLayer) {
    batch.forEach(event => {
      (window as any).dataLayer.push({
        event: event.eventName,
        ...event.payload
      });
    });
  }
}
