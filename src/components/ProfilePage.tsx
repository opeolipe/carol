import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Metadata = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-1 border-t border-zinc-100 pt-4">
    <span className="text-[7px] font-mono uppercase tracking-[0.4em] text-zinc-300 font-bold">{label}</span>
    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">{value}</span>
  </div>
);

const DossierModule = ({ title, children, metadata, delay = 0 }: { title: string; children: React.ReactNode; metadata?: { label: string; value: string }[]; delay?: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-10% 0px" }}
    transition={{ duration: 1.5, delay, ease: [0.19, 1, 0.22, 1] }}
    className="space-y-8 pb-32 md:pb-48 last:pb-0"
  >
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-1.5 h-1.5 rounded-full bg-zinc-950" />
        <h3 className="text-[10px] font-mono uppercase tracking-[0.5em] text-zinc-400 font-black">{title}</h3>
      </div>
      <div className="pl-6 border-l border-zinc-50">
        <div className="text-[clamp(1.1rem,2.5vw,2rem)] font-light text-zinc-900 leading-relaxed md:leading-[1.6] tracking-tight">
          {children}
        </div>
      </div>
    </div>
    
    {metadata && (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pl-6">
        {metadata.map((m, i) => <Metadata key={i} {...m} />)}
      </div>
    )}
  </motion.div>
);

export const ProfilePage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0.02, 0.05, 0.05, 0.02]);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[var(--background)] selection:bg-zinc-900 selection:text-white pb-[20vh]">
      {/* Background System Grid */}
      <motion.div 
        style={{ opacity: backgroundOpacity }}
        className="fixed inset-0 pointer-events-none z-0"
      >
        <div className="w-full h-full" style={{ 
          backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
          backgroundSize: '100px 100px'
        }} />
      </motion.div>

      {/* Header / Identity Signal */}
      <div className="relative z-10 px-8 md:px-24 pt-32 md:pt-48 pb-32">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 2, ease: [0.19, 1, 0.22, 1] }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
             <div className="w-8 h-px bg-zinc-950" />
             <span className="text-[9px] font-mono uppercase tracking-[0.6em] text-zinc-950 font-black">System_Profile_v2.04</span>
             <div className="ml-auto flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] font-mono uppercase tracking-widest text-zinc-400">Authenticated_Session</span>
             </div>
          </div>
          <h1 className="text-[clamp(3rem,10vw,12rem)] font-bold tracking-tighter text-zinc-950 leading-[0.85] uppercase">
            Carol
          </h1>
          <div className="max-w-2xl pt-12">
            <p className="text-[clamp(1.2rem,2vw,2.4rem)] font-light text-zinc-400 leading-tight tracking-tight italic uppercase">
              RECOVERED Dossier: 
              <span className="text-zinc-600 ml-4">Behavioral patterns and investigative coordinates within the archive.</span>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Main Dossier Stream */}
      <div className="relative z-10 px-8 md:px-24">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <DossierModule 
            title="Observation Habits"
            metadata={[
              { label: "Frequency", value: "Constant" },
              { label: "Focus", value: "Edge_Cases" },
              { label: "Method", value: "Signal_Isolation" },
              { label: "Status", value: "Active" }
            ]}
          >
            A persistent tendency to ignore the center. I find myself navigating the margins of digital systems, looking for the moments where the design breaks or the logic loses its primary momentum. Observation is not passive; it is an active reorganization of available data points.
          </DossierModule>

          <DossierModule 
            title="Current Investigations"
            metadata={[
              { label: "Primary", value: "Memory_Fractures" },
              { label: "Secondary", value: "Silent_Signals" }
            ]}
          >
            I am currently tracing how algorithmic memory influences individual curiosity. The investigation focuses on why we return to certain digital spaces even when they offer no new information, and how the "feeling" of a system replaces its actual utility.
          </DossierModule>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-32">
            <DossierModule title="Unresolved Questions">
              Why does digital stillness feel like a failure of the interface? 
              How do we preserve the human error in a perfectly optimized system? 
              Can an archive ever be finished?
            </DossierModule>
            
            <DossierModule title="Systems Revisited">
              Low-fidelity audio environments. Early internet architecture. Abandoned digital forums. The psychological weight of a blank cursor.
            </DossierModule>
          </div>

          <DossierModule 
            title="Internet Behaviors"
            metadata={[
              { label: "Epoch", value: "Post_Utility" },
              { label: "Stability", value: "Degrading" }
            ]}
          >
            I’ve noticed a shift toward "performative utility"—interfaces that prioritize the appearance of productivity over actual output. Users are increasingly navigating through layers of interaction theater. The most interesting behavior remains the refusal to click: the moments of passive resistance within an active session.
          </DossierModule>

          <DossierModule 
            title="Current Learning"
            metadata={[
              { label: "Subject", value: "Cryptography" },
              { label: "Progress", value: "Endless" }
            ]}
          >
            Deepening my understanding of how trust is mathematically verified versus socially established. Currently exploring the history of signal processing and the ways we’ve learned to communicate through noise.
          </DossierModule>

          <DossierModule 
            title="Signal Patterns"
            metadata={[
              { label: "Aesthetic", value: "Cinematic_Noir" },
              { label: "Rhythm", value: "Staggered" },
              { label: "Clarity", value: "0.82" }
            ]}
          >
            I am drawn to environments that prioritize atmosphere over instruction. Most interesting patterns occur in the transition states between "loading" and "ready." I collect these fragments—moments of hesitation—and reorganize them into new narratives of investigation.
          </DossierModule>

          <DossierModule title="Side Quests">
            Documenting the evolution of "waiting" in user interfaces. Building an archive of silent web pages. Studying the impact of negative space on memory recall.
          </DossierModule>

          {/* Tools & Archive Stats */}
          <div className="pt-24 border-t border-zinc-100 flex flex-col md:flex-row justify-between gap-12">
            <div className="space-y-6">
              <span className="text-[8px] font-mono uppercase tracking-[0.5em] text-zinc-300 font-bold">Investigative_Tools</span>
              <ul className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest space-y-2">
                <li>[ React_Systems ]</li>
                <li>[ Framer_Motion_Orchestration ]</li>
                <li>[ Signal_Analysis ]</li>
                <li>[ Visual_Editorial ]</li>
                <li>[ Deep_Silence ]</li>
              </ul>
            </div>
            
            <div className="text-right space-y-2">
              <span className="text-[8px] font-mono uppercase tracking-[0.5em] text-zinc-300 font-bold">Archive_Coordinates</span>
              <p className="text-[14px] font-mono text-zinc-950 font-black">40.7128° N, 74.0060° W</p>
              <p className="text-[8px] font-mono text-zinc-400 uppercase tracking-widest pt-2">System_End_Terminal</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Return to Core (Act 4 Transition hint) */}
      <div className="pt-64 pb-32 flex justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="group flex flex-col items-center gap-4"
        >
          <div className="w-px h-12 bg-zinc-200 group-hover:h-16 group-hover:bg-zinc-950 transition-all duration-700" />
          <span className="text-[8px] font-mono uppercase tracking-[0.6em] text-zinc-300 group-hover:text-zinc-950 transition-colors duration-700">Re-Enter_System</span>
        </motion.button>
      </div>

    </div>
  );
};

export default ProfilePage;
