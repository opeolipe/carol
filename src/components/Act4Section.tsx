import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

interface SideQuest {
  id: string;
  title: string;
  type: 'SIGNAL' | 'EXPERIMENT' | 'PROTOTYPE';
  category: 'TRUST' | 'SCAMS' | 'BEHAVIOR' | 'SECURITY';
  status: 'ACTIVE' | 'ARCHIVED' | 'IN_PROGRESS' | 'RECENT';
  intensity: number; // 1-5, drives visual scale/pulse
  date: string;
  lastDetected?: string;
  isNew?: boolean;
  isIrrational?: boolean;
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
    intensity: 4,
    date: "2026.04",
    isNew: true,
    observation: "Interfaces manufacture trust faster than logic can question it.",
    experiment: "Urgency creates cognitive blind spots in standard trust flows.",
    discovery: "Safety requires a designed pause.",
    x: 20,
    y: 20
  },
  {
    id: "SQ-02",
    title: "Deception Trace",
    type: "SIGNAL",
    category: "SCAMS",
    status: "ARCHIVED",
    intensity: 2,
    date: "2026.02",
    observation: "Visual safety masks structural risk.",
    experiment: "Identified 100 deceptive patterns in safe-looking interfaces.",
    discovery: "Deception is easier when typography is legible.",
    x: 75,
    y: 15
  },
  {
    id: "SQ-03",
    title: "Pattern Drift",
    type: "PROTOTYPE",
    category: "BEHAVIOR",
    status: "ACTIVE",
    intensity: 5,
    date: "2026.05",
    observation: "Scams hide in the spaces where UX is most helpful.",
    experiment: "Visualizing signal interference in standard trust flows.",
    discovery: "Systems break where the human feels supported.",
    x: 48,
    y: 52
  },
  {
    id: "SQ-04",
    title: "Behavioral Echo",
    type: "EXPERIMENT",
    category: "SECURITY",
    status: "IN_PROGRESS",
    intensity: 3,
    date: "2026.05",
    observation: "Complexity is ignored if the rhythm is consistent.",
    experiment: "Mapping the muscle memory of checkout rituals.",
    discovery: "Rituals create exploitable blind spots.",
    x: 18,
    y: 78
  },
  {
    id: "SQ-05",
    title: "Urgency Loop",
    type: "PROTOTYPE",
    category: "TRUST",
    status: "ACTIVE",
    intensity: 4,
    date: "2026.05",
    observation: "Pressure reveals the hidden structure of trust.",
    experiment: "Time-decaying interface architecture experiments.",
    discovery: "Clarity disappears when the clock starts.",
    x: 85,
    y: 82
  },
  {
    id: "SQ-06",
    title: "Anomaly_06",
    type: "SIGNAL",
    category: "BEHAVIOR",
    status: "RECENT",
    intensity: 1,
    date: "24:00",
    lastDetected: "ERR_SIGNAL_LOST",
    isIrrational: true,
    observation: "Some traces do not want to be mapped.",
    experiment: "Isolating the source of the human signal drift.",
    discovery: "The system creates its own resistance.",
    x: 55,
    y: 35
  }
];

