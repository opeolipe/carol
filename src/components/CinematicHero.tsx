import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';

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
  
  // Interaction Physics: Smooth Mouse Tracking
  const mouseX = useSpring(0, { stiffness: 20, damping: 40 });
  const mouseY = useSpring(0, { stiffness: 20, damping: 40 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]); 
  const blurValue = useTransform(scrollYProgress, [0, 0.6], [0, 8]); 
  const signalClarity = useTransform(scrollYProgress, [0, 0.5], [0.02, 0.15]);
  
  // Mobile Environmental Drift
  const mobileDrift = useTransform(scrollYProgress, [0, 1], [0, 40]);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 3000), 
      setTimeout(() => setStep(2), 9500), 
      setTimeout(() => setStep(3), 16000), 
      setTimeout(() => setStep(4), 22000), // Identity Reveal
      setTimeout(() => setStep(5), 26000), // Narrative Subtext
      setTimeout(() => setStep(6), 31000), // Interaction Hint
    ];

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);

  // Motion Hierarchy & Signal Gravity Values
  const ambientX = useTransform(mouseX, [-1, 1], [-15, 15]);
  const ambientY = useTransform(mouseY, [-1, 1], [-15, 15]);
  const driftX = useTransform(mouseX, [-1, 1], [10, -10]);
  const driftY = useTransform(mouseY, [-1, 1], [10, -10]);
  const typographyX = useTransform(mouseX, [-1, 1], [5, -5]);
  const typographyY = useTransform(mouseY, [-1, 1], [5, -5]);

  return (
    <div ref={containerRef} className="relative h-[250vh] w-full bg-[#fbfbf9] overflow-hidden">
      {/* Level 1: Deep Ambient Atmospherics (Steady) */}
      <motion.div 
        style={{ 
          scale, 
          filter: useTransform(blurValue, (v) => `blur(${v}px)`),
        }}
        className="fixed inset-0 z-0 pointer-events-none"
      >
        <motion.div 
          style={{ x: ambientX, y: ambientY }}
          className="absolute inset-0 opacity-[0.3] blur-[140px]"
          style={{
            background: 'radial-gradient(circle at 20% 20%, #f1f5f9 0%, transparent 60%), radial-gradient(circle at 80% 80%, #fefce8 0%, transparent 60%)'
          }}
        />
        
        {/* Level 2: Drifting Light Fields (Slow Secondary Motion) */}
        <motion.div 
          animate={{ 
            x: [0, 8, -4, 0], 
            y: [0, -4, 8, 0],
          }}
          transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
          style={{ x: driftX, y: driftY }}
          className="absolute inset-0 opacity-[0.2] blur-[160px]"
          style={{
            background: 'radial-gradient(circle at 50% 50%, #eff6ff 0%, transparent 50%)'
          }}
        />

        {/* Level 3: Midground Signal Fragments (Static Environment) */}
        <motion.div 
          style={{ 
            opacity: signalClarity,
            y: mobileDrift 
          }}
          className="absolute inset-0 flex items-center justify-center overflow-hidden"
        >
          <div className="w-full h-full noise-texture mix-blend-overlay scale-[1.7] rotate-6" />
        </motion.div>
        
        <div className="absolute inset-0 noise-texture opacity-[0.04]" />
      </motion.div>

      {/* Narrative Sequence Foreground */}
      <motion.div 
        style={{ opacity }}
        className="fixed inset-0 z-10 flex flex-col items-center justify-center px-8"
      >
        <div className="relative w-full max-w-5xl h-64 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="s1"
                initial={{ opacity: 0, filter: 'blur(8px)', y: 15 }}
                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                exit={{ opacity: 0, filter: 'blur(8px)', y: -15 }}
                transition={{ duration: 4, ease: [0.22, 1, 0.36, 1] }}
                className="absolute w-full text-center px-6"
              >
                <p className="text-xl md:text-2xl font-light tracking-tight text-zinc-800/40 leading-tight">
                  <span className="inline-block whitespace-nowrap">The internet</span> <br className="md:hidden" />
                  <span className="inline-block whitespace-nowrap">remembers everything.</span>
                </p>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div
                key="s2"
                initial={{ opacity: 0, filter: 'blur(8px)', y: 15 }}
                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                exit={{ opacity: 0, filter: 'blur(8px)', y: -15 }}
                transition={{ duration: 4, ease: [0.22, 1, 0.36, 1] }}
                className="absolute w-full text-center px-6"
              >
                <p className="text-xl md:text-2xl font-light tracking-tight text-zinc-800/40 leading-tight">
                  <span className="inline-block whitespace-nowrap">Most people ignore</span> <br className="md:hidden" />
                  <span className="inline-block whitespace-nowrap">the signals.</span>
                </p>
              </motion.div>
            )}
            {step === 3 && (
              <motion.div
                key="s3"
                initial={{ opacity: 0, filter: 'blur(8px)', y: 15 }}
                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                exit={{ opacity: 0, filter: 'blur(8px)', y: -15 }}
                transition={{ duration: 4, ease: [0.22, 1, 0.36, 1] }}
                className="absolute w-full text-center px-6"
              >
                <p className="text-xl md:text-2xl font-light tracking-tight text-zinc-800/40 leading-tight">
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
                  x: typographyX,
                  y: typographyY
                }}
                transition={{ duration: 3.5, ease: [0.22, 1, 0.36, 1] }}
                className="text-center group/hero"
              >
                <div className="overflow-hidden mb-4 md:mb-6">
                  <motion.h1
                    initial={{ y: "105%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 3, ease: [0.16, 1, 0.3, 1] }}
                    className="text-[clamp(1.8rem,8vw,5rem)] font-bold tracking-[-0.04em] uppercase text-zinc-900 leading-[0.85] transition-all duration-1000 group-hover/hero:tracking-[-0.02em]"
                  >
                    Caroline <br /> Ratuolivia
                  </motion.h1>
                </div>
                
                <AnimatePresence>
                  {step >= 5 && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
                      className="space-y-4 md:space-y-6"
                    >
                      <div className="w-8 md:w-12 h-px bg-zinc-200 mx-auto opacity-30" />
                      <motion.p 
                        animate={{ 
                          opacity: [0.2, 0.3, 0.2],
                          x: [0, -0.3, 0.3, 0],
                        }}
                        transition={{ 
                          duration: 12, 
                          repeat: Infinity, 
                          ease: "linear" 
                        }}
                        className="text-[8px] md:text-[11px] uppercase tracking-[0.3em] md:tracking-[0.4em] font-medium text-zinc-400 select-none px-6 md:px-0"
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-12 md:bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 md:gap-6"
            >
              <div className="relative group interactive cursor-pointer">
                 <span className="text-[8px] md:text-[9px] uppercase tracking-[0.4em] md:tracking-[0.6em] text-zinc-400 font-bold block transition-all group-hover:tracking-[0.8em] group-hover:text-zinc-600">Scroll</span>
                 <motion.div 
                   className="absolute -inset-4 bg-zinc-400/0 rounded-full blur-xl group-hover:bg-zinc-400/5 transition-all"
                   layoutId="scroll-glow"
                 />
              </div>
              <motion.div 
                animate={{ height: [24, 44, 24], translateY: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
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


