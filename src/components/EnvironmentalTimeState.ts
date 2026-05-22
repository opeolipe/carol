import { useState, useEffect } from 'react';

export type TemporalPhase = 'DAWN' | 'MIDDAY' | 'DUSK' | 'NIGHT';

export interface EnvironmentalState {
  hour: number;
  phase: TemporalPhase;
  phaseLabel: string;
  driftSpeedFactor: number; // multiplier for drift speed, e.g. 0.5 for late-night
  contrastFactor: number;   // opacity modifier for grid and lines, e.g. 0.6
  background: string;       // hex or CSS color
  foreground: string;       // hex or CSS color
  sessionSeconds: number;
  sessionIntimacy: number;  // float 0.0 to 1.0 representing how long they've been reading
}

// Phase details
export const PHASE_CONFIGS: Record<TemporalPhase, {
  label: string;
  background: string;
  foreground: string;
  driftSpeedFactor: number;
  contrastFactor: number;
}> = {
  DAWN: {
    label: 'Misty Dawn Archive',
    background: '#FAF9F6', // Soft dew ivory
    foreground: '#2A2927',
    driftSpeedFactor: 0.7,
    contrastFactor: 0.4
  },
  MIDDAY: {
    label: 'Pristine Midday Archive',
    background: '#fbfbf9', // Original off-white
    foreground: '#1a1a1a',
    driftSpeedFactor: 1.0,
    contrastFactor: 0.8
  },
  DUSK: {
    label: 'Twilight Amber Archive',
    background: '#FAF5EE', // Warm wheat
    foreground: '#232220',
    driftSpeedFactor: 0.8,
    contrastFactor: 0.6
  },
  NIGHT: {
    label: 'Candlelight Night Archive',
    background: '#FAF1EA', // Gentle, resting warm shade
    foreground: '#32312E', // Soft charcoal to protect night reading
    driftSpeedFactor: 0.5,  // Quieter drift
    contrastFactor: 0.3    // Softer contrast
  }
};

const LISTENERS = new Set<(state: EnvironmentalState) => void>();
let globalEnvironmentalState: EnvironmentalState | null = null;

// Determine current phase based on local hour
export function getPhaseForHour(hour: number): TemporalPhase {
  if (hour >= 5 && hour < 8.5) return 'DAWN';
  if (hour >= 8.5 && hour < 17) return 'MIDDAY';
  if (hour >= 17 && hour < 21) return 'DUSK';
  return 'NIGHT';
}

function computeState(currHour: number, seconds: number): EnvironmentalState {
  const phase = getPhaseForHour(currHour);
  const config = PHASE_CONFIGS[phase];
  
  // Intimacy scales from 0.0 to 1.0 across 180 seconds (3 minutes)
  const sessionIntimacy = Math.min(seconds / 180, 1.0);
  
  // High intimacy reduces drift speed even further to create a stationary, calm focus state
  const adjustedDriftSpeed = config.driftSpeedFactor * (1 - sessionIntimacy * 0.4);
  const adjustedContrast = config.contrastFactor * (1 - sessionIntimacy * 0.25);

  return {
    hour: currHour,
    phase,
    phaseLabel: config.label,
    driftSpeedFactor: adjustedDriftSpeed,
    contrastFactor: adjustedContrast,
    background: config.background,
    foreground: config.foreground,
    sessionSeconds: seconds,
    sessionIntimacy
  };
}

export function getEnvironmentalState(): EnvironmentalState {
  if (globalEnvironmentalState) return globalEnvironmentalState;
  
  const hour = typeof window !== 'undefined' ? new Date().getHours() : 1; // Default to night
  const seconds = 0;
  globalEnvironmentalState = computeState(hour, seconds);
  return globalEnvironmentalState;
}

export function subscribeToEnvironmental(cb: (state: EnvironmentalState) => void) {
  LISTENERS.add(cb);
  return () => {
    LISTENERS.delete(cb);
  };
}

export function updateEnvironmentalState(hour: number, seconds: number) {
  globalEnvironmentalState = computeState(hour, seconds);
  
  if (typeof window !== 'undefined') {
    (window as any).__archiveEnvironmentalState = globalEnvironmentalState;
    window.dispatchEvent(new CustomEvent('archive-environmental-update', { detail: globalEnvironmentalState }));
    
    // Programmatically push custom variables to document Element
    const doc = document.documentElement;
    doc.style.setProperty('--environmental-background', globalEnvironmentalState.background);
    doc.style.setProperty('--environmental-foreground', globalEnvironmentalState.foreground);
    doc.style.setProperty('--environmental-contrast', globalEnvironmentalState.contrastFactor.toString());
    doc.style.setProperty('--session-intimacy', globalEnvironmentalState.sessionIntimacy.toString());
    
    // Add custom attribute to trigger specific CSS rules if needed
    doc.setAttribute('data-environmental-phase', globalEnvironmentalState.phase);
    doc.setAttribute('data-session-intimacy-stage', 
      globalEnvironmentalState.sessionIntimacy > 0.75 ? 'CLOSE' :
      globalEnvironmentalState.sessionIntimacy > 0.35 ? 'SENSITIVE' : 'INITIAL'
    );
  }
  
  LISTENERS.forEach(cb => cb(globalEnvironmentalState!));
}

export function useEnvironmentalState() {
  const [envState, setEnvState] = useState<EnvironmentalState>(getEnvironmentalState);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Track original session start timestamp in sessionStorage to preserve session memory on reload
    let sessionStartStr = sessionStorage.getItem('archive_session_start_v1');
    if (!sessionStartStr) {
      sessionStartStr = Date.now().toString();
      sessionStorage.setItem('archive_session_start_v1', sessionStartStr);
    }
    const sessionStart = parseInt(sessionStartStr, 10);

    const getElapsedSeconds = () => Math.floor((Date.now() - sessionStart) / 1000);

    const handleTick = () => {
      const now = new Date();
      // Allow overriding hour with url query param (e.g. ?hour=23) for testing
      const urlParams = new URLSearchParams(window.location.search);
      const queryHour = urlParams.get('hour');
      const hour = queryHour !== null ? parseInt(queryHour, 10) : now.getHours();
      
      const seconds = getElapsedSeconds();
      updateEnvironmentalState(hour, seconds);
    };

    // Initial trigger
    handleTick();

    // Regular interval to sync seconds and local hour
    const timer = setInterval(handleTick, 1000);

    // Sync other components
    const handleEvent = (e: Event) => {
      const detail = (e as CustomEvent).detail as EnvironmentalState;
      setEnvState(detail);
    };

    window.addEventListener('archive-environmental-update', handleEvent);
    
    const unsubscribe = subscribeToEnvironmental((newState) => {
      setEnvState(newState);
    });

    return () => {
      clearInterval(timer);
      unsubscribe();
      window.removeEventListener('archive-environmental-update', handleEvent);
    };
  }, []);

  return envState;
}
