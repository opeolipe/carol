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
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const blur = useTransform(scrollYProgress, [0, 0.8], [0, 10]);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 2000), // "The internet remembers everything."
      setTimeout(() => setStep(2), 5500), // "Most people ignore the signals."
      setTimeout(() => setStep(3), 9000), // "I couldn’t."
      setTimeout(() => setStep(4), 12500), // Reveal identity
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div ref={containerRef} className="relative h-[200vh] w-full bg-zinc-950 overflow-hidden">
      {/* Cinematic Background Atmosphere */}
      <motion.div 
        style={{ scale, filter: `blur(${blur}px)` }}
        className="fixed inset-0 z-0"
      >
        {/* Layered Floating Gradients */}
        <div 
          className="absolute inset-0 opacity-30 blur-[100px]"
          style={{
            background: 'radial-gradient(circle at 20% 30%, #1e1b4b 0%, transparent 50%), radial-gradient(circle at 80% 70%, #18181b 0%, transparent 50%)'
          }}
        />
        <motion.div 
          animate={{ 
            x: [0, 30, -20, 0], 
            y: [0, -20, 40, 0],
            rotate: [0, 2, -2, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-20 blur-[120px]"
          style={{
            background: 'radial-gradient(circle at 60% 40%, #1e293b 0%, transparent 40%)'
          }}
        />
        
        {/* Grain/Noise Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none noise-texture" />
      </motion.div>

      {/* Narrative Sequence */}
      <motion.div 
        style={{ opacity }}
        className="fixed inset-0 z-10 flex flex-col items-center justify-center px-6"
      >
        <div className="relative w-full max-w-4xl h-32 flex items-center justify-center">
          <AnimatePresence>
            {step === 1 && (
              <NarrativeStep key="s1" text="The internet remembers everything." delay={0} />
            )}
            {step === 2 && (
              <NarrativeStep key="s2" text="Most people ignore the signals." delay={0} />
            )}
            {step === 3 && (
              <NarrativeStep key="s3" text="I couldn’t." delay={0} />
            )}
            {step === 4 && (
              <motion.div
                key="identity"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 3, ease: "easeOut" }}
                className="text-center"
              >
                <h1 className="text-6xl md:text-9xl font-bold tracking-tighter uppercase mb-6 text-white overflow-hidden">
                  <motion.span
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    className="block"
                  >
                    Caroline Ratuolivia
                  </motion.span>
                </h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 2 }}
                  className="text-sm md:text-base uppercase tracking-[0.3em] font-light text-zinc-500"
                >
                  building thoughtful things for a noisy internet
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Scroll Indicator */}
        {step === 4 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4, duration: 2 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
          >
            <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-medium">Scroll to explore</span>
            <div className="w-px h-12 bg-gradient-to-b from-zinc-800 to-transparent" />
          </motion.div>
        )}
      </motion.div>

      {/* Spacer for transition */}
      <div className="h-screen" />
    </div>
  );
};