export const Act4Section: React.FC = () => {
  const [selectedQuest, setSelectedQuest] = useState<SideQuest | null>(null);
  const [visitedQuests, setVisitedQuests] = useState<Set<string>>(new Set());
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  
  // Use scroll for ambient parallax
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const ambientY = useTransform(scrollYProgress, [0, 1], [0, 50]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100
    });
  };

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
      onClick={() => selectedQuest && setSelectedQuest(null)}
    >
      <motion.div style={{ opacity }} className="max-w-7xl mx-auto h-full flex flex-col">
        {/* Header Metadata - Quiet when investigation is open */}
        <div className={`flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20 md:mb-32 relative z-10 transition-all duration-1000 ${selectedQuest ? 'opacity-5 blur-sm scale-95 pointer-events-none' : 'opacity-100'}`}>
           <div className="space-y-8 md:space-y-12">
              <div className="flex items-center gap-6">
                 <span className="text-[9px] md:text-[10px] font-mono tracking-[0.6em] md:tracking-[1em] text-zinc-400 font-bold uppercase">Act IV</span>
                 <div className="w-12 md:w-16 h-px bg-zinc-200" />
                 <span className="text-[9px] md:text-[11px] font-mono text-zinc-950 uppercase tracking-[0.3em] md:tracking-[0.5em] font-black italic">Active_Signals</span>
              </div>
              <h2 className="text-[clamp(2.5rem,8vw,6rem)] font-black tracking-[-0.08em] text-zinc-950 leading-[0.8] uppercase opacity-20">
                Investigation <br />
                <span className="text-zinc-200 block">Archive</span>
              </h2>
           </div>
           
           <div className="max-w-md space-y-6">
              <p className="text-[12px] md:text-[15px] font-medium text-zinc-950 leading-tight uppercase tracking-tight">
                The noisy internet is a system <br />
                of evolving traces. These are <br />
                <span className="inline-block whitespace-nowrap">the investigations in progress.</span>
              </p>
              <div className="flex items-center gap-6 border-t-[1px] border-zinc-100 pt-6">
                 <div className="w-1.5 h-1.5 rounded-full bg-zinc-950 animate-pulse" />
                 <span className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] font-black text-zinc-400">CORE_SYNC: {SIDE_QUESTS.length} SIGNALS</span>
              </div>
           </div>
        </div>

        {/* The Signal Map Interface */}
        <div 
          ref={mapRef}
          onMouseMove={handleMouseMove}
          className="relative flex-grow min-h-[80vh] md:min-h-[90vh] border border-zinc-100 rounded-3xl bg-white/60 backdrop-blur-xl overflow-hidden p-8 cursor-crosshair group/map"
        >
           
           {/* Investigative Grid Lines */}
           <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none">
              <div className="w-full h-full" style={{ 
                backgroundImage: 'linear-gradient(to right, #000 1.5px, transparent 1.5px), linear-gradient(to bottom, #000 1.5px, transparent 1.5px)',
                backgroundSize: '4% 4%'
              }} />
           </div>

           {/* Signal Connection Traces */}
           <svg className={`absolute inset-0 w-full h-full z-0 pointer-events-none transition-opacity duration-1000 ${selectedQuest ? 'opacity-5' : 'opacity-40'}`}>
              <motion.path
                d="M 20 20 L 48 52 M 48 52 L 75 15 M 75 15 L 85 82 M 85 82 L 48 52 M 48 52 L 18 78 M 48 52 L 55 35"
                fill="none"
                stroke="#000"
                strokeWidth="1"
                strokeDasharray="12,12"
                style={{ pathLength }}
              />
           </svg>

           {/* Interactive Nodes */}
           <motion.div 
              style={{ y: ambientY }}
              className={`relative z-10 w-full h-full min-h-[60vh] transition-all duration-1000 ${selectedQuest ? 'pointer-events-none' : ''}`}
           >
              {SIDE_QUESTS.map((quest) => (
                <QuestNode 
                  key={quest.id} 
                  quest={quest} 
                  isSelected={selectedQuest?.id === quest.id}
                  isVisited={visitedQuests.has(quest.id)}
                  onClick={() => handleQuestSelect(quest)}
                  mousePos={mousePos}
                  selectedQuest={selectedQuest}
                />
              ))}
           </motion.div>


           {/* Side Quest Detail Deck (Focused Editorial State) */}
           <AnimatePresence>
             {selectedQuest && (
               <motion.div
                 initial={{ opacity: 0, scale: 0.98, filter: 'blur(20px)' }}
                 animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                 exit={{ opacity: 0, scale: 1.02, filter: 'blur(20px)' }}
                 transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                 className="absolute inset-0 z-[100] flex items-center justify-center p-6 md:p-24 pointer-events-none"
                 onClick={(e) => {
                    e.stopPropagation();
                    setSelectedQuest(null);
                 }}
               >
                 <motion.div 
                    initial={{ y: 40 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-2xl bg-white/98 backdrop-blur-3xl p-10 md:p-20 border border-zinc-100 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.1)] pointer-events-auto rounded-3xl flex flex-col space-y-12 md:space-y-16"
                    onClick={(e) => e.stopPropagation()}
                 >
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-6">
                          <span className="text-[10px] md:text-[12px] font-mono text-zinc-400 font-bold tracking-widest">{selectedQuest.id}</span>
                          <div className="w-1.5 h-1.5 rounded-full bg-zinc-950/20" />
                          <span className="text-[9px] md:text-[10px] font-mono text-zinc-300 uppercase tracking-[0.4em]">{selectedQuest.status}</span>
                       </div>
                       <button 
                         onClick={() => setSelectedQuest(null)}
                         className="text-[10px] font-mono text-zinc-300 hover:text-zinc-950 uppercase tracking-[0.5em] transition-all flex items-center gap-4 group"
                       >
                         Collapse_Signal
                         <div className="w-8 h-px bg-zinc-100 group-hover:w-12 group-hover:bg-zinc-950 transition-all" />
                       </button>
                    </div>

                    <div className="space-y-8 md:space-y-10">
                       <h3 className="text-[clamp(2rem,5vw,4rem)] font-black tracking-[-0.08em] text-zinc-950 leading-[0.85] uppercase italic">
                          {selectedQuest.title}
                       </h3>
                       <div className="max-w-md">
                          <p className="text-xl md:text-3xl font-light text-zinc-950 leading-tight italic border-l-4 border-zinc-950 pl-8">
                             "{selectedQuest.observation}"
                          </p>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-zinc-50">
                       <DetailRow label="Discovery" content={selectedQuest.discovery} />
                       <div className="flex flex-col justify-end space-y-4">
                          <span className="text-[9px] font-mono text-zinc-300 uppercase tracking-widest">Narrative Continuation</span>
                          <a href="#" className="inline-flex items-center gap-4 group/cta border-b-2 border-zinc-950 pb-2 w-fit">
                             <span className="text-[11px] md:text-[13px] font-black uppercase tracking-[0.1em] text-zinc-950 group-hover/cta:tracking-[0.2em] transition-all italic">Continue Investigation →</span>
                          </a>
                       </div>
                    </div>
                 </motion.div>
               </motion.div>
             )}
           </AnimatePresence>

           {/* Ambient Legend */}
           {!selectedQuest && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute bottom-10 left-10 hidden md:flex items-center gap-12"
              >
                 <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-zinc-100" />
                    <span className="text-[9px] font-mono text-zinc-300 uppercase tracking-[0.4em]">Ambient Archive</span>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-zinc-950 shadow-lg" />
                    <span className="text-[9px] font-mono text-zinc-950 uppercase tracking-[0.4em] font-black">Active Signal</span>
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
  mousePos: { x: number, y: number };
  selectedQuest: SideQuest | null;
}

