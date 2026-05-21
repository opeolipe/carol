import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

interface SideQuest {
  id: string;
  title: string;
  type: 'SIGNAL' | 'EXPERIMENT' | 'PROTOTYPE';
  observation: string;
  experiment: string;
  discovery: string;
  x: number; // 5-90%
  y: number; // 10-80%
}

const SIDE_QUESTS: SideQuest[] = [
  {
    id: "SQ-01",
    title: "Trust Triggers",
    type: "EXPERIMENT",
    observation: "Urgency changes the way humans read interfaces.",
    experiment: "Built a friction-based authentication system.",
    discovery: "Safety requires a specific kind of 'designed' pause.",
    x: 20,
    y: 25
  },
  {
    id: "SQ-02",
    title: "Silent Archive",
    type: "SIGNAL",
    observation: "Most digital trust is built on familiarity, not truth.",
    experiment: "Generated 100 'safe' interfaces using deceptive patterns.",
    discovery: "Deception is easier when the typography is legible.",
    x: 75,
    y: 15
  },
  {
    id: "SQ-03",
    title: "Pattern Drift",
    type: "PROTOTYPE",
    observation: "Scams often hide in the spaces where UX is most helpful.",
    experiment: "A tool that visualizes signal interference in trust flows.",
    discovery: "Systems break where the human feels most supported.",
    x: 45,
    y: 50
  },
  {
    id: "SQ-04",
    title: "Behavioral Echo",
    type: "EXPERIMENT",
    observation: "Digital rituals create blind spots in security.",
    experiment: "Mapped the muscle memory of checkout flows.",
    discovery: "Complexity is ignored if the rhythm is consistent.",
    x: 15,
    y: 75
  },
  {
    id: "SQ-05",
    title: "Urgency Loop",
    type: "PROTOTYPE",
    observation: "Pressure reveals the hidden structure of trust.",
    experiment: "A time-decaying interface prototype.",
    discovery: "Clarity disappears when the clock starts ticking.",
    x: 80,
    y: 80
  }
];

