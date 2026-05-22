import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion';
import { useArchiveStillness } from './StillnessState';

interface SignalTraceProps {
  id: string;
  timestamp: string;
  title: string;
  observation: string;
  metadata: string;
  annotations?: string[];
  index: number;
  onViewed: (id: string) => void;
  isViewed: boolean;
}

const SignalTrace: React.FC<SignalTraceProps> = ({ id, timestamp, title, observation, metadata, annotations, index, onViewed, isViewed }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.7 }); // Higher threshold for deliberate focus
  
  useEffect(() => {
    if (isInView) {
      onViewed(id);
    }
  }, [isInView, id, onViewed]);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center", "end start"]
  });

  // Attention Gravity: Sharper focus in the center, slower reaction
  const opacity = useTransform(scrollYProgress, [0, 0.48, 0.52, 1], [0, 1, 1, 0]);
  const blur = useTransform(scrollYProgress, [0, 0.42, 0.5, 0.58, 1], [20, 2, 0, 2, 25]); 
  const y = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [50, 0, 0, -50]); 
  const scale = useTransform(scrollYProgress, [0.42, 0.5, 0.58], [0.97, 1, 0.97]);

  // Exploration Memory: Soften and stabilize if already viewed
  const archiveDim = isViewed && !isInView ? 0.15 : 1;
  const archiveBlur = isViewed ? 3 : 0;
  const archiveSaturation = isViewed ? 'grayscale(0.6)' : 'none';
  const archiveContrast = isViewed ? 'contrast(0.95)' : 'contrast(1)';

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        // Asymmetrical, non-linear sequencing with organic pauses
        staggerChildren: index === 1 ? 0.4 : (index === 2 ? 0.3 : 0.6), 
        delayChildren: index === 1 ? 0.3 : 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 40, filter: 'blur(12px)' },
    show: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { 
        duration: 2.8, 
        ease: [0.22, 1, 0.36, 1] 
      } 
    }
  };

  return (
    <motion.div 
      ref={ref}
      style={{ 
        opacity, 
        filter: useTransform(blur, (v) => `blur(${v + archiveBlur}px) ${archiveSaturation} ${archiveContrast}`), 
        y, 
        scale,
        transition: { duration: 2.5, ease: [0.22, 1, 0.36, 1] }
      }}
      className="min-h-[110vh] flex flex-col items-center justify-center py-32 md:py-64 px-8 md:px-24 mb-[8vh] md:mb-[15vh]"
    >
      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, margin: "-25% 0px" }}
        className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-24 relative"
      >
        {/* Investigative Rails */}
        <div className="hidden lg:block lg:col-span-1 border-l border-zinc-100 relative h-full">
           <div className="absolute top-0 left-[-4px] w-2 h-2 rounded-full bg-zinc-200" />
           <motion.div 
             style={{ 
               height: useTransform(scrollYProgress, [0, 0.5, 1], ["0%", "100%", "100%"]),
               opacity: useTransform(scrollYProgress, [0.4, 0.6], [1, isViewed ? 0.3 : 1])
             }}
             className="absolute top-0 left-[-1px] w-[2px] bg-zinc-950"
           />
        </div>

        <div className="lg:col-span-11 space-y-12 md:space-y-20">
          <motion.div 
            variants={item} 
            className="flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-16 border-b border-zinc-50 pb-8"
            style={{ opacity: archiveDim }}
          >
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                 <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-400 font-bold uppercase">{id}</span>
                 <div className="w-8 h-px bg-zinc-100" />
                 <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-300 uppercase">{timestamp}</span>
                 {isViewed && (
                   <motion.div 
                     initial={{ opacity: 0, x: -10 }}
                     animate={{ opacity: 0.3, x: 0 }}
                     className="ml-auto md:ml-6 flex items-center gap-3 transition-opacity duration-1000"
                   >
                     <div className="w-[1px] h-3 bg-zinc-200" />
                     <span className="text-[7px] font-mono tracking-[0.5em] text-zinc-300 uppercase">ARCHIVE_SETTLED</span>
                   </motion.div>
                 )}
              </div>
              
              <h2 className="text-[clamp(2.2rem,7vw,7rem)] font-bold tracking-tight text-zinc-950 leading-[0.85] uppercase max-w-5xl">
                {title}
              </h2>
            </div>
            
            <div className="hidden md:block">
               <span className="text-[9px] font-mono tracking-[0.5em] text-zinc-200 uppercase vertical-text transform rotate-180 mb-4" style={{ writingMode: 'vertical-rl' }}>
                 {metadata}
               </span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-32 items-start">
             <motion.div 
                variants={item} 
                className="space-y-10"
             >
                <div className="space-y-6">
                   <div className="flex items-center gap-4">
                      <div className="w-4 h-px bg-zinc-200" />
                      <span className="text-[9px] uppercase tracking-[0.8em] text-zinc-300 font-black block">Signal Extract</span>
                   </div>
                   <p className="text-[clamp(1.1rem,2.5vw,1.7rem)] font-light text-zinc-700 leading-[1.4] max-w-[18ch] md:max-w-[22ch]"
                      dangerouslySetInnerHTML={{ __html: observation.replace(/(behavioral triggers|digital trust|systemic ambiguity|signal trace|investigative archive|emotional urgency|familiarity|signals and comfort|architecture of trust|investigations in progress|active signals|signal interference)/gi, '<span class="inline-block whitespace-nowrap text-zinc-950 font-medium">$1</span>') }}
                   />
                </div>
                
                <div className="pt-4">
                   <button className="interactive group inline-flex items-center gap-6 cursor-pointer">
                      <span className="text-[9px] uppercase tracking-[0.4em] font-black text-zinc-300 group-hover:text-zinc-950 transition-all duration-700">
                        Investigate Signal
                      </span>
                      <div className="w-12 h-px bg-zinc-100 group-hover:w-24 group-hover:bg-zinc-950 transition-all duration-1000" />
                   </button>
                </div>
             </motion.div>

             <div className="space-y-20 md:space-y-32 md:pt-48">
                {annotations?.map((note, i) => (
                  <motion.div 
                    key={i}
                    variants={{
                      hidden: { opacity: 0, x: -20, filter: 'blur(8px)' },
                      show: { 
                        opacity: 1, 
                        x: 0,
                        filter: 'blur(0px)',
                        transition: { 
                          delay: 1.5 + (i === 1 ? 0.8 : 0.4) + (Math.random() * 0.5), // Diverse organic response
                          duration: 3, 
                          ease: [0.22, 1, 0.36, 1] 
                        } 
                      }
                    }}
                    className={`space-y-4 relative group max-w-[300px] md:max-w-sm transition-all duration-1000 ${i % 2 === 0 ? 'ml-0' : 'ml-6 md:ml-16'} ${isViewed ? 'opacity-60 grayscale-[0.2]' : 'opacity-100'}`}
                  >
                    <div className="flex items-center gap-4">
                       <span className={`text-[8px] font-mono uppercase tracking-[0.4em] transition-colors duration-1000 ${isViewed ? 'text-zinc-200' : 'text-zinc-300 group-hover:text-zinc-950'}`}>trace_v{i+1}</span>
                       <div className={`flex-grow h-px transition-all duration-1000 ${isViewed ? 'bg-zinc-50' : 'bg-zinc-100 group-hover:bg-zinc-950/10'}`} />
                    </div>
                    <p className={`text-[12px] md:text-[14px] font-light leading-relaxed md:leading-[1.8] pl-6 border-l transition-all duration-1000 ${isViewed ? 'text-zinc-300 border-zinc-100' : 'text-zinc-500 border-zinc-50 group-hover:border-zinc-300 group-hover:text-zinc-900'}`}>
                      {note}
                    </p>
                    <div className="absolute -left-6 top-1 text-[5px] font-mono text-zinc-200 opacity-0 group-hover:opacity-100 transition-all duration-1000 translate-x-2 group-hover:translate-x-0">
                       ARCHIVE_ID_{id.replace('-', '')}_{i}
                    </div>
                  </motion.div>
                ))}
             </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const ObservationSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isStill = useArchiveStillness();
  const [redundancyExpanded, setRedundancyExpanded] = useState(false);
  const [redundancyHovered, setRedundancyHovered] = useState(false);
  const [viewedIds, setViewedIds] = useState<Set<string>>(new Set());

  const handleViewed = (id: string) => {
    setViewedIds(prev => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const gridOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 0.03, 0.03, 0]);
  const progressRatio = viewedIds.size / 3; // Total 3 main observations

  const observations = [
    {
      id: "TRC-01",
      timestamp: "May 2026",
      title: "Architecture of Trust",
      observation: "Scams don’t exploit code first. They use emotional urgency to bypass digital trust.",
      metadata: "SCAM_PSYCHOLOGY_01",
      annotations: [
        "Urgency as a proxy for trust.",
        "The cost of the 'Red Label'."
      ]
    },
    {
      id: "TRC-04",
      timestamp: "June 2026",
      title: "Signals and Comfort",
      observation: "Familiarity is the primary vulnerability in behavioral triggers.",
      metadata: "SYSTEM_BEHAVIOR_04",
      annotations: [
        "The 'Green Padlock' fallacy.",
        "Legacy UI used in modern triggers."
      ]
    },
    {
      id: "TRC-09",
      timestamp: "July 2026",
      title: "The Silent Watcher",
      observation: "Every pixel alters the signal interference in the archive.",
      metadata: "SIGNAL_INTERFERENCE_09",
      annotations: [
        "Metrics as reality distortion.",
        "Privacy as an endangered choice."
      ]
    }
  ];

  return (
    <section ref={containerRef} className="relative bg-[var(--background)] z-20">
      {/* Archive Grid System - Interactive Grid */}
      <motion.div 
        style={{ 
          opacity: gridOpacity,
          scale: useTransform(scrollYProgress, [0, 1], [1, 1.05])
        }}
        className="fixed inset-0 pointer-events-none z-0"
      >
        <div className="absolute inset-0" 
             style={{ 
               backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', 
               backgroundSize: '80px 80px' 
             }} 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#fbfbf9] via-transparent to-[#fbfbf9]" />
        
        {/* Subtle Progress Trace */}
        <motion.div 
          className="absolute top-0 right-0 w-1 bg-zinc-950/5 h-screen origin-top"
          style={{ scaleY: progressRatio }}
        />
      </motion.div>

      <div className="relative z-10 pt-48 md:pt-64">
        <div className="max-w-7xl mx-auto px-8 mb-48 md:mb-[40vh] relative">
          <div className="absolute top-0 right-0 hidden lg:block opacity-[0.03]">
             <span className="text-[180px] font-bold text-zinc-950 font-mono select-none tracking-tighter">02</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-12 md:space-y-24 relative"
          >
             <div className="flex flex-col md:flex-row md:items-center gap-6">
                <span className="text-[9px] uppercase tracking-[0.8em] text-zinc-300 font-black block">Signal Archive</span>
                <div className="hidden md:block w-px h-12 bg-zinc-50" />
                <div className="flex items-center gap-4">
                  <span className="text-[8px] font-mono text-zinc-200">ACCESS_GRANTED://ROOT</span>
                  <motion.div 
                    animate={{ opacity: [0.2, 0.6, 0.2] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="w-1.5 h-1.5 rounded-full bg-zinc-200" 
                  />
                </div>
             </div>
             
             <div className="relative">
               <h3 className="text-[clamp(1.5rem,5.5vw,7.5rem)] font-light tracking-tight text-zinc-900 leading-[0.95] max-w-6xl relative z-10">
                 <span className="block mb-4 md:mb-0 opacity-40">Investigation is a</span> 
                 <span className="block md:ml-[8vw] mb-4 md:mb-0 text-zinc-950 font-normal">quiet act.</span> 
                 <span className="text-zinc-300 italic block md:ml-[22vw] font-light">Noticing patterns.</span>
               </h3>
             </div>

             <div className="max-w-md pt-8 md:ml-[30vw] border-l border-zinc-50 pl-8 md:pl-10 space-y-10">
                <p className="text-[10px] md:text-[12px] font-light text-zinc-400 leading-relaxed uppercase tracking-[0.2em]">
                  A documented exploration <br />
                  of <span className="inline-block whitespace-nowrap text-zinc-950 font-medium italic">digital trust</span>, <br className="md:hidden" />
                  <span className="inline-block whitespace-nowrap text-zinc-900 font-medium">behavioral triggers</span>, <br />
                  and <span className="inline-block whitespace-nowrap text-zinc-900 font-medium">systemic ambiguity</span>.
                </p>

                <div className="flex items-center gap-4 opacity-50">
                    <div className="w-6 h-px bg-zinc-100" />
                    <span className="text-[9px] font-mono text-zinc-300 uppercase tracking-widest italic">Trace // 2026.05.21</span>
                </div>
             </div>
          </motion.div>
        </div>

        <div className="space-y-[0vh]">
          {observations.map((obs, i) => (
            <SignalTrace 
              key={obs.id} 
              index={i + 1}
              id={obs.id}
              timestamp={obs.timestamp}
              title={obs.title} 
              observation={obs.observation} 
              metadata={obs.metadata}
              annotations={obs.annotations}
              onViewed={handleViewed}
              isViewed={viewedIds.has(obs.id)}
            />
          ))}
        </div>

        {/* Investigative Footer Transition */}
        <div className="h-[95vh] flex flex-col items-center justify-center p-8 text-center space-y-12">
            <div className="w-px h-24 bg-gradient-to-b from-zinc-100 to-transparent" />
            <div className="space-y-4">
              <span className="text-[8px] font-mono tracking-[0.4em] text-zinc-300 uppercase">End of Initial Archive</span>
              <p className="text-[10px] text-zinc-400 font-light tracking-widest uppercase">The investigation continues deeper.</p>
            </div>
            
            <motion.div 
               animate={{ opacity: [0.1, 0.3, 0.1] }}
               transition={{ duration: 5, repeat: Infinity }}
               className="text-[7px] font-mono text-zinc-250 uppercase tracking-tighter"
            >
              [ + Fragmented Metadata Recovered ]
            </motion.div>

            {/* Decoy Footprint Signal Quest Asset */}
            <div className="pt-6 flex flex-col items-center">
              <motion.button
                type="button"
                onClick={() => {
                  if (isStill) {
                    setRedundancyExpanded(!redundancyExpanded);
                  }
                }}
                onMouseEnter={() => setRedundancyHovered(true)}
                onMouseLeave={() => setRedundancyHovered(false)}
                className={`text-[8px] font-mono uppercase tracking-[0.2em] px-4 py-2 border rounded transition-all duration-1000 select-none cursor-pointer ${
                  isStill
                    ? 'border-purple-300 bg-purple-500/10 text-purple-700 hover:bg-purple-550/20'
                    : 'border-dashed border-zinc-200 text-zinc-300 hover:border-zinc-300 hover:text-zinc-500 bg-transparent'
                }`}
                animate={!isStill ? { x: [0, -3, 3, -1, 0] } : {}}
                transition={{ duration: 0.5, repeat: isStill ? 0 : Infinity, repeatDelay: 4 }}
              >
                {isStill ? "[ #0x82_REDUNDANCY: STABILIZED_CLICK ]" : "[ #0x82_REDUNDANCY: DRIFTING ]"}
              </motion.button>

              <AnimatePresence>
                {redundancyHovered && !isStill && (
                  <motion.p 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[7px] font-mono text-zinc-400 mt-2 tracking-widest text-center"
                  >
                    COORDINATE SYNC LOST. TRACE IS DRIFTING.<br />
                    LOCK ARCHIVE STILLNESS TO STABILIZE RESIDUE.
                  </motion.p>
                )}

                {redundancyExpanded && isStill && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    key="redundancy-card"
                    className="mt-6 p-6 border border-dashed border-purple-200 bg-purple-50/10 max-w-sm rounded backdrop-blur-sm shadow-[12px_12px_32px_rgba(124,58,237,0.03)] text-left"
                  >
                    <div className="flex justify-between items-center text-[7.5px] font-mono text-purple-600 uppercase tracking-widest font-black border-b border-purple-100/60 pb-2 mb-3">
                      <span>Ref_ID: #0x82_REDUNDANCY</span>
                      <span>STABLE</span>
                    </div>
                    <p className="text-[11px] font-light text-zinc-600 leading-relaxed italic">
                      “Every time users tap to decline the tracking cookies, we delay the checkout screen by exactly 800 milliseconds. It is not an asynchronous load latency. It is a psychological friction buffer. They need to sit with their dissent just long enough to feel the weight of their choices.”
                    </p>
                    <div className="text-[7px] font-mono text-purple-400 uppercase tracking-widest text-right mt-3">
                      — CAROL'S SYSTEM DRIFT STUDY
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
        </div>
      </div>
    </section>
  );
};


