import React, { useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

interface SignalTraceProps {
  id: string;
  timestamp: string;
  title: string;
  observation: string;
  metadata: string;
  annotations?: string[];
  index: number;
}

const SignalTrace: React.FC<SignalTraceProps> = ({ id, timestamp, title, observation, metadata, annotations, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0, 1, 1, 0]);
  const blur = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [15, 0, 0, 10]);
  const y = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [60, 0, 0, -60]);
  const scale = useTransform(scrollYProgress, [0.3, 0.5], [0.98, 1]);

  return (
    <motion.div 
      ref={ref}
      style={{ opacity, filter: useTransform(blur, (v) => `blur(${v}px)`), y, scale }}
      className="min-h-screen flex flex-col items-center justify-center py-32 px-8 md:px-24 mb-[15vh]"
    >
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-12 gap-12 relative">
        {/* Investigative Rails */}
        <div className="hidden md:block col-span-1 border-l border-zinc-100 relative h-full">
           <div className="absolute top-0 left-[-4px] w-2 h-2 rounded-full bg-zinc-200" />
           <motion.div 
             style={{ height: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]) }}
             className="absolute top-0 left-[-1px] w-[2px] bg-zinc-900"
           />
        </div>

        <div className="md:col-span-11 space-y-16">
          {/* Header Metadata */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                 <span className="text-[10px] font-mono tracking-widest text-zinc-400 font-bold">{id}</span>
                 <div className="w-4 h-px bg-zinc-200" />
                 <span className="text-[10px] font-mono tracking-widest text-zinc-300 uppercase">{timestamp}</span>
              </div>
              <h2 className="text-4xl md:text-8xl font-bold tracking-tight text-zinc-900 leading-[0.85] uppercase">
                {title}
              </h2>
            </div>
            <div className="text-right hidden md:block">
               <span className="text-[9px] font-mono tracking-[0.4em] text-zinc-200 uppercase vertical-text transform rotate-180" style={{ writingMode: 'vertical-rl' }}>
                 {metadata}
               </span>
            </div>
          </div>

          {/* Primary Observation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
             <div className="space-y-8">
                <p className="text-2xl md:text-3xl font-light text-zinc-500 leading-relaxed max-w-xl italic">
                  "{observation}"
                </p>
                <div className="pt-4">
                   <a href="#" className="interactive group inline-flex items-center gap-6">
                      <span className="text-[10px] uppercase tracking-[0.5em] font-extrabold text-zinc-400 group-hover:text-zinc-900 transition-all">
                        Investigate Signal
                      </span>
                      <div className="w-12 h-px bg-zinc-100 group-hover:w-24 group-hover:bg-zinc-900 transition-all duration-700" />
                   </a>
                </div>
             </div>

             {/* Secondary Annotations - "Human Imperfections" */}
             <div className="space-y-12 md:pt-24">
                {annotations?.map((note, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 0.4, x: 0 }}
                    transition={{ delay: 0.3 * i, duration: 1.5 }}
                    className="space-y-2 relative"
                  >
                    <span className="text-[8px] font-mono uppercase tracking-widest text-zinc-300 block">annotation_v{i+1}.trace</span>
                    <p className="text-xs md:text-sm font-light text-zinc-400 max-w-xs leading-relaxed border-l border-zinc-100 pl-4">
                      {note}
                    </p>
                    {/* Tiny Text Offset Detail */}
                    <div className="absolute -left-2 top-0 text-[6px] font-mono text-zinc-200 opacity-50">
                       REF_{id}_{i}
                    </div>
                  </motion.div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const ObservationSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const gridOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 0.04, 0.04, 0]);

  const observations = [
    {
      id: "TRC-01",
      timestamp: "May 2026",
      title: "Architecture of Trust",
      observation: "Most scams don’t exploit technology first. They exploit urgency. Interfaces create permission before they create value.",
      metadata: "SCAM_PSYCHOLOGY_01",
      annotations: [
        "Urgency as a proxy for trust",
        "The psychological cost of the 'Red Label'",
        "Design as a weapon of misdirection"
      ]
    },
    {
      id: "TRC-04",
      timestamp: "June 2026",
      title: "Signals and Comfort",
      observation: "Most users don’t read technical signals. They read comfort. If an interface feels familiar, it is assumed to be safe. Familiarity is the primary vulnerability.",
      metadata: "SYSTEM_BEHAVIOR_04",
      annotations: [
        "The 'Green Padlock' fallacy",
        "Legacy UI patterns used in modern exploits",
        "Human-centered insecurity"
      ]
    },
    {
      id: "TRC-09",
      timestamp: "July 2026",
      title: "The Silent Watcher",
      observation: "Observation is never passive. Every pixel that tracks a gaze changes the behavior it was meant to measure. The internet is built on observed performance.",
      metadata: "SIGNAL_INTERFERENCE_09",
      annotations: [
        "Metrics as reality distortion",
        "Privacy as an endangered architectural choice",
        "The observer's paradox in digital space"
      ]
    }
  ];

  return (
    <section ref={containerRef} className="relative bg-[#fbfbf9] z-20">
      {/* Archive Grid System */}
      <motion.div 
        style={{ opacity: gridOpacity }}
        className="fixed inset-0 pointer-events-none z-0"
      >
        <div className="absolute inset-0" 
             style={{ 
               backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', 
               backgroundSize: '80px 80px' 
             }} 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#fbfbf9] via-transparent to-[#fbfbf9]" />
      </motion.div>

      <div className="relative z-10 pt-64">
        <div className="max-w-5xl mx-auto px-8 mb-64">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-12"
          >
             <div className="flex items-center gap-6">
                <span className="text-[10px] uppercase tracking-[0.8em] text-zinc-300 font-bold block">Signal Archive</span>
                <div className="w-px h-12 bg-zinc-100" />
                <span className="text-[10px] font-mono text-zinc-200">ACCESS_GRANTED://ACT_II</span>
             </div>
             
             <h3 className="text-5xl md:text-8xl font-light tracking-tight text-zinc-900 leading-[0.9] max-w-4xl">
               Investigation is a quiet act. <br />
               <span className="text-zinc-400 italic">Noticing patterns in the noise.</span>
             </h3>

             <div className="max-w-md pt-8">
                <p className="text-sm font-light text-zinc-400 leading-relaxed uppercase tracking-widest">
                  A DOCUMENTATION OF DIGITAL TRUST, BEHAVIORAL PATTERNS, AND SYSTEMIC AMBIGUITY.
                </p>
             </div>
          </motion.div>
        </div>

        <div className="space-y-[0vh]">
          {observations.map((obs, i) => (
            <SignalTrace 
              key={i} 
              index={i + 1}
              id={obs.id}
              timestamp={obs.timestamp}
              title={obs.title} 
              observation={obs.observation} 
              metadata={obs.metadata}
              annotations={obs.annotations}
            />
          ))}
        </div>

        {/* Investigative Footer Transition */}
        <div className="h-screen flex flex-col items-center justify-center p-8 text-center space-y-12">
            <div className="w-px h-32 bg-gradient-to-b from-zinc-200 to-transparent" />
            <div className="space-y-4">
              <span className="text-[9px] font-mono tracking-[0.4em] text-zinc-300 uppercase">End of Initial Archive</span>
              <p className="text-xs text-zinc-400 font-light tracking-widest uppercase">The investigation continues deeper.</p>
            </div>
            <motion.div 
               animate={{ opacity: [0.2, 0.5, 0.2] }}
               transition={{ duration: 4, repeat: Infinity }}
               className="text-[8px] font-mono text-zinc-200 uppercase tracking-tighter"
            >
              [ + Fragmented Metadata Recovered ]
            </motion.div>
        </div>
      </div>
    </section>
  );
};

