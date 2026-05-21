import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

const NarrativeStep = ({ text, delay, duration = 2 }: { text: string; delay: number; duration?: number }) => (
  <motion.p
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ 
      duration, 
      delay, 
      ease: [0.22, 1, 0.36, 1] 
    }}
    className="text-2xl md:text-3xl font-light tracking-tight text-zinc-400 absolute w-full text-center"
  >
    {text}
  </motion.p>
);

export const CinematicHero: React.FC = () => {
  const [step, setStep] = useState(0); // Start at 0 for initial ambient silence
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.01]); // Even more subtle scale
  const blurValue = useTransform(scrollYProgress, [0, 0.6], [0, 4]); // Reduced Max Blur
  const signalClarity = useTransform(scrollYProgress, [0, 0.5], [0.03, 0.15]);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 4000), // Step 1: Initial silence extended to 4s
      setTimeout(() => setStep(2), 15000), // Gap of 11s
      setTimeout(() => setStep(3), 26000), // Gap of 11s
      setTimeout(() => setStep(4), 40000), // Gap of 14s (Significant pause before reveal)
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div ref={containerRef} className="relative h-[250vh] w-full bg-[#fbfbf9] overflow-hidden">
      {/* Cinematic Background Atmosphere (The Noise) */}
      <motion.div 
        style={{ scale, filter: useTransform(blurValue, (v) => `blur(${v}px)`) }}
        className="fixed inset-0 z-0 pointer-events-none"
      >
        {/* Deep Ambient Layers */}
        <div 
          className="absolute inset-0 opacity-[0.35] blur-[150px]"
          style={{
            background: 'radial-gradient(circle at 15% 15%, #f1f5f9 0%, transparent 70%), radial-gradient(circle at 85% 85%, #fefce8 0%, transparent 70%)'
          }}
        />
        
        {/* Drifting Light Fields - Decelerated for stillness */}
        <motion.div 
          animate={{ 
            x: [0, 10, -5, 0], 
            y: [0, -5, 10, 0],
          }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-[0.25] blur-[180px]"
          style={{
            background: 'radial-gradient(circle at 50% 50%, #eff6ff 0%, transparent 60%)'
          }}
        />

        {/* Signal Fragments (Midground) */}
        <motion.div 
          style={{ opacity: signalClarity }}
          className="absolute inset-0 flex items-center justify-center overflow-hidden"
        >
          <div className="w-full h-full noise-texture mix-blend-overlay scale-150 rotate-12" />
        </motion.div>
        
        {/* Surface Texture */}
        <div className="absolute inset-0 noise-texture opacity-[0.05]" />
      </motion.div>

      {/* Narrative Sequence (Foreground) */}
      <motion.div 
        style={{ opacity }}
        className="fixed inset-0 z-10 flex flex-col items-center justify-center px-8"
      >
        <div className="relative w-full max-w-5xl h-64 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="s1"
                initial={{ opacity: 0, filter: 'blur(10px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(10px)' }}
                transition={{ duration: 4, ease: [0.22, 1, 0.36, 1] }}
                className="absolute w-full text-center"
              >
                <p className="text-3xl md:text-5xl font-light tracking-tight text-zinc-800/80 leading-tight">
                  The internet remembers everything.
                </p>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div
                key="s2"
                initial={{ opacity: 0, filter: 'blur(10px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(10px)' }}
                transition={{ duration: 4, ease: [0.22, 1, 0.36, 1] }}
                className="absolute w-full text-center"
              >
                <p className="text-3xl md:text-5xl font-light tracking-tight text-zinc-800/80 leading-tight">
                  Most people ignore the signals.
                </p>
              </motion.div>
            )}
            {step === 3 && (
              <motion.div
                key="s3"
                initial={{ opacity: 0, filter: 'blur(10px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(10px)' }}
                transition={{ duration: 4, ease: [0.22, 1, 0.36, 1] }}
                className="absolute w-full text-center"
              >
                <p className="text-3xl md:text-5xl font-light tracking-tight text-zinc-800/80 leading-tight">
                  I couldn’t.
                </p>
              </motion.div>
            )}
            {step === 4 && (
              <motion.div
                key="identity"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 4, ease: "easeOut" }}
                className="text-center"
              >
                <div className="overflow-hidden mb-8">
                  <motion.h1
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
                    className="text-6xl md:text-9xl font-bold tracking-[ -0.04em] uppercase text-zinc-900 leading-[0.85]"
                  >
                    Caroline <br /> Ratuolivia
                  </motion.h1>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5, duration: 2 }}
                  className="space-y-4"
                >
                  <div className="w-12 h-px bg-zinc-200 mx-auto opacity-50" />
                  <motion.p 
                    animate={{ 
                      opacity: [0.4, 0.35, 0.4, 0.2, 0.4],
                      x: [0, -1, 0, 1, 0],
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity, 
                      repeatType: "reverse",
                      times: [0, 0.45, 0.5, 0.51, 1],
                      ease: "linear" 
                    }}
                    className="text-xs md:text-sm uppercase tracking-[0.5em] font-medium text-zinc-400 select-none"
                  >
                    building thoughtful things for a noisy internet
                  </motion.p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Cinematic Scroll Indicator */}
        {step === 4 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4.5, duration: 3 }}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6"
          >
            <div className="relative group interactive">
               <span className="text-[10px] uppercase tracking-[0.6em] text-zinc-400 font-bold block transition-all group-hover:tracking-[0.8em]">Scroll</span>
            </div>
            <motion.div 
              animate={{ height: [24, 48, 24], translateY: [0, 8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-px bg-gradient-to-b from-zinc-300 to-transparent" 
            />
          </motion.div>
        )}
      </motion.div>

      {/* Act 1 Transition Space */}
      <div className="h-screen w-full flex items-end justify-center pb-24">
         <motion.div 
           style={{ opacity: scrollYProgress }}
           className="w-full max-w-4xl px-8"
         >
           <div className="h-px w-full bg-zinc-100" />
         </motion.div>
      </div>
    </div>
  );
};

