import React, { useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

interface ObservationProps {
  title: string;
  observation: string;
  metadata: string;
  index: number;
}

const ObservationFragment: React.FC<ObservationProps> = ({ title, observation, metadata, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0, 1, 1, 0]);
  const blur = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [20, 0, 0, 10]);
  const y = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [100, 0, 0, -100]);
  const scale = useTransform(scrollYProgress, [0.3, 0.5], [0.95, 1]);

  return (
    <motion.div 
      ref={ref}
      style={{ opacity, filter: useTransform(blur, (v) => `blur(${v}px)`), y, scale }}
      className="min-h-screen flex flex-col items-center justify-center py-24 px-8 md:px-24 mb-[20vh]"
    >
      <div className="max-w-4xl w-full space-y-12 relative">
        {/* Fragment Metadata */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="absolute -top-16 left-0 flex items-center gap-4 group"
        >
          <div className="w-8 h-px bg-zinc-200" />
          <span className="text-[9px] font-mono uppercase tracking-[0.4em] text-zinc-300 group-hover:text-zinc-500 transition-colors">
            {metadata}
          </span>
        </motion.div>

        {/* Observation Title */}
        <div className="space-y-4">
          <span className="text-[10px] uppercase tracking-[0.6em] text-zinc-400 font-extrabold block">
            Observation {index.toString().padStart(2, '0')}
          </span>
          <h2 className="text-4xl md:text-7xl font-medium tracking-tight leading-[0.9] text-zinc-900">
            {title}
          </h2>
        </div>

        {/* Observation Body */}
        <div className="max-w-2xl ml-auto md:ml-24">
          <p className="text-xl md:text-3xl font-light text-zinc-500 leading-relaxed italic">
            "{observation}"
          </p>
        </div>

        {/* Subtle Anchor Point */}
        <div className="absolute -bottom-12 right-0 w-1.5 h-1.5 rounded-full border border-zinc-200 opacity-50" />
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

  const gridOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 0.05, 0.05, 0]);

  const observations = [
    {
      title: "The Architecture of Trust",
      observation: "Most scams don’t exploit technology first. They exploit urgency. Interfaces create permission before they create value.",
      metadata: "SCAM_PSYCHOLOGY_01"
    },
    {
      title: "Signals and Comfort",
      observation: "Most users don’t read technical signals. They read comfort. If an interface feels familiar, it is assumed to be safe. Familiarity is a vulnerability.",
      metadata: "SYSTEM_BEHAVIOR_04"
    },
    {
      title: "The Silent Watcher",
      observation: "Observation is not passive. Every pixel that tracks an gaze changes the behavior it was meant to measure. The internet is a hall of mirrors.",
      metadata: "SIGNAL_INTERFERENCE_09"
    }
  ];

  return (
    <section ref={containerRef} className="relative bg-[#fbfbf9] z-20">
      {/* Investigative Grid Overlay */}
      <motion.div 
        style={{ opacity: gridOpacity }}
        className="fixed inset-0 pointer-events-none z-0"
      >
        <div className="absolute inset-0" 
             style={{ 
               backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', 
               backgroundSize: '40px 40px' 
             }} 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#fbfbf9] via-transparent to-[#fbfbf9]" />
      </motion.div>

      <div className="relative z-10 pt-48">
        <div className="max-w-4xl mx-auto px-8 mb-48">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 }}
            className="space-y-8"
          >
             <span className="text-[10px] uppercase tracking-[0.8em] text-zinc-300 font-bold block">Act II</span>
             <h3 className="text-4xl md:text-5xl font-light tracking-tight text-zinc-900 leading-tight">
               Investigation is a quiet act. <br />
               <span className="text-zinc-400">Noticing patterns in the noise.</span>
             </h3>
          </motion.div>
        </div>

        {observations.map((obs, i) => (
          <ObservationFragment 
            key={i} 
            index={i + 1}
            title={obs.title} 
            observation={obs.observation} 
            metadata={obs.metadata}
          />
        ))}

        {/* Transition Out */}
        <div className="h-[50vh] flex items-center justify-center">
           <div className="w-px h-24 bg-gradient-to-b from-zinc-200 to-transparent" />
        </div>
      </div>
    </section>
  );
};
