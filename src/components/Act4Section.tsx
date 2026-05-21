import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

interface SideQuest {
  id: string;
  title: string;
  type: 'SIGNAL' | 'EXPERIMENT' | 'PROTOTYPE';
  category: 'TRUST' | 'SCAMS' | 'BEHAVIOR' | 'SECURITY';
  status: 'ACTIVE' | 'ARCHIVED' | 'IN_PROGRESS' | 'RECENT';
  date: string;
  isNew?: boolean;
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
    category: "TRUST",
    status: "RECENT",
    date: "2026.04",
    isNew: true,
    observation: "Urgency changes the way humans read interfaces.",
    experiment: "Built a friction-based authentication system.",
    discovery: "Safety requires a specific kind of 'designed' pause.",
    x: 20,
    y: 25
  },
  {
    id: "SQ-02",
    title: "Deception Trace",
    type: "SIGNAL",
    category: "SCAMS",
    status: "ARCHIVED",
    date: "2026.02",
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
    category: "BEHAVIOR",
    status: "ACTIVE",
    date: "2026.05",
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
    category: "SECURITY",
    status: "IN_PROGRESS",
    date: "2026.05",
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
    category: "TRUST",
    status: "ACTIVE",
    date: "2026.05",
    observation: "Pressure reveals the hidden structure of trust.",
    experiment: "A time-decaying interface prototype.",
    discovery: "Clarity disappears when the clock starts ticking.",
    x: 82,
    y: 78
  }
];

