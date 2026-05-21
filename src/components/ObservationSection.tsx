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
  const blur = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [8, 0, 0, 8]); 
  const y = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [40, 0, 0, -40]); 
  const scale = useTransform(scrollYProgress, [0.3, 0.5], [0.99, 1]);

  return (
    <motion.div 
      ref={ref}
      style={{ opacity, filter: useTransform(blur, (v) => `blur(${v}px)`), y, scale }}
      className="min-h-screen flex flex-col items-center justify-center py-32 md:py-48 px-8 md:px-24 mb-[5vh] md:mb-[10vh]"
    >
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24 relative">
        {/* Investigative Rails - Visible on Larger Screens for Structural Rhythm */}
        <div className="hidden lg:block lg:col-span-1 border-l border-zinc-100 relative h-full">
           <div className="absolute top-0 left-[-4px] w-2 h-2 rounded-full bg-zinc-200" />
           <motion.div 
             style={{ height: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]) }}
             className="absolute top-0 left-[-1px] w-[2px] bg-zinc-900"
           />
        </div>

        <div className="lg:col-span-11 space-y-12 md:space-y-24">
          {/* Header Metadata: Level 3 Hierarchy */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-16 border-b border-zinc-50 pb-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                 <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-500 font-bold uppercase">{id}</span>
                 <div className="w-8 h-px bg-zinc-100" />
                 <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-400 uppercase">{timestamp}</span>
              </div>
              
              {/* Level 1: Primary Title - Fluid Typography */}
              <h2 className="text-[clamp(2.5rem,8vw,8rem)] font-bold tracking-tight text-zinc-900 leading-[0.85] uppercase max-w-5xl">
                {title}
              </h2>
            </div>
            
            <div className="hidden md:block">
               <span className="text-[9px] font-mono tracking-[0.5em] text-zinc-300 uppercase vertical-text transform rotate-180 mb-4" style={{ writingMode: 'vertical-rl' }}>
                 {metadata}
               </span>
            </div>
          </div>

          {/* Core Observation Layer */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-32 items-start">
             <div className="space-y-12">
                {/* Level 2: Primary Observation Statement - Strict Width Control */}
                <div className="space-y-6">
                   <span className="text-[9px] uppercase tracking-[0.8em] text-zinc-300 font-black block">Signal Extract</span>
                   <p className="text-[clamp(1.5rem,3vw,2.5rem)] font-light text-zinc-700 leading-[1.3] max-w-[18ch] md:max-w-[22ch]">
                     {observation}
                   </p>
                </div>
                
                <div className="pt-4">
                   <a href="#" className="interactive group inline-flex items-center gap-8">
                      <span className="text-[10px] uppercase tracking-[0.6em] font-black text-zinc-400 group-hover:text-zinc-900 transition-all duration-500">
                        Investigate Signal
                      </span>
                      <div className="w-16 h-px bg-zinc-100 group-hover:w-32 group-hover:bg-zinc-900 transition-all duration-700" />
                   </a>
                </div>
             </div>

             {/* Level 4: Fragmented Annotations - Investigative Rhythm */}
             <div className="space-y-16 md:pt-32">
                {annotations?.map((note, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-15% 0px" }}
                    transition={{ delay: 0.25 * i, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-4 relative group max-w-sm"
                  >
                    <div className="flex items-center gap-4">
                       <div className="w-2 h-2 border border-zinc-100 rounded-sm group-hover:bg-zinc-900 transition-all duration-500" />
                       <span className="text-[8px] font-mono uppercase tracking-[0.4em] text-zinc-300 block">annotation_trc_{i+1}</span>
                    </div>
                    <p className="text-sm md:text-base font-light text-zinc-500 leading-relaxed pl-6 border-l border-zinc-100 group-hover:border-zinc-300 transition-colors duration-500">
                      {note}
                    </p>
                    {/* Hidden Metadata Detail */}
                    <div className="absolute -left-6 top-0 text-[6px] font-mono text-zinc-200 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-x-2 group-hover:translate-x-0">
                       ARCHIVE_ID_{id.replace('-', '')}_{i}
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

      <div className="relative z-10 pt-48 md:pt-64">
        <div className="max-w-7xl mx-auto px-8 mb-64 md:mb-[40vh]">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-12 md:space-y-24"
          >
             <div className="flex flex-col md:flex-row md:items-center gap-6">
                <span className="text-[10px] uppercase tracking-[0.8em] text-zinc-400 font-black block">Signal Archive</span>
                <div className="hidden md:block w-px h-16 bg-zinc-100" />
                <span className="text-[10px] font-mono text-zinc-300">ACCESS_GRANTED://ACT_II</span>
             </div>
             
             <h3 className="text-[clamp(3rem,10vw,12rem)] font-light tracking-tight text-zinc-900 leading-[0.85] max-w-7xl">
               Investigation is a <br /> 
               <span className="md:ml-[15vw]">quiet act.</span> <br />
               <span className="text-zinc-400 italic md:ml-[30vw]">Noticing patterns.</span>
             </h3>

             <div className="max-w-sm pt-8 md:ml-[30vw] border-l border-zinc-100 pl-8">
                <p className="text-[11px] font-light text-zinc-500 leading-[1.8] uppercase tracking-[0.25em]">
                  A documented exploration <br />
                  of digital trust, behavioral <br />
                  triggers, and systemic ambiguity.
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
              <span className="text-[9px] font-mono tracking-[0.4em] text-zinc-400 uppercase">End of Initial Archive</span>
              <p className="text-xs text-zinc-500 font-light tracking-widest uppercase">The investigation continues deeper.</p>
            </div>
            <motion.div 
               animate={{ opacity: [0.3, 0.6, 0.3] }}
               transition={{ duration: 4, repeat: Infinity }}
               className="text-[8px] font-mono text-zinc-300 uppercase tracking-tighter"
            >
              [ + Fragmented Metadata Recovered ]
            </motion.div>
        </div>
      </div>
    </section>
  );
};

