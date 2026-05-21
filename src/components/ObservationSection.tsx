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

  const opacity = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [0, 1, 1, 0]);
  const blur = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [10, 0, 0, 10]); 
  const y = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [30, 0, 0, -30]); 
  const scale = useTransform(scrollYProgress, [0.3, 0.5], [0.99, 1]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <motion.div 
      ref={ref}
      style={{ opacity, filter: useTransform(blur, (v) => `blur(${v}px)`), y, scale }}
      className="min-h-screen flex flex-col items-center justify-center py-32 md:py-48 px-8 md:px-24 mb-[15vh] md:mb-[25vh]"
    >
      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, margin: "-20% 0px" }}
        className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24 relative"
      >
        {/* Investigative Rails */}
        <div className="hidden lg:block lg:col-span-1 border-l border-zinc-100 relative h-full">
           <div className="absolute top-0 left-[-4px] w-2 h-2 rounded-full bg-zinc-200" />
           <motion.div 
             style={{ height: useTransform(scrollYProgress, [0, 0.5, 1], ["0%", "100%", "100%"]) }}
             className="absolute top-0 left-[-1px] w-[2px] bg-zinc-900"
           />
        </div>

        <div className="lg:col-span-11 space-y-12 md:space-y-24">
          <motion.div variants={item} className="flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-16 border-b border-zinc-50 pb-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                 <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-500 font-bold uppercase">{id}</span>
                 <div className="w-8 h-px bg-zinc-100" />
                 <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-400 uppercase">{timestamp}</span>
              </div>
              
              <h2 className="text-[clamp(2.5rem,8vw,8rem)] font-bold tracking-tight text-zinc-900 leading-[0.85] uppercase max-w-5xl">
                {title}
              </h2>
            </div>
            
            <div className="hidden md:block">
               <span className="text-[9px] font-mono tracking-[0.5em] text-zinc-300 uppercase vertical-text transform rotate-180 mb-4" style={{ writingMode: 'vertical-rl' }}>
                 {metadata}
               </span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-32 items-start">
             <motion.div variants={item} className="space-y-12">
                <div className="space-y-6">
                   <div className="flex items-center gap-4">
                      <div className="w-4 h-px bg-zinc-200" />
                      <span className="text-[9px] uppercase tracking-[0.8em] text-zinc-300 font-black block">Signal Extract</span>
                   </div>
                   <p className="text-[clamp(1.5rem,3vw,2.5rem)] font-light text-zinc-700 leading-[1.3] max-w-[18ch] md:max-w-[22ch]"
                      dangerouslySetInnerHTML={{ __html: observation.replace(/(behavioral triggers|digital trust|systemic ambiguity|signal trace|investigative archive|emotional urgency|familiarity)/gi, '<span class="inline-block whitespace-nowrap text-zinc-900 font-medium">$1</span>') }}
                   />
                </div>
                
                <div className="pt-4">
                   <a href="#" className="interactive group inline-flex items-center gap-8">
                      <span className="text-[10px] uppercase tracking-[0.6em] font-black text-zinc-400 group-hover:text-zinc-900 transition-all duration-500">
                        Investigate Signal
                      </span>
                      <div className="w-16 h-px bg-zinc-100 group-hover:w-32 group-hover:bg-zinc-900 transition-all duration-700" />
                   </a>
                </div>
             </motion.div>

             <div className="space-y-16 md:space-y-24 md:pt-32">
                {annotations?.map((note, i) => (
                  <motion.div 
                    key={i}
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      show: { 
                        opacity: 1, 
                        y: 0, 
                        transition: { 
                          delay: 0.8 + (0.4 * i), // Significant staggered delay for annotations
                          duration: 1.5, 
                          ease: [0.16, 1, 0.3, 1] 
                        } 
                      }
                    }}
                    className="space-y-4 relative group max-w-sm"
                  >
                    <div className="flex items-center gap-4">
                       <div className="w-2 h-2 border border-zinc-100 rounded-sm group-hover:bg-zinc-900 transition-all duration-500" />
                       <span className="text-[8px] font-mono uppercase tracking-[0.4em] text-zinc-300 block">trace_v{i+1}</span>
                    </div>
                    <p className="text-sm md:text-base font-light text-zinc-500 leading-relaxed md:leading-[1.7] pl-6 border-l border-zinc-100 group-hover:border-zinc-300 transition-all duration-500">
                      {note}
                    </p>
                    <div className="absolute -left-6 top-0 text-[6px] font-mono text-zinc-200 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-x-2 group-hover:translate-x-0">
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
      observation: "Scams don’t exploit code first. They exploit emotional urgency to bypass digital trust.",
      metadata: "SCAM_PSYCHOLOGY_01",
      annotations: [
        "Urgency as a proxy for digital trust.",
        "The psychological cost of the 'Red Label'.",
        "Design as a weapon of misdirection."
      ]
    },
    {
      id: "TRC-04",
      timestamp: "June 2026",
      title: "Signals and Comfort",
      observation: "Unearned familiarity is the primary vulnerability in behavioral triggers.",
      metadata: "SYSTEM_BEHAVIOR_04",
      annotations: [
        "The 'Green Padlock' fallacy in trust systems.",
        "Legacy UI patterns used in modern behavioral triggers.",
        "Human-centered insecurity."
      ]
    },
    {
      id: "TRC-09",
      timestamp: "July 2026",
      title: "The Silent Watcher",
      observation: "Every tracked pixel alters the signal trace of systemic ambiguity.",
      metadata: "SIGNAL_INTERFERENCE_09",
      annotations: [
        "Metrics as reality distortion.",
        "Privacy as an endangered architectural choice.",
        "The observer's paradox in digital space."
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
        <div className="max-w-7xl mx-auto px-8 mb-64 md:mb-[50vh] relative">
          {/* Investigative Trace Background (Desktop Only) */}
          <div className="absolute top-0 right-0 hidden lg:block opacity-[0.4]">
             <span className="text-[150px] font-bold text-zinc-50 font-mono select-none tracking-tighter">02</span>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-16 md:space-y-32 relative"
          >
             <div className="flex flex-col md:flex-row md:items-center gap-6">
                <span className="text-[10px] uppercase tracking-[0.8em] text-zinc-400 font-black block">Signal Archive</span>
                <div className="hidden md:block w-px h-16 bg-zinc-100" />
                <div className="flex items-center gap-4">
                  <span className="text-[9px] font-mono text-zinc-300">ACCESS_GRANTED://ROOT</span>
                  <div className="w-2 h-2 rounded-full bg-zinc-100 animate-pulse" />
                </div>
             </div>
             
             <div className="relative">
               <h3 className="text-[clamp(2.5rem,9vw,11rem)] font-light tracking-tight text-zinc-900 leading-[0.85] max-w-7xl relative z-10">
                 <span className="block mb-4 md:mb-0">Investigation is a</span> 
                 <span className="block md:ml-[12vw] mb-4 md:mb-0">quiet act.</span> 
                 <span className="text-zinc-400 italic block md:ml-[28vw]">Noticing patterns.</span>
               </h3>

               {/* Anchor Annotation Fragments */}
               <motion.div 
                 initial={{ opacity: 0 }}
                 whileInView={{ opacity: 0.3 }}
                 transition={{ delay: 1, duration: 2 }}
                 className="absolute -top-12 left-0 hidden md:flex items-center gap-3"
               >
                 <div className="w-1 h-1 rounded-full bg-zinc-300" />
                 <span className="text-[8px] font-mono text-zinc-300 uppercase tracking-[0.4em]">act_ii_entry.trace</span>
               </motion.div>
             </div>

             <div className="max-w-md pt-8 md:ml-[32vw] border-l border-zinc-100 pl-8 md:pl-12 space-y-8">
                <p className="text-[11px] md:text-sm font-light text-zinc-500 leading-[2] uppercase tracking-[0.25em]">
                  A documented exploration <br />
                  of <span className="inline-block whitespace-nowrap text-zinc-900 font-medium italic">digital trust</span>, <span className="inline-block whitespace-nowrap text-zinc-900 font-medium">behavioral triggers</span>, <br />
                  and <span className="inline-block whitespace-nowrap text-zinc-900 font-medium">systemic ambiguity</span>.
                </p>

                <div className="flex items-center gap-4 opacity-70 transition-opacity hover:opacity-100">
                   <div className="w-8 h-px bg-zinc-200" />
                   <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest italic font-bold">Trace // 2026.05.21</span>
                </div>
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