export const Act4Section: React.FC = () => {
  const [selectedQuest, setSelectedQuest] = useState<SideQuest | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const pathLength = useTransform(scrollYProgress, [0.4, 0.8], [0, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen bg-[#fdfdfc] py-32 md:py-48 px-8 md:px-24 overflow-hidden z-20"
    >
      <motion.div style={{ opacity }} className="max-w-7xl mx-auto h-full flex flex-col">
        {/* Header Metadata */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-24 relative z-10">
           <div className="space-y-6">
              <div className="flex items-center gap-4">
                 <span className="text-[10px] font-mono tracking-[0.8em] text-zinc-400 font-black uppercase">Act IV</span>
                 <div className="w-12 h-px bg-zinc-100" />
                 <span className="text-[10px] font-mono text-zinc-300">EXPLORATION_RESUMED</span>
              </div>
              <h2 className="text-[clamp(2.5rem,5vw,5rem)] font-light tracking-tight text-zinc-900 leading-[1.1] uppercase">
                Side Quest <br />
                <span className="text-zinc-300 italic">Signal Map</span>
              </h2>
           </div>
           
           <div className="max-w-xs">
              <p className="text-[11px] font-light text-zinc-400 leading-relaxed uppercase tracking-[0.2em]">
                A living archive of experiments, <br />
                trace findings, and modular inventions <br />
                found along the investigation.
              </p>
           </div>
        </div>

        {/* The Signal Map Interface */}
        <div className="relative flex-grow min-h-[70vh] md:min-h-[85vh] border border-zinc-50 rounded-2xl bg-white/50 backdrop-blur-sm overflow-hidden p-8">
           
           {/* Investigative Grid Lines */}
           <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
              <div className="w-full h-full" style={{ 
                backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
                backgroundSize: '10% 10%'
              }} />
           </div>

           {/* Signal Connection Lines (Web Only) */}
           <svg className="absolute inset-0 w-full h-full z-0 hidden md:block">
              <motion.path
                d="M 20 25 L 45 50 L 75 15 L 80 80 L 45 50 L 15 75 Z"
                fill="none"
                stroke="#e4e4e7"
                strokeWidth="1"
                strokeDasharray="5,5"
                style={{ pathLength }}
                className="opacity-50"
              />
           </svg>

           {/* Interactive Nodes */}
           <div className="relative z-10 w-full h-full min-h-[60vh]">
              {SIDE_QUESTS.map((quest) => (
                <QuestNode 
                  key={quest.id} 
                  quest={quest} 
                  isSelected={selectedQuest?.id === quest.id}
                  onClick={() => setSelectedQuest(selectedQuest?.id === quest.id ? null : quest)}
                />
              ))}
           </div>

           {/* Floating Detail Panel (Mobile Optimized) */}
           <AnimatePresence>
             {selectedQuest && (
               <motion.div
                 initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                 animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                 exit={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                 className="absolute bottom-4 left-4 right-4 md:bottom-8 md:right-8 md:left-auto w-auto md:max-w-md bg-white border border-zinc-100 shadow-2xl shadow-zinc-200/50 p-8 md:p-10 z-50 rounded-xl"
               >
                 <button 
                   onClick={() => setSelectedQuest(null)}
                   className="absolute top-4 right-4 md:top-6 md:right-6 text-[10px] font-mono text-zinc-300 hover:text-zinc-900 uppercase tracking-[0.4em] transition-colors p-2"
                 >
                   [ close ]
                 </button>

                 <div className="space-y-8 md:space-y-10">
                    <div className="space-y-3 md:space-y-4">
                       <div className="flex items-center gap-3">
                          <span className="text-[10px] font-mono text-zinc-400 font-bold">{selectedQuest.id}</span>
                          <div className="w-4 h-px bg-zinc-100" />
                          <span className="text-[9px] font-mono text-zinc-300 uppercase tracking-[0.5em]">{selectedQuest.type}</span>
                       </div>
                       <h3 className="text-2xl md:text-3xl font-light tracking-tight text-zinc-900 uppercase">{selectedQuest.title}</h3>
                    </div>

                    <div className="space-y-6 md:space-y-8">
                       <DetailRow label="Observation" content={selectedQuest.observation} />
                       <DetailRow label="Experiment" content={selectedQuest.experiment} />
                       <DetailRow label="Discovery" content={selectedQuest.discovery} />
                    </div>

                    <div className="pt-2 md:pt-4">
                       <a href="#" className="inline-flex items-center gap-4 md:gap-6 group">
                          <span className="text-[10px] font-black uppercase tracking-[0.6em] text-zinc-400 group-hover:text-zinc-900 transition-colors">Enter Side Quest</span>
                          <div className="w-12 h-px bg-zinc-100 group-hover:w-20 group-hover:bg-zinc-900 transition-all duration-700" />
                       </a>
                    </div>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>

           {/* Ambient Instruction (Visible when nothing selected) */}
           {!selectedQuest && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute bottom-8 left-8 flex items-center gap-6"
              >
                 <div className="w-1.5 h-1.5 rounded-full bg-zinc-100 animate-pulse" />
                 <span className="text-[9px] font-mono text-zinc-300 uppercase tracking-[0.5em]">Select a signal node to investigate</span>
              </motion.div>
           )}
        </div>
      </motion.div>
    </section>
  );
};

const QuestNode: React.FC<{ quest: SideQuest, isSelected: boolean, onClick: () => void }> = ({ quest, isSelected, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 * parseInt(quest.id.split('-')[1]), duration: 1, ease: [0.16, 1, 0.3, 1] }}
      style={{ left: `${quest.x}%`, top: `${quest.y}%` }}
      className="absolute cursor-pointer group"
      onClick={onClick}
    >
      <div className="relative flex items-center justify-center">
         {/* Ping Rings */}
         <motion.div 
           animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }}
           transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
           className={`absolute w-12 h-12 rounded-full border border-zinc-200 ${isSelected ? 'border-zinc-900 bg-zinc-50' : ''}`}
         />
         
         <div className={`relative w-4 h-4 rounded-full transition-all duration-700 z-10 ${isSelected ? 'bg-zinc-950 p-1 scale-125' : 'bg-zinc-100 group-hover:bg-zinc-300'}`}>
            <div className={`w-full h-full rounded-full ${isSelected ? 'bg-white' : ''}`} />
         </div>

         {/* Label (Visible on hover or mobile) */}
         <div className={`absolute top-8 left-1/2 -translate-x-1/2 transition-all duration-500 whitespace-nowrap z-20 ${isSelected ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'}`}>
            <span className="text-[10px] font-mono text-zinc-400 tracking-widest uppercase bg-white/80 backdrop-blur-sm px-3 py-1 border border-zinc-50 rounded-md">
              {quest.title}
            </span>
         </div>
      </div>
    </motion.div>
  );
};

const DetailRow: React.FC<{ label: string, content: React.ReactNode }> = ({ label, content }) => (
  <div className="space-y-2 border-l border-zinc-50 pl-6">
     <span className="text-[9px] font-mono uppercase tracking-[0.4em] text-zinc-300 block">{label}</span>
     <p className="text-sm font-light text-zinc-600 leading-relaxed font-mono">
        {content}
     </p>
  </div>
);
