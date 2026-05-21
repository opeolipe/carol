import React, { useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

export const Act3Section: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  // Global temporal breathing room - slow transitions with deeper silence and "hesitant" recovery
  const opacity = useTransform(scrollYProgress, [0, 0.08, 0.42, 0.47, 0.5, 0.53, 0.58, 0.92, 1], [0, 1, 1, 0.82, 0.92, 0.85, 1, 1, 0]);
  const blur = useTransform(scrollYProgress, [0, 0.05, 0.46, 0.49, 0.51, 0.54, 0.9, 1], [15, 0, 3, 5, 2, 0, 0, 15]);

  // Scene triggers - emphasizing longer stillness intervals and psychological shifts
  const thresholdOpacity = useTransform(scrollYProgress, [0, 0.1, 0.25, 0.35], [0, 1, 1, 0]);
  const pivotOpacity = useTransform(scrollYProgress, [0.4, 0.48, 0.58, 0.7], [0, 1, 1, 0]);
  
  return (
    <section 
      ref={sectionRef} 
      className="relative min-h-[350vh] bg-[#fdfdfc] z-30" // Increased height for slower pacing
    >
      {/* Soft Cinematic Atmosphere - Interrupted */}
      <motion.div 
        style={{ opacity, filter: useTransform(blur, (v) => `blur(${v}px)`) }}
        className="fixed inset-0 pointer-events-none z-0"
      >
        <div className="absolute inset-0 bg-[#fdfdfc]" />
        <motion.div 
          style={{ 
            scale: useTransform(scrollYProgress, [0, 1], [1, 1.1]),
            opacity: useTransform(scrollYProgress, [0.4, 0.5, 0.6], [0.02, 0.04, 0.02])
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180vw] h-[180vh] grayscale"
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
              y: useTransform(scrollYProgress, [0, 0.2], [10, 0]),
              x: useTransform(scrollYProgress, [0.1, 0.15, 0.2], [0, 2, 0]) // Tiny stutter
            }}
            className="flex flex-col items-center"
          >
             <div className="w-px h-20 bg-gradient-to-b from-transparent via-zinc-100 to-transparent" />
             <span className="mt-8 text-[8px] uppercase tracking-[1.2em] text-zinc-300 font-black ml-[1.2em]">Act III</span>
          </motion.div>
        </div>

        {/* Scene 2: The Pivot (The emotional threshold) */}
        <div className="h-screen flex flex-col items-center justify-center sticky top-0 px-6 md:px-8">
          <motion.div 
            style={{ 
              opacity: pivotOpacity,
              scale: useTransform(scrollYProgress, [0.35, 0.45, 0.55, 0.65], [0.99, 1, 1, 1.01]),
              y: useTransform(scrollYProgress, [0.4, 0.5, 0.6], [0, -4, 0]) // Subtle instability
            }}
            className="max-w-6xl w-full flex flex-col items-center space-y-12 md:space-y-16"
          >
            <div className="space-y-2 text-center mb-10 md:mb-12">
               <span className="text-[8px] font-mono text-zinc-300 uppercase tracking-[0.4em]">trc_int_01</span>
            </div>

            <h3 className="text-[clamp(1.6rem,4.5vw,3rem)] font-light tracking-tighter text-zinc-900 leading-[1] text-center max-w-2xl px-4">
              <span className="block mb-6 opacity-10">At some point,</span>
              <span className="block">the noise stopped</span>
              <span className="block md:ml-[6vw] text-zinc-400 italic">
                feeling <span className="inline-block whitespace-nowrap text-zinc-800 not-italic font-normal">external.</span>
              </span>
            </h3>

            {/* Visual Rupture: Displacement moment - almost subconscious instability */}
            <motion.div 
               style={{ 
                 opacity: useTransform(scrollYProgress, [0.5, 0.53, 0.58, 0.6, 0.65], [0, 0.03, 0.04, 0.015, 0]),
                 x: useTransform(scrollYProgress, [0.5, 0.52, 0.55, 0.58, 0.63], [0, 2, -1, 1, 0]),
                 filter: useTransform(scrollYProgress, [0.5, 0.55, 0.6], ["blur(0px)", "blur(2px)", "blur(0px)"])
               }}
               className="pointer-events-none select-none text-[5vw] font-black text-zinc-950/[0.012] uppercase tracking-tighter"
            >
              SIGNAL_DRIFT
            </motion.div>

            <div className="pt-24 md:pt-32 opacity-[0.05]">
               <div className="w-px h-40 bg-zinc-900 mx-auto" />
            </div>
          </motion.div>
        </div>

        {/* Scene 3: Internal Fragments (Reduced and Interrupted) */}
        <div className="min-h-[150vh] py-[15vh] md:py-[20vh] px-8 md:px-24 flex flex-col items-center">
          <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24 relative">
            
            {/* The Spine of Interruption */}
            <div className="hidden lg:block lg:col-span-1 border-l border-zinc-100 relative h-full">
               <motion.div 
                 style={{ height: useTransform(scrollYProgress, [0.75, 0.95], ["0%", "100%"]) }}
                 className="absolute top-0 left-[-1px] w-[1px] bg-zinc-300 opacity-[0.15]"
               />
            </div>

            <div className="lg:col-span-11 space-y-[20vh] md:space-y-[25vh] pb-[5vh] md:pb-[10vh]">
              <InternalFragment 
                id="INT-05" 
                title="Shift."
                text="The mapping failed. Signals refused to isolate." 
                annotation="trace_int: signal_drift"
              />
            </div>
          </div>
        </div>

        {/* Closing Breath (Decisive Recovery transition to Act 4) */}
         <div className="h-[45vh] flex flex-col items-center justify-center px-8 text-center bg-white relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6 md:space-y-8"
            >
               <div className="space-y-4">
                 <motion.div 
                    animate={{ scaleY: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-px h-12 bg-zinc-950/20 mx-auto" 
                 />
                 <span className="text-[9px] uppercase tracking-[0.6em] text-zinc-500 font-black block">Restore Signal</span>
               </div>
               
               <div className="max-w-xs mx-auto">
                  <p className="text-[9px] text-zinc-300 font-medium leading-relaxed uppercase tracking-[0.25em]">
                    The investigation persists.
                  </p>
               </div>
            </motion.div>
         </div>
      </div>
    </section>
  );
};

interface InternalProps {
  id: string;
  title: string;
  text: React.ReactNode;
  annotation: string;
  align?: 'left' | 'right';
}

const InternalFragment: React.FC<InternalProps> = ({ id, title, text, annotation, align = 'left' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.42, 0.58, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.45, 0.55, 1], [30, 0, 0, -30]);
  
  // Interaction Instability: Non-linear hesitant drift
  const drift = useTransform(
    scrollYProgress, 
    [0, 0.22, 0.38, 0.5, 0.62, 0.78, 1], 
    [
      align === 'right' ? 12 : -12, 
      align === 'right' ? 6 : -6, 
      align === 'right' ? 1 : -1, // Subconscious hesitation point
      0, 
      align === 'right' ? -1 : 1, 
      align === 'right' ? -6 : 6, 
      align === 'right' ? -12 : 12
    ]
  );
  
  const skew = useTransform(scrollYProgress, [0.15, 0.45, 0.55, 0.85], [align === 'right' ? 0.6 : -0.6, 0, 0, align === 'right' ? -0.5 : 0.5]);

  return (
    <motion.div 
      ref={ref}
      style={{ 
        opacity, 
        y, 
        x: drift, 
        skewY: skew,
        transition: { duration: 1.8, ease: [0.22, 1, 0.36, 1] } // Even softer response
      }}
      className={`relative w-full flex ${align === 'right' ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-lg space-y-6 md:space-y-8 ${align === 'right' ? 'text-right' : 'text-left'}`}>
        {/* Level 3: Metadata */}
        <motion.div 
          style={{ x: useTransform(scrollYProgress, [0.35, 0.5], [8, 0]) }}
          className={`flex items-center gap-4 md:gap-6 ${align === 'right' ? 'flex-row-reverse' : ''}`}
        >
           <span className="text-[8px] font-mono text-zinc-100 tracking-[0.4em] uppercase">{id}</span>
           <div className="w-6 h-px bg-zinc-50" />
           <span className="text-[8px] font-mono text-zinc-200 uppercase tracking-widest">{annotation}</span>
        </motion.div>

        {/* Level 2: Secondary Reflection */}
        <div className="space-y-4 md:space-y-6">
          <h5 className="text-[clamp(1.1rem,2.2vw,1.8rem)] font-light text-zinc-900 leading-tight tracking-tight uppercase">
            {title}
          </h5>
          
          {/* Level 4: Detail Fragment */}
          <div className="max-w-md">
            <p className="text-[12px] md:text-sm font-light text-zinc-400 leading-[1.6] tracking-wide">
               {text}
            </p>
          </div>
        </div>

        {/* Intimate Trace */}
        <div className={`flex flex-col ${align === 'right' ? 'items-end' : 'items-start'} space-y-3 pt-3 opacity-[0.2]`}>
           <div className="w-px h-10 bg-zinc-100" />
           <span className="text-[7px] font-mono text-zinc-200 uppercase tracking-tighter">[ TRACE_REC_INTERNAL ]</span>
        </div>
      </div>
    </motion.div>
  );
};