export const Act4Section: React.FC = () => {
  const [selectedQuest, setSelectedQuest] = useState<SideQuest | null>(null);
  const [visitedQuests, setVisitedQuests] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const handleQuestSelect = (quest: SideQuest) => {
    if (selectedQuest?.id === quest.id) {
      setSelectedQuest(null);
    } else {
      setSelectedQuest(quest);
      setVisitedQuests(prev => new Set(prev).add(quest.id));
    }
  };

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
                 <span className="text-[10px] font-mono text-zinc-300 uppercase tracking-widest">Archive_Resumed</span>
              </div>
              <h2 className="text-[clamp(2.5rem,5vw,5rem)] font-light tracking-tight text-zinc-950 leading-[1.1] uppercase">
                Side Quest <br />
                <span className="text-zinc-400 italic">Signal Map</span>
              </h2>
           </div>
           
           <div className="max-w-xs space-y-4">
              <p className="text-[11px] font-light text-zinc-500 leading-relaxed uppercase tracking-[0.2em]">
                An evolving archive of modular <br />
                investigations and side quests <br />
                found along the internet's edge.
              </p>
              <div className="flex items-center gap-4 opacity-40">
                 <div className="w-2 h-2 rounded-full bg-zinc-900" />
                 <span className="text-[8px] font-mono uppercase tracking-[0.3em]">System_Evolving: {SIDE_QUESTS.length} Signals Captured</span>
              </div>
           </div>
        </div>

        {/* The Signal Map Interface */}
        <div className="relative flex-grow min-h-[75vh] md:min-h-[85vh] border border-zinc-50 rounded-2xl bg-white/40 backdrop-blur-md overflow-hidden p-8 group/map">
           
           {/* Investigative Grid Lines */}
           <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none">
              <div className="w-full h-full" style={{ 
                backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
                backgroundSize: '8% 8%'
              }} />
           </div>

           {/* Signal Connection Traces */}
           <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-20">
              <motion.path
                d="M 20 25 L 45 50 M 45 50 L 75 15 M 75 15 L 82 78 M 82 78 L 45 50 M 45 50 L 15 75"
                fill="none"
                stroke="#d4d4d8"
                strokeWidth="0.5"
                strokeDasharray="4,4"
                style={{ pathLength }}
              />
           </svg>

           {/* Interactive Nodes */}
           <div className="relative z-10 w-full h-full min-h-[60vh]">
              {SIDE_QUESTS.map((quest) => (
                <QuestNode 
                  key={quest.id} 
                  quest={quest} 
                  isSelected={selectedQuest?.id === quest.id}
                  isVisited={visitedQuests.has(quest.id)}
                  onClick={() => handleQuestSelect(quest)}
                />
              ))}
           </div>

           {/* Side Quest Detail Deck */}
           <AnimatePresence mode="wait">
             {selectedQuest && (
               <motion.div
                 initial={{ opacity: 0, scale: 0.95, y: 20, filter: 'blur(10px)' }}
                 animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                 exit={{ opacity: 0, scale: 0.95, y: 20, filter: 'blur(10px)' }}
                 transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                 className="absolute bottom-4 left-4 right-4 md:bottom-10 md:right-10 md:left-auto w-auto md:w-[450px] bg-white border border-zinc-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] p-10 z-50 rounded-2xl overflow-hidden"
               >
                 {/* Internal Texture/Detail */}
                 <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] pointer-events-none">
                    <div className="w-full h-full bg-zinc-900 rotate-45 translate-x-16 -translate-y-16" />
                 </div>

                 <button 
                   onClick={() => setSelectedQuest(null)}
                   className="absolute top-8 right-8 text-[9px] font-mono text-zinc-300 hover:text-zinc-900 uppercase tracking-[0.5em] transition-all hover:scale-110"
                 >
                   [ Exit_Archive ]
                 </button>

                 <div className="space-y-12">
                    <div className="space-y-6">
                       <div className="flex items-center gap-4">
                          <span className="text-[10px] font-mono text-zinc-400 font-bold tracking-tighter">{selectedQuest.id}</span>
                          <div className="w-1.5 h-1.5 rounded-full bg-zinc-100" />
                          <span className="text-[9px] font-mono text-zinc-300 uppercase tracking-widest">{selectedQuest.status.replace('_', ' ')}</span>
                          <div className="w-1.5 h-1.5 rounded-full bg-zinc-100" />
                          <span className="text-[9px] font-mono text-zinc-300 uppercase tracking-widest">{selectedQuest.date}</span>
                       </div>
                       <div className="space-y-2">
                          <span className="text-[8px] font-mono text-zinc-400 uppercase tracking-[0.4em]">{selectedQuest.category}</span>
                          <h3 className="text-3xl font-light tracking-tight text-zinc-900 leading-tight uppercase italic">{selectedQuest.title}</h3>
                       </div>
                    </div>

                    <div className="space-y-8 relative">
                       <div className="absolute left-[3px] top-4 bottom-4 w-px bg-zinc-50" />
                       <DetailRow label="Observation" content={selectedQuest.observation} />
                       <DetailRow label="Experiment" content={selectedQuest.experiment} />
                       <DetailRow label="Discovery" content={selectedQuest.discovery} />
                    </div>

                    <div className="pt-6">
                       <a href="#" className="flex items-center justify-between group/link border-t border-zinc-50 pt-8">
                          <span className="text-[10px] font-black uppercase tracking-[0.6em] text-zinc-400 group-hover/link:text-zinc-900 transition-colors">Enter Investigation</span>
                          <div className="w-8 h-8 rounded-full border border-zinc-100 flex items-center justify-center group-hover/link:bg-zinc-900 group-hover/link:border-zinc-900 transition-all duration-500">
                             <svg className="w-3 h-3 text-zinc-300 group-hover/link:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                             </svg>
                          </div>
                       </a>
                    </div>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>

           {/* Ambient Legend (Desktop-only hint) */}
           {!selectedQuest && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute bottom-10 left-10 hidden md:flex items-center gap-12"
              >
                 <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-zinc-100" />
                    <span className="text-[9px] font-mono text-zinc-300 uppercase tracking-[0.4em]">Explorable Trace</span>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-amber-400/20 border border-amber-400/40" />
                    <span className="text-[9px] font-mono text-zinc-300 uppercase tracking-[0.4em]">New Signal</span>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="w-px h-8 bg-zinc-100" />
                    <span className="text-[9px] font-mono text-zinc-300 uppercase tracking-[0.4em]">Click node to descend</span>
                 </div>
              </motion.div>
           )}
        </div>
      </motion.div>
    </section>
  );
};

