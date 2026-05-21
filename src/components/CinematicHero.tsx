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
  
  // Interaction Physics: Slow, deliberate, and intelligent tracking
  const mouseXTarget = useRef(0);
  const mouseYTarget = useRef(0);
  const mouseX = useSpring(0, { stiffness: 8, damping: 60 });
  const mouseY = useSpring(0, { stiffness: 8, damping: 60 });
  
  // Stillness Cycle Logic: Periodic dormancy in environmental reaction
  const [isDormant, setIsDormant] = useState(false);

  useEffect(() => {
    const cycle = setInterval(() => {
      setIsDormant(true);
      // Return to center during dormancy
      mouseX.set(0);
      mouseY.set(0);
      setTimeout(() => setIsDormant(false), 9000); // 9s of stillness
    }, 28000); // every 28s - longer silence
    return () => clearInterval(cycle);
  }, [mouseX, mouseY]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]); 
  const blurValue = useTransform(scrollYProgress, [0, 0.6], [0, 8]); 
  const signalClarity = useTransform(scrollYProgress, [0, 0.5], [0.02, 0.15]);
  
  // Mobile Environmental Response (Scroll & Gesture)
  const mobileDriftY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const mobileDriftX = useTransform(scrollYProgress, [0, 1], [0, 15]);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 3000), 
      setTimeout(() => setStep(2), 9500), 
      setTimeout(() => setStep(3), 16000), 
      setTimeout(() => setStep(4), 22000), 
      setTimeout(() => setStep(5), 26000), 
      setTimeout(() => setStep(6), 31000), 
    ];

    const handleMouseMove = (e: MouseEvent) => {
      if (isDormant) return;
      // Normalizing with softer range
      const x = (e.clientX / window.innerWidth - 0.5) * 1.2;
      const y = (e.clientY / window.innerHeight - 0.5) * 1.2;
      mouseX.set(x);
      mouseY.set(y);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDormant || !e.touches[0]) return;
      const x = (e.touches[0].clientX / window.innerWidth - 0.5) * 0.8;
      const y = (e.touches[0].clientY / window.innerHeight - 0.5) * 0.8;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [mouseX, mouseY, isDormant]);

  // Motion Hierarchy & Signal Gravity (Restrained Values)
  // Level 1: Deep Ambient (Reacts least)
  const ambientX = useTransform(mouseX, [-1, 1], [-8, 8]);
  const ambientY = useTransform(mouseY, [-1, 1], [-8, 8]);
  
  // Level 2: Drifting Fields (Secondary Motion)
  const driftX = useTransform(mouseX, [-1, 1], [15, -15]);
  const driftY = useTransform(mouseY, [-1, 1], [15, -15]);
  
  // Level 3: Foreground Typography (Direct Focus)
  const typographyX = useTransform(mouseX, [-1, 1], [4, -4]);
  const typographyY = useTransform(mouseY, [-1, 1], [4, -4]);

  return (
    <div ref={containerRef} className="relative h-[250vh] w-full bg-[#fbfbf9] overflow-hidden">
      {/* Level 0: Pure Backdrop (Dormant Background System) */}
      <div className="fixed inset-0 z-[-1] bg-[#fbfbf9]" />

      {/* Level 1: Deep Ambient Atmospherics (Steady Base) */}
      <motion.div 
        style={{ 
          scale, 
          filter: useTransform(blurValue, (v) => `blur(${v}px)`),
          x: ambientX,
          y: ambientY
        }}
        className="fixed inset-0 z-0 pointer-events-none"
      >
        <div 
          className="absolute inset-0 opacity-[0.25] blur-[150px]"
          style={{
            background: 'radial-gradient(circle at 15% 15%, #f1f5f9 0%, transparent 65%), radial-gradient(circle at 85% 85%, #fefce8 0%, transparent 65%)'
          }}
        />
        
        {/* Level 2: Drifting Light Fields (Mobile-Scroll Optimized) */}
        <motion.div 
          animate={isDormant ? { x: 0, y: 0 } : { 
            x: [0, 10, -5, 0], 
            y: [0, -5, 10, 0],
          }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          style={{ 
            x: driftX, 
            y: useTransform([driftY, mobileDriftY], ([dy, mdy]) => (dy as number) + (mdy as number) * 0.5) 
          }}
          className="absolute inset-0 opacity-[0.15] blur-[180px]"
          style={{
            background: 'radial-gradient(circle at 50% 50%, #eff6ff 0%, transparent 60%)'
          }}
        />

        {/* Level 3: Midground Signal Fragments (Physical Noise) */}
        <motion.div 
          style={{ 
            opacity: signalClarity,
            y: mobileDriftY,
            x: mobileDriftX,
            rotate: useTransform(scrollYProgress, [0, 1], [12, 18]) 
          }}
          className="absolute inset-0 flex items-center justify-center overflow-hidden"
        >
          <div className="w-full h-full noise-texture mix-blend-overlay scale-[1.8] opacity-30" />
        </motion.div>
        
        <div className="absolute inset-0 noise-texture opacity-[0.02]" />
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


