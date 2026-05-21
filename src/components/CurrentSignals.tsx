import React from 'react';
import { motion } from 'framer-motion';

interface Signal {
  observation: string;
  category: string;
  timestamp: Date;
  status: 'TRACKING' | 'DRIFTING' | 'STABILIZED';
  coordinates?: string;
}

export const CurrentSignals = ({ signals }: { signals: Signal[] }) => {
  return (
    <section className="py-24 border-t border-zinc-100">
      <div className="flex items-center gap-4 mb-16">
        <div className="w-12 h-[1px] bg-zinc-950" />
        <span className="text-[10px] font-mono uppercase tracking-[0.6em] text-zinc-950 font-black">Currently_Tracking_Signals</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {signals.map((signal, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: i * 0.2 }}
            className="group space-y-4"
          >
             <div className="flex justify-between items-center border-b border-zinc-50 pb-4">
                <div className="flex items-center gap-2">
                   <div className={`w-1.5 h-1.5 rounded-full ${signal.status === 'TRACKING' ? 'bg-emerald-500 animate-pulse' : signal.status === 'DRIFTING' ? 'bg-purple-500' : 'bg-zinc-200'}`} />
                   <span className="text-[7px] font-mono uppercase tracking-widest text-zinc-400">{signal.category}</span>
                </div>
                <span className="text-[6px] font-mono text-zinc-300 uppercase tracking-tighter">[{signal.status}]</span>
             </div>
             
             <p className="text-[14px] font-light text-zinc-600 leading-relaxed italic group-hover:text-zinc-950 transition-colors duration-700">
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
                    LOC: {signal.coordinates}
                  </div>
                )}
             </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