const QuestNode: React.FC<NodeProps> = ({ quest, isSelected, isVisited, onClick, mousePos, selectedQuest }) => {
  const isNew = quest.isNew;
  
  // Signal Gravity & Repulsion Logic
  const distToMouse = Math.sqrt(Math.pow(quest.x - mousePos.x, 2) + Math.pow(quest.y - mousePos.y, 2));
   const repulsionRange = 12; 
   const repulsionStrength = distToMouse < repulsionRange && !selectedQuest ? (1 - distToMouse / repulsionRange) * 8 : 0;
   
   const time = Date.now() * 0.001;
   const signalDriftX = !selectedQuest ? Math.sin(time * 0.3 + parseInt(quest.id.split('-')[1])) * 1 : 0;
   const signalDriftY = !selectedQuest ? Math.cos(time * 0.2 + parseInt(quest.id.split('-')[1])) * 1 : 0;

  const dx = quest.x - mousePos.x;
  const dy = quest.y - mousePos.y;
  const angle = Math.atan2(dy, dx);
  const offsetX = (Math.cos(angle) * repulsionStrength) + signalDriftX;
  const offsetY = (Math.sin(angle) * repulsionStrength) + signalDriftY;

  const flicker = (quest.status === 'IN_PROGRESS' || quest.isIrrational) && !selectedQuest;
  const intensityScale = 0.9 + (quest.intensity * 0.15);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      animate={{ 
        x: offsetX, 
        y: offsetY,
        scale: isSelected ? 1.15 : (selectedQuest ? 0.6 : 1),
        opacity: selectedQuest ? (isSelected ? 1 : 0.01) : 1, 
        filter: selectedQuest && !isSelected ? 'blur(16px)' : 'blur(0px)'
      }}
      transition={{ 
        type: "spring", 
        stiffness: 30, 
        damping: 35,
        delay: isSelected ? 0 : 0.08 * parseInt(quest.id.split('-')[1])
      }}
      style={{ left: `${quest.x}%`, top: `${quest.y}%`, zIndex: isSelected ? 50 : 10 }}
      className="absolute group"
      onClick={onClick}
    >
      <div 
        className={`relative flex items-center justify-center ${quest.isIrrational ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={(e) => {
          e.stopPropagation();
          if (quest.isIrrational) return;
          onClick();
        }}
      >
         {/* Signal Pulse */}
         <motion.div 
            animate={{ 
               scale: [1, 2 + (quest.intensity * 0.1), 1],
               opacity: [0.1, 0, 0.1],
            }}
            transition={{ duration: 8 / quest.intensity, repeat: Infinity, ease: "linear" }}
            className={`absolute w-12 h-12 rounded-full border ${isNew ? 'border-zinc-950/10' : 'border-zinc-50'}`}
         />

         {/* Core Node */}
         <div className="relative flex items-center justify-center">
            <motion.div 
               animate={flicker ? { 
                 opacity: [1, 0.5, 1],
               } : {}}
               transition={{ duration: 1, repeat: Infinity }}
               className={`w-5 h-5 rounded-full border-2 transition-all duration-1000 shadow-md ${
                 isSelected 
                   ? 'bg-zinc-950 border-zinc-950' 
                   : isVisited 
                     ? 'bg-white border-zinc-100' 
                     : isNew 
                       ? 'bg-zinc-950 border-zinc-950'
                       : 'bg-white border-zinc-950/40'
               }`}
               style={{ scale: intensityScale }}
            />
            
            {/* Metadata (Quieter, no overlap logic) */}
            <div className={`absolute -top-14 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-700 pointer-events-none
              ${isSelected || (distToMouse < 8 && !selectedQuest) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
               <span className="text-[8px] font-mono text-zinc-300 uppercase tracking-[0.4em] font-black">{quest.type}</span>
               <span className={`text-[14px] font-black tracking-[-0.02em] uppercase transition-all duration-700 px-4 py-1.5 rounded-sm border shadow-xl whitespace-nowrap
                 ${isSelected ? 'text-white bg-zinc-950 border-zinc-950' : 'text-zinc-950 bg-white border-zinc-50'}`}
               >
                 {quest.title}
               </span>
            </div>
         </div>
      </div>
    </motion.div>
  );
};

const DetailRow: React.FC<{ label: string, content: React.ReactNode }> = ({ label, content }) => (
  <div className={`space-y-3 md:space-y-4 border-l border-zinc-100 pl-6 md:pl-10 transition-all group hover:border-zinc-950`}>
     <span className={`text-[8px] md:text-[10px] font-mono uppercase tracking-[0.6em] text-zinc-300 block font-black`}>{label}</span>
     <p className={`text-base md:text-xl font-light text-zinc-950 leading-snug transition-transform duration-700 group-hover:translate-x-1 italic`}>
        {content}
     </p>
  </div>
);

