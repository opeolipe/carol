import { useState, useEffect } from 'react';

export interface DriftConfig {
  visits: number;
  timeDrift: number;      // Fluctuating value between -1 and 1
  telemetryDrift: string;  // Drifting metadata string
  systemJitter: number;    // Small variable variance
}

// Low-frequency oscillator helper based on time
function getTemporalCycles() {
  if (typeof window === 'undefined') {
    return { timeDrift: 0, telemetryDrift: '0.0000', systemJitter: 0 };
  }
  
  const now = new Date();
  const minutes = now.getMinutes() + now.getSeconds() / 60;
  const hours = now.getHours() + minutes / 60;
  
  // Sine cycles with different, out-of-phase periods to create organic-looking shift
  const drift1 = Math.sin((hours * Math.PI) / 6);       // 12-hour period
  const drift2 = Math.cos((minutes * Math.PI) / 15);    // 30-minute period
  
  const combined = (drift1 * 0.7 + drift2 * 0.3);
  const jitter = Math.sin(now.getSeconds() * 0.1) * 0.05;
  
  // Calculate a fractional coordinate drift modifier (e.g., +.034)
  const baseCoordDrift = Math.abs(combined * 0.45).toFixed(4);
  
  return {
    timeDrift: combined,
    telemetryDrift: `▲0.${baseCoordDrift}`,
    systemJitter: jitter
  };
}

export function useSignalDrift() {
  const [config, setConfig] = useState<DriftConfig>({
    visits: 1,
    timeDrift: 0,
    telemetryDrift: '▲0.0000',
    systemJitter: 0
  });

  useEffect(() => {
    // 1. Visit tracking persistence
    const storedVisitsStr = localStorage.getItem('archive_visits_v1');
    let currentVisits = 1;
    if (storedVisitsStr) {
      currentVisits = parseInt(storedVisitsStr, 10);
    } else {
      localStorage.setItem('archive_visits_v1', '1');
    }
    
    // Smooth state updater loop representing slow drift
    const updateDrift = () => {
      const cycles = getTemporalCycles();
      setConfig({
        visits: currentVisits,
        timeDrift: cycles.timeDrift,
        telemetryDrift: cycles.telemetryDrift,
        systemJitter: cycles.systemJitter
      });
    };

    updateDrift();
    const interval = setInterval(updateDrift, 3000); // Quiet periodic update
    
    return () => clearInterval(interval);
  }, []);

  return config;
}

/**
 * Increment visit count. This should be run once at index layout.
 */
export function recordVisit() {
  if (typeof window !== 'undefined') {
    const key = 'archive_visits_v1';
    const stored = localStorage.getItem(key);
    const count = stored ? parseInt(stored, 10) + 1 : 1;
    localStorage.setItem(key, count.toString());
    
    // Dispatch custom event to notify other mounted components if necessary
    window.dispatchEvent(new CustomEvent('archive-visit-increment', { detail: count }));
  }
}

/**
 * Deterministically drift coordinates or alphanumeric IDs based on overall visits & time.
 * e.g., TRC-7429 -> TRC-7429.043
 */
export function driftCoordinate(baseCoords: string | undefined, visits: number, timeDrift: number, isVisited = false): string {
  if (!baseCoords) return 'SYS_REF_ALPHA';
  
  if (isVisited) {
    // If the path is stilled/visited, coordinate drift locks entirely to provide a secure anchor
    return `${baseCoords} [STABLE]`;
  }
  
  // Incorporate Environmental drift speed factor
  const envFactor = typeof window !== 'undefined' && (window as any).__archiveEnvironmentalState
    ? (window as any).__archiveEnvironmentalState.driftSpeedFactor
    : 1.0;
  
  // Check if coordinates look like location pairs, e.g., "51.5°N, 0.12°W"
  const isDegrees = baseCoords.includes('°');
  
  if (isDegrees) {
    // Subtly alter latitude/longitude decimals
    const parts = baseCoords.split(',');
    const driftedParts = parts.map((part, idx) => {
      // Find numbers
      const numMatch = part.match(/[-+]?[0-9]*\.?[0-9]+/);
      if (numMatch) {
        const val = parseFloat(numMatch[0]);
        // Shift latitude by visits and timeDrift, modulated by environmental phase factors
        const shift = ((idx === 0 ? 0.0015 : -0.0022) * visits + (timeDrift * 0.004)) * envFactor;
        const driftedVal = (val + shift).toFixed(4);
        return part.replace(numMatch[0], driftedVal);
      }
      return part;
    });
    return driftedParts.join(',');
  }
  
  // For alphanumeric IDs like "TRC-7429" or "SYS-TRC-012"
  const driftVal = Math.abs((visits * 0.004 + timeDrift * 0.08) * envFactor).toFixed(4);
  return `${baseCoords}.${driftVal.split('.')[1] || '0000'}`;
}

