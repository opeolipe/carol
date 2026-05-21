import { useState, useEffect } from 'react';

export type StillnessStatus = 'ACTIVE' | 'STILL';

let globalStillnessState: StillnessStatus = 'ACTIVE';
const listeners = new Set<(status: StillnessStatus) => void>();

export const getStillnessState = () => {
  if (typeof window !== 'undefined') {
    return (window as any).__archiveStillnessState || globalStillnessState;
  }
  return globalStillnessState;
};

export const setStillnessState = (status: StillnessStatus) => {
  globalStillnessState = status;
  if (typeof window !== 'undefined') {
    (window as any).__archiveStillnessState = status;
    window.dispatchEvent(new CustomEvent('archive-stillness', { detail: status }));
  }
  listeners.forEach(cb => cb(status));
};

export const subscribeToStillness = (cb: (status: StillnessStatus) => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};

export function useArchiveStillness() {
  const [status, setStatus] = useState<StillnessStatus>('ACTIVE');

  useEffect(() => {
    // Sync initial state
    const current = getStillnessState();
    setStatus(current);

    // Subscribe to updates
    const unsubscribe = subscribeToStillness((newStatus) => {
      setStatus(newStatus);
    });

    // Also handle window custom events in case of separate bundles
    const handleEvent = (e: Event) => {
      const detail = (e as CustomEvent).detail as StillnessStatus;
      setStatus(detail);
    };

    window.addEventListener('archive-stillness', handleEvent);
    return () => {
      unsubscribe();
      window.removeEventListener('archive-stillness', handleEvent);
    };
  }, []);

  return status === 'STILL';
}
