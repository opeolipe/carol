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
  const [step, setStep] = useState(0); 
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]); 
  const blurValue = useTransform(scrollYProgress, [0, 0.6], [0, 6]); 
  const signalClarity = useTransform(scrollYProgress, [0, 0.5], [0.02, 0.12]);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 2000), 
      setTimeout(() => setStep(2), 7000), 
      setTimeout(() => setStep(3), 12000), 
      setTimeout(() => setStep(4), 18000), // Name
      setTimeout(() => setStep(5), 21000), // Subtext
      setTimeout(() => setStep(6), 24000), // Scroll Hint
    ];

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative h-[250vh] w-full bg-[#fbfbf9] overflow-hidden">
      {/* Cinematic Background Atmosphere (The Noise) */}
      <motion.div 
        style={{ 
          scale, 
          filter: useTransform(blurValue, (v) => `blur(${v}px)`),
          x: mousePos.x * 0.5,
          y: mousePos.y * 0.5
        }}
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
                transition={{ duration: 3, ease: [0.22, 1, 0.36, 1] }}
                className="absolute w-full text-center px-6"
              >
                <p className="text-2xl md:text-3xl font-light tracking-tight text-zinc-800/60 leading-tight">
                  <span className="inline-block whitespace-nowrap">The internet</span> <br className="md:hidden" />
                  <span className="inline-block whitespace-nowrap">remembers everything.</span>
                </p>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div
                key="s2"
                initial={{ opacity: 0, filter: 'blur(10px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(10px)' }}
                transition={{ duration: 3, ease: [0.22, 1, 0.36, 1] }}
                className="absolute w-full text-center px-6"
              >
                <p className="text-2xl md:text-3xl font-light tracking-tight text-zinc-800/60 leading-tight">
                  <span className="inline-block whitespace-nowrap">Most people ignore</span> <br className="md:hidden" />
                  <span className="inline-block whitespace-nowrap">the signals.</span>
                </p>
              </motion.div>
            )}
            {step === 3 && (
              <motion.div
                key="s3"
                initial={{ opacity: 0, filter: 'blur(10px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(10px)' }}
                transition={{ duration: 3, ease: [0.22, 1, 0.36, 1] }}
                className="absolute w-full text-center px-6"
              >
                <p className="text-2xl md:text-3xl font-light tracking-tight text-zinc-800/60 leading-tight">
                  I couldn’t.
                </p>
              </motion.div>
            )}
            {step >= 4 && (
              <motion.div
                key="identity"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: 1,
                  x: mousePos.x * 0.2,
                  y: mousePos.y * 0.2
                }}
                transition={{ duration: 3, ease: "easeOut" }}
                className="text-center"
              >
                <div className="overflow-hidden mb-6 md:mb-8">
                  <motion.h1
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
                    className="text-[clamp(2.5rem,10vw,6rem)] font-bold tracking-[-0.04em] uppercase text-zinc-900 leading-[0.85]"
                  >
                    Caroline <br /> Ratuolivia
                  </motion.h1>
                </div>
                
                <AnimatePresence>
                  {step >= 5 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                      className="space-y-4 md:space-y-6"
                    >
                      <div className="w-8 md:w-12 h-px bg-zinc-200 mx-auto opacity-30" />
                      <motion.p 
                        animate={{ 
                          opacity: [0.3, 0.4, 0.3],
                          x: [0, -0.5, 0.5, 0],
                        }}
                        transition={{ 
                          duration: 8, 
                          repeat: Infinity, 
                          ease: "linear" 
                        }}
                        className="text-[9px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.4em] font-medium text-zinc-400 select-none px-6 md:px-0"
                      >
                        <span className="inline-block whitespace-nowrap">building thoughtful things</span> <br className="md:hidden" />
                        for a <span className="inline-block whitespace-nowrap">noisy internet</span>
                      </motion.p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Cinematic Scroll Indicator */}
        <AnimatePresence>
          {step >= 6 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 3 }}
              className="absolute bottom-12 md:bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 md:gap-6"
            >
              <div className="relative group interactive cursor-pointer">
                 <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] md:tracking-[0.6em] text-zinc-400 font-bold block transition-all group-hover:tracking-[0.8em]">Scroll</span>
              </div>
              <motion.div 
                animate={{ height: [20, 40, 20], translateY: [0, 6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-px bg-gradient-to-b from-zinc-300 to-transparent h-6 md:h-10" 
              />
            </motion.div>
          )}
        </AnimatePresence>
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

