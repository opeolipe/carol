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
  const [step, setStep] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const blur = useTransform(scrollYProgress, [0, 0.8], [0, 5]);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(2), 3000), // "Most people ignore the signals."
      setTimeout(() => setStep(3), 6000), // "I couldn’t."
      setTimeout(() => setStep(4), 9000), // Reveal identity
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div ref={containerRef} className="relative h-[200vh] w-full bg-[#fdfdfd] overflow-hidden">
      {/* Cinematic Background Atmosphere */}
      <motion.div 
        style={{ scale, filter: `blur(${blur}px)` }}
        className="fixed inset-0 z-0"
      >
        {/* Layered Floating Gradients - Soft and subtle for light mode */}
        <div 
          className="absolute inset-0 opacity-40 blur-[120px]"
          style={{
            background: 'radial-gradient(circle at 15% 25%, #f1f5f9 0%, transparent 45%), radial-gradient(circle at 85% 75%, #f8fafc 0%, transparent 45%)'
          }}
        />
        <motion.div 
          animate={{ 
            x: [0, 15, -10, 0], 
            y: [0, -10, 20, 0],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-30 blur-[140px]"
          style={{
            background: 'radial-gradient(circle at 55% 45%, #eff6ff 0%, transparent 40%)'
          }}
        />
        
        {/* Grain/Noise Overlay */}
        <div className="absolute inset-0 noise-texture" />
      </motion.div>

      {/* Narrative Sequence */}
      <motion.div 
        style={{ opacity }}
        className="fixed inset-0 z-10 flex flex-col items-center justify-center px-6"
      >
        <div className="relative w-full max-w-4xl h-32 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.p
                key="s1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                className="text-2xl md:text-4xl font-light tracking-tight text-zinc-800 absolute w-full text-center"
              >
                The internet remembers everything.
              </motion.p>
            )}
            {step === 2 && (
              <motion.p
                key="s2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                className="text-2xl md:text-4xl font-light tracking-tight text-zinc-800 absolute w-full text-center"
              >
                Most people ignore the signals.
              </motion.p>
            )}
            {step === 3 && (
              <motion.p
                key="s3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                className="text-2xl md:text-4xl font-light tracking-tight text-zinc-800 absolute w-full text-center"
              >
                I couldn’t.
              </motion.p>
            )}
            {step === 4 && (
              <motion.div
                key="identity"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2.5, ease: "easeOut" }}
                className="text-center"
              >
                <h1 className="text-6xl md:text-9xl font-bold tracking-tighter uppercase mb-6 text-zinc-900 overflow-hidden">
                  <motion.span
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                    className="block"
                  >
                    Caroline Ratuolivia
                  </motion.span>
                </h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 1.5 }}
                  className="text-xs md:text-sm uppercase tracking-[0.4em] font-medium text-zinc-400"
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
            transition={{ delay: 3, duration: 2 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
          >
            <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Scroll to explore</span>
            <div className="w-px h-12 bg-gradient-to-b from-zinc-200 to-transparent" />
          </motion.div>
        )}
      </motion.div>

      {/* Spacer for transition */}
      <div className="h-screen" />
    </div>
  );
};

