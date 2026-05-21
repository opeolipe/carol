import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { setStillnessState, useArchiveStillness, getStillnessState } from './StillnessState';
import { recordVisit } from './SignalDriftState';
import { Eye, EyeOff, Zap, ShieldAlert, Sparkles, Compass } from 'lucide-react';

export const StillnessHUD = () => {
  const isStill = useArchiveStillness();
  const [cycleTime, setCycleTime] = useState(24); // Time left in current segment
  const [manualOverride, setManualOverride] = useState(false);
  const [showingDetails, setShowingDetails] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Core configuration parameters
  const ACTIVE_DURATION = 24; // seconds of action
  const STILL_DURATION = 8;    // seconds of deep stillness

  useEffect(() => {
    // Record visit on client-side mount
    recordVisit();
  }, []);

  useEffect(() => {
    // If user enforces manual mode, we halt the automated countdown tracker
    if (manualOverride) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    setCycleTime(isStill ? STILL_DURATION : ACTIVE_DURATION);

    timerRef.current = setInterval(() => {
      setCycleTime((prev) => {
        if (prev <= 1) {
          // Toggle phase automatically!
          const nextState = isStill ? 'ACTIVE' : 'STILL';
          setStillnessState(nextState);
          return nextState === 'STILL' ? STILL_DURATION : ACTIVE_DURATION;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isStill, manualOverride]);

  const toggleStillness = () => {
    const nextState = isStill ? 'ACTIVE' : 'STILL';
    setStillnessState(nextState);
    setManualOverride(true);
    setCycleTime(nextState === 'STILL' ? STILL_DURATION : ACTIVE_DURATION);
  };

  const resumeAutomatedCycle = () => {
    setManualOverride(false);
    setStillnessState('ACTIVE');
    setCycleTime(ACTIVE_DURATION);
  };

  // Human, intentional labels mapping the archive's breathing state
  const stateLabel = isStill ? 'ARCHIVE_STILLED' : 'ARCHIVE_COLLECTING';
  const stateColor = isStill ? 'text-purple-400 border-purple-900/40 bg-purple-950/20' : 'text-emerald-500 border-emerald-900/30 bg-emerald-950/10';

  return (
    <div className="fixed bottom-8 left-8 z-[9999] pointer-events-none flex flex-col items-start gap-4">
      {/* Mini atmospheric status line */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        onClick={() => setShowingDetails(!showingDetails)}
        className="pointer-events-auto bg-zinc-950/90 text-zinc-100 p-4 border border-zinc-900 shadow-[24px_24px_48px_rgba(0,0,0,0.15)] flex flex-col gap-3 max-w-[280px] select-none text-left rounded-md cursor-pointer transition-all hover:bg-zinc-900"
      >
        <div className="flex items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            {/* Visual breathing orb */}
            <div className="relative w-3 h-3 flex items-center justify-center">
              <AnimatePresence mode="popLayout">
                {isStill ? (
                  <motion.div
                    key="still-orb"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: [1, 1.1, 1], opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-2.5 h-2.5 rounded-full bg-purple-500/80 shadow-[0_0_12px_#a78bfa]"
                  />
                ) : (
                  <motion.div
                    key="active-orb"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_#34d399]"
                  />
                )}
              </AnimatePresence>
            </div>
            
            <span className="text-[9px] font-mono uppercase tracking-[0.3em] font-extrabold text-white">
              {stateLabel}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!manualOverride ? (
              <span className="text-[8px] font-mono text-zinc-400">
                {cycleTime}s
              </span>
            ) : (
              <span className="text-[6px] font-mono px-1.5 py-0.5 rounded border border-purple-900 text-purple-300 uppercase scale-90 block">
                MANUAL
              </span>
            )}
          </div>
        </div>

        {/* Minimal Timeline Breathing Meter */}
        <div className="w-full h-[2px] bg-zinc-900/60 overflow-hidden relative">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ 
              scaleX: manualOverride ? 1 : cycleTime / (isStill ? STILL_DURATION : ACTIVE_DURATION)
            }}
            transition={{ duration: manualOverride ? 0.8 : 1, ease: 'linear' }}
            className={`absolute left-0 top-0 bottom-0 origin-left w-full ${isStill ? 'bg-purple-500' : 'bg-emerald-500'}`}
          />
        </div>

        {/* Quick Trigger Button */}
        <div className="flex items-center justify-between border-t border-zinc-900 pt-3 gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleStillness();
            }}
            className="text-[8px] font-mono uppercase tracking-widest text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-500 px-2.5 py-1 rounded transition-all duration-300"
          >
            {isStill ? "Unpause_Forces" : "Engage_Stillness"}
          </button>
          
          {manualOverride && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                resumeAutomatedCycle();
              }}
              className="text-[7px] font-mono text-zinc-500 hover:text-zinc-300 underline transition-colors"
            >
              Resume_Auto
            </button>
          )}
        </div>

        {/* Quietly Fading System Breakdown details */}
        <AnimatePresence>
          {showingDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-2 pt-2 border-t border-zinc-900 space-y-2 overflow-hidden"
            >
              <div className="text-[7px] font-mono text-zinc-400 space-y-1">
                <div className="flex justify-between">
                  <span>SYSTEM_MOTION:</span>
                  <span className={isStill ? 'text-purple-400' : 'text-emerald-400'}>
                    {isStill ? '0.04% [ STABLE ]' : '100% [ DRIFTING ]'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>INPUT_LATENCY:</span>
                  <span>{isStill ? '350ms' : '0ms'}</span>
                </div>
                <p className="text-[6.5px] leading-relaxed text-zinc-500 pt-1 border-t border-zinc-900/30">
                  {isStill 
                    ? "The archive is resting. Hover actions are subdued or delayed to preserve context and reduce noise."
                    : "Active collection sequence operating. Disparate tracks are pulsing and reacting organically."
                  }
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