/**
 * Deterministically rearrange order or swap items depending on visits & cycle phases
 */
export function driftRearrange<T>(items: T[], visits: number): T[] {
  if (items.length <= 1) return items;
  
  // Every successive visit can trigger subtle placement rotation
  const copy = [...items];
  const swapCount = (visits - 1) % copy.length;
  
  for (let i = 0; i < swapCount; i++) {
    // Perform a small adjacent swap representation of tectonic micro-shift
    const index1 = (i * 3) % (copy.length - 1);
    const temp = copy[index1];
    copy[index1] = copy[index1 + 1];
    copy[index1 + 1] = temp;
  }
  
  return copy;
}

/**
 * Deterministically swap emphasis or state labels of notes or signals
 */
export function driftStateEmphasis(
  originalState: 'ACTIVE' | 'ARCHIVED' | 'UNRESOLVED' | 'RECENT' | 'DRIFTING' | 'DECAYING',
  visits: number,
  timeDrift: number
): 'ACTIVE' | 'ARCHIVED' | 'UNRESOLVED' | 'RECENT' | 'DRIFTING' | 'DECAYING' {
  // Over future visits, older elements begin to drift or decay
  if (visits > 2 && originalState === 'ACTIVE') {
    return (visits % 2 === 0) ? 'DRIFTING' : 'ACTIVE';
  }
  if (visits > 4 && originalState === 'UNRESOLVED') {
    return 'DECAYING';
  }
  
  // Periodic shifts
  if (Math.abs(timeDrift) > 0.7 && originalState === 'RECENT') {
    return 'DRIFTING';
  }
  
  return originalState;
}

/**
 * Check if the user has successfully analyzed and correlated the hidden system anomaly.
 */
export function useSideQuestState() {
  const [solved, setSolved] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkState = () => {
      const isSolved = localStorage.getItem('archive_salvaged_anomaly_v1') === 'true';
      setSolved(isSolved);
    };

    checkState();

    // Event listener for live, multi-component synchronization
    window.addEventListener('archive-anomaly-salvaged', checkState);
    return () => {
      window.removeEventListener('archive-anomaly-salvaged', checkState);
    };
  }, []);

  const setSolvedState = (val: boolean) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('archive_salvaged_anomaly_v1', val ? 'true' : 'false');
      window.dispatchEvent(new CustomEvent('archive-anomaly-salvaged'));
    }
  };

  return { solved, setSolvedState };
}

/**
 * Unified Exploration Memory Hook to provide deep emotional continuity across pages/visits.
 */
export function useExplorationMemory() {
  const [readDossiers, setReadDossiers] = useState<string[]>([]);
  const [atlasNodes, setAtlasNodes] = useState<string[]>([]);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadHistory = () => {
      const dossiersStored = localStorage.getItem('archive_memory_v1');
      const atlasStored = localStorage.getItem('atlas_explore_history_v1');
      
      setReadDossiers(dossiersStored ? JSON.parse(dossiersStored) : []);
      setAtlasNodes(atlasStored ? JSON.parse(atlasStored) : []);
    };

    loadHistory();

    // Listeners for updates from other pages
    window.addEventListener('archive_memory_updated', loadHistory);
    window.addEventListener('atlas_history_updated', loadHistory);
    
    // Also listen to storage events (for multi-tab sync)
    window.addEventListener('storage', loadHistory);

    return () => {
      window.removeEventListener('archive_memory_updated', loadHistory);
      window.removeEventListener('atlas_history_updated', loadHistory);
      window.removeEventListener('storage', loadHistory);
    };
  }, []);

  const markDossierRead = (slug: string) => {
    if (typeof window === 'undefined') return;
    const dossiersStored = localStorage.getItem('archive_memory_v1');
    const list: string[] = dossiersStored ? JSON.parse(dossiersStored) : [];
    if (!list.includes(slug)) {
      const updated = [...list, slug];
      localStorage.setItem('archive_memory_v1', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('archive_memory_updated'));
    }
  };

  const markAtlasNodeVisited = (nodeId: string) => {
    if (typeof window === 'undefined') return;
    const atlasStored = localStorage.getItem('atlas_explore_history_v1');
    const list: string[] = atlasStored ? JSON.parse(atlasStored) : [];
    if (!list.includes(nodeId)) {
      const updated = [...list, nodeId];
      localStorage.setItem('atlas_explore_history_v1', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('atlas_history_updated'));
    }
  };

  const totalVisitedCount = readDossiers.length + atlasNodes.length;

  return {
    readDossiers,
    atlasNodes,
    markDossierRead,
    markAtlasNodeVisited,
    totalVisitedCount
  };
}

