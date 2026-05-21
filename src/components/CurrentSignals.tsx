import React from 'react';
import { motion } from 'framer-motion';
import { useArchiveStillness } from './StillnessState';
import { useSignalDrift, driftCoordinate } from './SignalDriftState';

interface Signal {
  observation: string;
  category: string;
  timestamp: Date;
  status: 'TRACKING' | 'DRIFTING' | 'STABILIZED';
  coordinates?: string;
}

export const CurrentSignals = ({ signals }: { signals: Signal[] }) => {
  const isStill = useArchiveStillness();
  const drift = useSignalDrift();

  return (
    <section className="py-24 border-t border-zinc-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-16">
        <div className="flex items-center gap-4">
          <div className="w-12 h-[1px] bg-zinc-950" />
          <span className="text-[10px] font-mono uppercase tracking-[0.6em] text-zinc-950 font-black">
            Currently_Tracking_Signals {isStill && <span className="text-purple-400 font-normal pl-2">[ SILENT_BREATH_LOCK ]</span>}
          </span>
        </div>
        <div className="text-[7px] font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-2">
          <span>[ SESSION_V:{drift.visits} ]</span>
          <span className="w-1 h-1 rounded-full bg-zinc-300" />
          <span>ENVIRONMENT_JITTER: {(drift.timeDrift * 0.1).toFixed(4)}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {signals.map((signal, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: i * 0.2 }}
            className={`group space-y-4 transition-opacity duration-1000 ${isStill ? 'opacity-80' : 'opacity-100'}`}
          >
             <div className="flex justify-between items-center border-b border-zinc-50 pb-4">
                <div className="flex items-center gap-2">
                   <div className={`w-1.5 h-1.5 rounded-full transition-all duration-1000 ${
                     signal.status === 'TRACKING' 
                       ? (isStill ? 'bg-emerald-500/60 shadow-none' : 'bg-emerald-500 animate-pulse') 
                       : signal.status === 'DRIFTING' 
                       ? 'bg-purple-500' 
                       : 'bg-zinc-200'
                   }`} />
                   <span className="text-[7px] font-mono uppercase tracking-widest text-zinc-400">{signal.category}</span>
                </div>
                <span className="text-[6px] font-mono text-zinc-300 uppercase tracking-tighter">
                  {isStill ? '[ LOCK_STABLE ]' : `[${signal.status}]`}
                </span>
             </div>
             
             <p className={`text-[14px] font-light leading-relaxed italic transition-colors duration-[1500ms] ${
               isStill 
                 ? 'text-zinc-500' 
                 : 'text-zinc-600 group-hover:text-zinc-950'
             }`}>
               {signal.observation}
             </p>

             <div className="pt-4 flex justify-between items-end">
                <div className="space-y-1">
                   <span className="text-[6px] font-mono text-zinc-300 uppercase block tracking-widest">Last_Observed</span>
                   <span className="text-[8px] font-mono text-zinc-500 uppercase">
                     {new Date(signal.timestamp).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })} UTC
                   </span>
                </div>
                {signal.coordinates && (
                  <div className="text-[6px] font-mono text-zinc-300 uppercase tracking-widest text-right">
                    LOC: {driftCoordinate(signal.coordinates, drift.visits, drift.timeDrift)}
                  </div>
                )}
             </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
