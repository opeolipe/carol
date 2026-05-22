import React from 'react';
import { motion } from 'framer-motion';
import { useArchiveStillness } from './StillnessState';
import { useSignalDrift, driftCoordinate, useExplorationMemory } from './SignalDriftState';

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
  const { readDossiers, atlasNodes } = useExplorationMemory();

  // Determine if this signal or topic of interest has been visited previously
  const isSignalVisited = (signal: Signal) => {
    const normCategory = signal.category.toUpperCase();
    
    // Check if category or matching slug is visited in readDossiers
    const isTopicVisited = 
      (normCategory.includes('TRUST') && readDossiers.some(d => d.includes('product') || d.includes('trust'))) ||
      (normCategory.includes('INTERFACE') && readDossiers.some(d => d.includes('silence'))) ||
      (normCategory.includes('PSYCHOLOGY') && readDossiers.some(d => d.includes('scam'))) ||
      (normCategory.includes('BEHAVIORAL') && readDossiers.some(d => d.includes('stress') || d.includes('triggers'))) ||
      
      // Or if they visited any atlas nodes matching these keys in Atlas list
      (normCategory.includes('TRUST') && atlasNodes.some(n => n.includes('CAT-TRST') || n.includes('inv-product'))) ||
      (normCategory.includes('INTERFACE') && atlasNodes.some(n => n.includes('CAT-INTF') || n.includes('-silence'))) ||
      (normCategory.includes('PSYCHOLOGY') && atlasNodes.some(n => n.includes('CAT-PSYC') || n.includes('-scam'))) ||
      (normCategory.includes('AI') && atlasNodes.some(n => n.includes('CAT-AIEX'))) ||
      (normCategory.includes('UNRESOLVED') && atlasNodes.some(n => n.includes('CAT-UNRS')));

    return isTopicVisited;
  };

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
        {signals.map((signal, i) => {
          const visited = isSignalVisited(signal);
          const statusToDisplay = isStill ? 'STABILIZED' : visited ? 'STABILIZED' : signal.status;
          
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: i * 0.2 }}
              className={`group space-y-4 p-6 border transition-all duration-1000 ${
                isStill 
                  ? 'opacity-80' 
                  : visited
                  ? 'border-purple-100/50 hover:border-purple-300 bg-purple-50/[0.015] shadow-[2px_2px_12px_rgba(124,58,237,0.01)]'
                  : 'border-transparent hover:bg-zinc-50/40 opacity-100'
              }`}
            >
               <div className="flex justify-between items-center border-b border-zinc-50 pb-4">
                  <div className="flex items-center gap-2">
                     <div className={`w-1.5 h-1.5 rounded-full transition-all duration-1000 ${
                       statusToDisplay === 'STABILIZED'
                         ? 'bg-purple-400'
                         : signal.status === 'TRACKING' 
                         ? (isStill ? 'bg-emerald-500/60 shadow-none' : 'bg-emerald-500 animate-pulse') 
                         : 'bg-purple-500'
                     }`} />
                     <span className="text-[7px] font-mono uppercase tracking-widest text-zinc-400">{signal.category}</span>
                  </div>
                  <span className="text-[6px] font-mono text-zinc-300 uppercase tracking-tighter">
                    {visited ? '[ memory stilled ]' : isStill ? '[ LOCK_STABLE ]' : `[${signal.status}]`}
                  </span>
               </div>
               
               <p className={`text-[14px] font-light leading-relaxed italic transition-colors duration-[1500ms] ${
                 isStill 
                   ? 'text-zinc-500' 
                   : visited
                   ? 'text-zinc-500 group-hover:text-zinc-800'
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
                      LOC: {driftCoordinate(signal.coordinates, drift.visits, drift.timeDrift, visited)}
                    </div>
                  )}
               </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