interface NodeProps {
  quest: SideQuest;
  isSelected: boolean;
  isVisited: boolean;
  onClick: () => void;
}

const QuestNode: React.FC<NodeProps> = ({ quest, isSelected, isVisited, onClick }) => {
  const isNew = quest.isNew;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 * parseInt(quest.id.split('-')[1]), duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      style={{ left: `${quest.x}%`, top: `${quest.y}%` }}
      className="absolute group z-10"
      onClick={onClick}
    >
      <div className="relative flex items-center justify-center cursor-pointer">
         {/* Magnetic/Hover Backdrop */}
         <div className="absolute w-16 h-16 rounded-full bg-transparent group-hover:bg-zinc-50/50 transition-all duration-700 -translate-x-1/2 -translate-y-1/2 left-0 top-0" />

         {/* Signal Pulse */}
         <AnimatePresence>
            {(isNew && !isSelected) && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [1, 2, 1], opacity: [0.2, 0, 0.2] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-8 h-8 rounded-full border border-amber-400/30 bg-amber-400/5"
              />
            )}
         </AnimatePresence>

         {/* Status Glow for Selected */}
         {isSelected && (
            <motion.div 
               layoutId="glow"
               className="absolute w-14 h-14 rounded-full bg-zinc-900/5 blur-xl"
            />
         )}

         {/* Core Node Structure */}
         <div className={`relative flex items-center justify-center transition-all duration-700 ${isSelected ? 'scale-125' : 'group-hover:scale-110'}`}>
            <div className={`w-3 h-3 rounded-full border-2 transition-all duration-700 ${
              isSelected 
                ? 'bg-zinc-950 border-zinc-950' 
                : isVisited 
                  ? 'bg-white border-zinc-100 w-2 h-2' 
                  : 'bg-white border-zinc-300'
            }`}>
               {isNew && !isVisited && <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full border-2 border-white shadow-sm" />}
            </div>
            
            {/* Metadata Hint (Visible on hover or active) */}
            <div className={`absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 transition-all duration-500 pointer-events-none
              ${isSelected || isNew ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'}`}
            >
               <span className="text-[7px] font-mono text-zinc-300 uppercase tracking-[0.3em] whitespace-nowrap mb-1">
                  {isNew ? 'NEW_SIGNAL' : isVisited ? 'ARCHIVE_OPEN' : 'UNEXPLORED'}
               </span>
               <span className={`text-[10px] font-mono font-bold tracking-widest uppercase transition-colors px-3 py-1 rounded-sm
                 ${isSelected ? 'text-zinc-900 bg-zinc-50' : isNew ? 'text-amber-500' : 'text-zinc-400 bg-white/60 backdrop-blur-sm border border-zinc-50 shadow-sm'}`}
               >
                 {quest.title}
               </span>
            </div>
         </div>

         {/* Visual Connection Guide (only visible on hover or active) */}
         <div className={`absolute left-1/2 top-4 w-px bg-gradient-to-b from-zinc-200 to-transparent transition-all duration-700 origin-top
            ${isSelected ? 'h-16 opacity-100' : 'h-0 opacity-0 group-hover:h-8 group-hover:opacity-40'}`} 
         />
      </div>
    </motion.div>
  );
};

const DetailRow: React.FC<{ label: string, content: React.ReactNode }> = ({ label, content }) => (
  <div className="space-y-2 border-l border-zinc-100 pl-8 transition-all hover:border-zinc-300">
     <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-zinc-300 block">{label}</span>
     <p className="text-sm font-light text-zinc-600 leading-relaxed md:leading-[1.8] tracking-wide italic">
        {content}
     </p>
  </div>
);

