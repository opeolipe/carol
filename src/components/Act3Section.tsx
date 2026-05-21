import React, { useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

export const Act3Section: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  // Global temporal breathing room - slow transitions
  const opacity = useTransform(scrollYProgress, [0, 0.05, 0.9, 1], [0, 1, 1, 0]);
  const blur = useTransform(scrollYProgress, [0, 0.05, 0.9, 1], [10, 0, 0, 10]);

  // Scene triggers
  const thresholdOpacity = useTransform(scrollYProgress, [0, 0.1, 0.2, 0.3], [0, 1, 1, 0]);
  const pivotOpacity = useTransform(scrollYProgress, [0.3, 0.4, 0.6, 0.7], [0, 1, 1, 0]);
  
  return (
    <section 
      ref={sectionRef} 
      className="relative min-h-[450vh] bg-[#fdfdfc] z-30"
    >
      {/* Soft Cinematic Atmosphere */}
      <motion.div 
        style={{ opacity, filter: useTransform(blur, (v) => `blur(${v}px)`) }}
        className="fixed inset-0 pointer-events-none z-0"
      >
        <div className="absolute inset-0 bg-[#fdfdfc]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180vw] h-[180vh] opacity-[0.03] grayscale"
             style={{ 
               background: 'radial-gradient(circle at 50% 50%, #71717a 0%, transparent 70%)' 
             }} 
        />
      </motion.div>

      <div className="relative z-10">
        
        {/* Scene 1: The Threshold (Stillness) */}
        <div className="h-screen flex flex-col items-center justify-center sticky top-0 px-8">
          <motion.div 
            style={{ 
              opacity: thresholdOpacity,
              y: useTransform(scrollYProgress, [0, 0.2], [10, 0])
            }}
            className="flex flex-col items-center"
          >
             <div className="w-px h-24 bg-gradient-to-b from-transparent via-zinc-100 to-transparent" />
             <span className="mt-8 text-[9px] uppercase tracking-[1.5em] text-zinc-300 font-black ml-[1.5em]">Act III</span>
          </motion.div>
        </div>

        {/* Scene 2: The Pivot (The emotional threshold) */}
        <div className="h-screen flex flex-col items-center justify-center sticky top-0 px-8">
          <motion.div 
            style={{ 
              opacity: pivotOpacity,
              scale: useTransform(scrollYProgress, [0.3, 0.4, 0.6, 0.7], [0.98, 1, 1, 1.02])
            }}
            className="max-w-6xl w-full flex flex-col items-center space-y-16"
          >
            <div className="space-y-2 text-center mb-12">
               <span className="text-[9px] font-mono text-zinc-300 uppercase tracking-[0.5em]">trc_int_01</span>
            </div>

            <h3 className="text-[clamp(2.5rem,7vw,8rem)] font-light tracking-tighter text-zinc-900 leading-[0.85] text-center max-w-5xl">
              <span className="block mb-6 opacity-30">“At some point,”</span>
              <span className="block mb-6">the noise stopped</span>
              <span className="block md:ml-[15vw] text-zinc-400 italic">
                feeling <span className="inline-block whitespace-nowrap text-zinc-900 not-italic font-normal">external.</span>
              </span>
            </h3>

            <div className="pt-32 opacity-10">
               <div className="w-px h-48 bg-zinc-900 mx-auto" />
            </div>
          </motion.div>
        </div>

        {/* Scene 3: Reconstruction Fragments (Shortened/Interrupted) */}
        <div className="min-h-[200vh] py-[25vh] px-8 md:px-24 flex flex-col items-center">
          <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-24 relative">
            
            {/* The Spine of Recalibration */}
            <div className="hidden lg:block lg:col-span-1 border-l border-zinc-100 relative h-full">
               <motion.div 
                 style={{ height: useTransform(scrollYProgress, [0.7, 0.9], ["0%", "100%"]) }}
                 className="absolute top-0 left-[-1px] w-[1px] bg-zinc-400 opacity-30"
               />
            </div>

            <div className="lg:col-span-11 space-y-[80vh] pb-[20vh]">
              <ReconstructionFragment 
                id="RE-09" 
                title="Pressure reveals structure."
                text={<>When systems break, they show you exactly how they were joined. <br /><span className="text-zinc-400 font-light">I started paying attention to what breaks first.</span></>}
                annotation="trace_internal: recalibration"
                align="right"
              />

              <ReconstructionFragment 
                id="RE-12" 
                title="Building differently."
                text="The investigation didn't stop. It just became private. From now on, clarity is a slow rebuild." 
                annotation="trace_internal: reconstruction"
              />
            </div>
          </div>
        </div>

        {/* Closing Breath (Fade to Act 4 readiness) */}
        <div className="h-screen flex flex-col items-center justify-center px-8 text-center bg-white relative z-20">
           <motion.div
             initial={{ opacity: 0, y: 15 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 4, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
             className="space-y-16"
           >
              <div className="space-y-6">
                <div className="w-px h-24 bg-gradient-to-b from-zinc-100 to-transparent mx-auto" />
                <span className="text-[10px] uppercase tracking-[1.2em] text-zinc-950 font-black block ml-[1.2em]">Recalibrating</span>
              </div>
              
              <div className="max-w-xs mx-auto">
                 <p className="text-[11px] text-zinc-400 font-light leading-[2.2] uppercase tracking-[0.3em]">
                   Observation persists <br /> 
                   in the way things are made.
                 </p>
              </div>
           </motion.div>
        </div>
      </div>
    </section>
  );
};

interface ReconstructionProps {
  id: string;
  title: string;
  text: React.ReactNode;
  annotation: string;
  align?: 'left' | 'right';
}

const ReconstructionFragment: React.FC<ReconstructionProps> = ({ id, title, text, annotation, align = 'left' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.35, 0.6, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.35, 0.6, 1], [40, 0, 0, -40]);
  
  // Subtle instability - drifting horizontally during arrival/exit
  const drift = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [align === 'right' ? 20 : -20, 0, 0, align === 'right' ? -10 : 10]);

  return (
    <motion.div 
      ref={ref}
      style={{ opacity, y, x: drift }}
      className={`relative w-full flex ${align === 'right' ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-2xl space-y-12 ${align === 'right' ? 'text-right' : 'text-left'}`}>
        {/* Level 3: Metadata */}
        <motion.div 
          style={{ x: useTransform(scrollYProgress, [0.3, 0.5], [10, 0]) }}
          className={`flex items-center gap-6 ${align === 'right' ? 'flex-row-reverse' : ''}`}
        >
           <span className="text-[9px] font-mono text-zinc-300 tracking-[0.4em] uppercase">{id}</span>
           <div className="w-12 h-px bg-zinc-50" />
           <span className="text-[8px] font-mono text-zinc-400 uppercase tracking-widest">{annotation}</span>
        </motion.div>

        {/* Level 2: Secondary Reflection */}
        <div className="space-y-8">
          <h5 className="text-[clamp(1.5rem,3vw,2.5rem)] font-light text-zinc-900 leading-tight tracking-tight uppercase">
            {title}
          </h5>
          
          {/* Level 4: Detail Fragment */}
          <div className="max-w-lg">
            <p className="text-sm md:text-base font-light text-zinc-500 leading-[1.8] tracking-wide">
               {text}
            </p>
          </div>
        </div>

        {/* Intimate Trace */}
        <div className={`flex flex-col ${align === 'right' ? 'items-end' : 'items-start'} space-y-4 pt-4 opacity-40`}>
           <div className="w-px h-12 bg-zinc-100" />
           <span className="text-[8px] font-mono text-zinc-200 uppercase tracking-tighter">[ TRACE_REC_INTERNAL ]</span>
        </div>
      </div>
    </motion.div>
  );
};

