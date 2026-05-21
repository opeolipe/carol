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
    title: "Trust triggers",
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
    title: "Deception trace",
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
    title: "Pattern drift",
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
    title: "Behavioral echo",
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
    title: "Urgency loop",
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

  const ambientY = useTransform(scrollYProgress, [0, 1], [0, selectedQuest ? 10 : 40]);

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!mapRef.current || selectedQuest) return;
    const rect = mapRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    setMousePos({
      x: ((clientX - rect.left) / rect.width) * 100,
      y: ((clientY - rect.top) / rect.height) * 100
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
        <div className={`flex flex-col md:flex-row md:items-end justify-between gap-12 mb-16 md:mb-24 relative z-10 transition-all duration-1000 ${selectedQuest ? 'opacity-0 blur-md translate-y-[-20px] pointer-events-none' : 'opacity-100'}`}>
           <div className="space-y-6 md:space-y-8">
              <div className="flex items-center gap-4 md:gap-6">
                 <span className="text-[9px] md:text-[10px] font-mono tracking-[0.4em] md:tracking-[0.8em] text-zinc-300 font-bold uppercase">Act IV</span>
                 <div className="w-8 md:w-12 h-px bg-zinc-100" />
                 <span className="text-[9px] md:text-[10px] font-mono text-zinc-950 uppercase tracking-[0.3em] font-black italic">Active_Signals</span>
              </div>
              <h2 className="text-[clamp(2.2rem,7vw,5rem)] font-black tracking-[-0.06em] text-zinc-950 leading-[0.8] uppercase opacity-10">
                Investigation <br />
                <span className="text-zinc-200 block">Archive</span>
              </h2>
           </div>
           
           <div className="max-w-md space-y-4">
              <p className="text-[11px] md:text-[13px] font-medium text-zinc-800 leading-snug tracking-tight">
                The noisy internet is a system <br />
                of evolving traces. These are <br />
                <span className="inline-block whitespace-nowrap">investigations in progress.</span>
              </p>
              <div className="flex items-center gap-4 border-t-[1px] border-zinc-50 pt-4">
                 <div className="w-1 h-1 rounded-full bg-zinc-950 animate-pulse" />
                 <span className="text-[8px] md:text-[9px] font-mono uppercase tracking-[0.2em] font-black text-zinc-300">CORE_SYNC: {SIDE_QUESTS.length} SIGNALS</span>
              </div>
           </div>
        </div>

        {/* The Signal Map Interface */}
        <div 
          ref={mapRef}
          onMouseMove={handleMouseMove}
          onTouchMove={handleMouseMove}
          onTouchStart={handleMouseMove}
          className="relative flex-grow min-h-[80vh] md:min-h-[90vh] border border-zinc-100 rounded-3xl bg-white/40 backdrop-blur-3xl overflow-hidden p-8 cursor-crosshair group/map shadow-[inset_0_0_100px_rgba(0,0,0,0.02)]"
        >
           
           {/* Investigative Grid Lines (Orchestrated) */}
           <motion.div 
              animate={{ 
                opacity: selectedQuest ? 0.01 : 0.04,
                scale: selectedQuest ? 1.1 : 1
              }}
              className="absolute inset-0 z-0 pointer-events-none transition-all duration-1000"
           >
              <div className="w-full h-full" style={{ 
                backgroundImage: 'linear-gradient(to right, #000 1.5px, transparent 1.5px), linear-gradient(to bottom, #000 1.5px, transparent 1.5px)',
                backgroundSize: '4% 4%'
              }} />
           </motion.div>

           {/* Signal Connection Traces (Adaptive) */}
           <svg className={`absolute inset-0 w-full h-full z-0 pointer-events-none transition-all duration-1000 ${selectedQuest ? 'opacity-0 blur-sm scale-110' : 'opacity-[0.25]'}`}>
              <motion.path
                d="M 20 20 L 48 52 M 48 52 L 75 15 M 75 15 L 85 82 M 85 82 L 48 52 M 48 52 L 18 78 M 48 52 L 55 35"
                fill="none"
                stroke="#000"
                strokeWidth="0.5"
                strokeDasharray="8,12"
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
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 transition={{ duration: 1 }}
                 className="absolute inset-0 z-[100] flex items-center justify-center p-4 md:p-12 pointer-events-none bg-zinc-950/2 backdrop-blur-[2px]"
                 onClick={(e) => {
                    e.stopPropagation();
                    setSelectedQuest(null);
                 }}
               >
                 <motion.div 
                    initial={{ y: 20, opacity: 0, scale: 0.99, filter: 'blur(10px)' }}
                    animate={{ y: 0, opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ y: 15, opacity: 0, scale: 0.99, filter: 'blur(10px)' }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full max-w-3xl bg-white p-8 md:p-16 border border-zinc-100 shadow-[0_60px_120px_-20px_rgba(0,0,0,0.12)] pointer-events-auto rounded-2xl flex flex-col space-y-10 md:space-y-12 overflow-y-auto max-h-[90vh]"
                    onClick={(e) => e.stopPropagation()}
                 >
                    <div className="flex items-center justify-between border-b border-zinc-50 pb-8">
                       <div className="flex items-center gap-4 md:gap-6">
                          <span className="text-[10px] font-mono text-zinc-300 font-bold tracking-widest">{selectedQuest.id}</span>
                          <div className="w-1 h-1 rounded-full bg-zinc-200" />
                          <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-zinc-950 animate-pulse" />
                             <span className="text-[9px] font-mono text-zinc-950 uppercase tracking-[0.4em] font-black">{selectedQuest.status}</span>
                          </div>
                       </div>
                       <button 
                         onClick={() => setSelectedQuest(null)}
                         className="text-[9px] md:text-[10px] font-mono text-zinc-300 hover:text-zinc-950 uppercase tracking-[0.4em] transition-all flex items-center gap-3 group"
                       >
                         Collapse
                         <div className="w-6 h-px bg-zinc-100 group-hover:w-10 group-hover:bg-zinc-950 transition-all" />
                       </button>
                    </div>

                    <div className="space-y-6 md:space-y-8">
                       <h3 className="text-[clamp(1.8rem,5vw,3rem)] font-black tracking-tighter text-zinc-950 leading-[0.9] capitalize">
                          {selectedQuest.title}
                       </h3>
                       <div className="max-w-2xl">
                          <p className="text-lg md:text-2xl font-light text-zinc-900 leading-[1.4] italic border-l-2 border-zinc-950/10 pl-6 md:pl-8">
                             {selectedQuest.observation}
                          </p>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
                       <DetailRow label="Discovery" content={selectedQuest.discovery} />
                       <div className="flex flex-col justify-end space-y-4 md:pl-8">
                          <span className="text-[8px] font-mono text-zinc-300 uppercase tracking-widest">Archive Link</span>
                          <a href="#" className="inline-flex items-center gap-3 group/cta border-b border-zinc-950/20 pb-1 w-fit hover:border-zinc-950 transition-all">
                             <span className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.1em] text-zinc-950 group-hover/cta:tracking-[0.15em] transition-all italic">Read full investigation →</span>
                          </a>
                          <button 
                            onClick={() => setSelectedQuest(null)}
                            className="text-[9px] text-zinc-400 hover:text-zinc-950 transition-colors w-fit underline underline-offset-4 decoration-zinc-100 hover:decoration-zinc-400"
                          >
                            Return to archive
                          </button>
                       </div>
                    </div>
                 </motion.div>
               </motion.div>
             )}
           </AnimatePresence>

           {/* Ambient Legend (Refined) */}
           {!selectedQuest && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-10 flex items-center gap-8 md:gap-12"
              >
                 <div className="flex items-center gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-100" />
                    <span className="text-[8px] font-mono text-zinc-300 uppercase tracking-[0.4em]">Ambient</span>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-950" />
                    <span className="text-[8px] font-mono text-zinc-950 uppercase tracking-[0.4em] font-black">Active</span>
                 </div>
                 <div className="hidden md:flex items-center gap-4">
                    <div className="w-3 h-[1px] bg-zinc-100" />
                    <span className="text-[8px] font-mono text-zinc-200 uppercase tracking-[0.4em]">Traced</span>
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
  
  // Status-Based Ecology
  const isArchived = quest.status === 'ARCHIVED';
  const isActive = quest.status === 'ACTIVE';
  const isInProgress = quest.status === 'IN_PROGRESS' || quest.isIrrational;
  const isRecent = quest.status === 'RECENT';

  // Signal Gravity & Repulsion Logic (Refined Physics)
  const distToMouse = Math.sqrt(Math.pow(quest.x - mousePos.x, 2) + Math.pow(quest.y - mousePos.y, 2));
  
  // Dynamic Range based on status
  const baseRange = isRecent ? 14 : 10;
  const repulsionRange = isVisited ? baseRange * 0.6 : baseRange; 
  const repulsionStrength = distToMouse < repulsionRange && !selectedQuest 
    ? (1 - distToMouse / repulsionRange) * (isRecent ? 8 : 5) 
    : 0;
   
   const time = Date.now() * 0.001;
   // Drifting depends on exploration state
   const driftScale = isVisited ? 0.3 : (isArchived ? 0.5 : 1);
   const signalDriftX = !selectedQuest ? Math.sin(time * 0.15 + parseInt(quest.id.split('-')[1])) * (1.2 * driftScale) : 0;
   const signalDriftY = !selectedQuest ? Math.cos(time * 0.12 + parseInt(quest.id.split('-')[1])) * (1.2 * driftScale) : 0;

  const dx = quest.x - mousePos.x;
  const dy = quest.y - mousePos.y;
  const angle = Math.atan2(dy, dx);
  const offsetX = (Math.cos(angle) * repulsionStrength) + signalDriftX;
  const offsetY = (Math.sin(angle) * repulsionStrength) + signalDriftY;

  // Visual Behavior
  const flicker = isInProgress && !selectedQuest;
  const intensityScale = (0.9 + (quest.intensity * 0.12)) * (isVisited ? 0.9 : 1);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      animate={{ 
        x: offsetX, 
        y: offsetY,
        scale: isSelected ? 1.05 : (selectedQuest ? 0.8 : 1),
        opacity: selectedQuest ? (isSelected ? 1 : 0.02) : (isVisited ? 0.6 : 1), 
        filter: selectedQuest && !isSelected ? 'blur(15px)' : 'blur(0px)'
      }}
      transition={{ 
        type: "spring", 
        stiffness: isSelected ? 40 : 20, 
        damping: isSelected ? 20 : 35,
        delay: isSelected ? 0 : 0.02 * parseInt(quest.id.split('-')[1])
      }}
      style={{ left: `${quest.x}%`, top: `${quest.y}%`, zIndex: isSelected ? 100 : 10 }}
      className="absolute group"
    >
      <div 
        className={`relative flex items-center justify-center ${quest.isIrrational ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={(e) => {
          e.stopPropagation();
          if (quest.isIrrational) return;
          onClick();
        }}
        onMouseEnter={() => {
          // Subtle touch/hover hint
        }}
      >
         {/* Signal Pulse (Ecology Controlled) */}
         {!isVisited && !isArchived && (
            <motion.div 
               animate={{ 
                  scale: [1, 2.2 + (quest.intensity * 0.1), 1],
                  opacity: [0.08, 0, 0.08],
               }}
               transition={{ 
                 duration: (10 / quest.intensity) * (isActive ? 0.8 : 1.2), 
                 repeat: Infinity, 
                 ease: "linear" 
               }}
               className={`absolute w-14 h-14 rounded-full border ${isNew ? 'border-zinc-950/15' : 'border-zinc-100'}`}
            />
         )}

         {/* Core Node */}
         <div className="relative flex items-center justify-center">
            <motion.div 
               animate={flicker ? { 
                 opacity: [1, 0.3, 1],
                 scale: [1, 1.05, 1],
               } : {}}
               transition={{ duration: 1.8, repeat: Infinity }}
               className={`w-3.5 h-3.5 md:w-4.5 md:h-4.5 rounded-full border-[1.5px] transition-all duration-1000 ${
                 isSelected 
                   ? 'bg-zinc-950 border-zinc-950 shadow-[0_0_30px_rgba(0,0,0,0.2)]' 
                   : isVisited 
                     ? 'bg-zinc-100 border-zinc-200 shadow-none scale-75' 
                     : isNew 
                       ? 'bg-zinc-950 border-zinc-950'
                       : 'bg-white border-zinc-950/15'
               }`}
               style={{ scale: intensityScale }}
            />
            
            {/* Metadata (Interaction Awareness) */}
            <div className={`absolute -top-14 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 transition-all duration-1000 pointer-events-none
              ${isSelected || (distToMouse < 7 && !selectedQuest) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
               <span className="text-[7px] font-mono text-zinc-300 uppercase tracking-[0.4em] font-bold">{quest.type}</span>
               <span className={`text-[12px] md:text-[13px] font-black tracking-tight transition-all duration-1000 px-4 py-1 rounded-sm border shadow-2xl whitespace-nowrap capitalize
                 ${isSelected ? 'text-white bg-zinc-950 border-zinc-950 scale-110' : 'text-zinc-950 bg-white border-zinc-50'}`}
               >
                 {quest.title}
               </span>
               <div className="flex items-center gap-2 mt-1">
                 <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-zinc-950' : 'bg-zinc-200'}`} />
                 <span className="text-[6px] font-mono text-zinc-300 uppercase tracking-widest">{quest.status}</span>
               </div>
            </div>
         </div>
      </div>
    </motion.div>
  );
};

const DetailRow: React.FC<{ label: string, content: React.ReactNode }> = ({ label, content }) => (
  <div className={`space-y-2 md:space-y-4 border-l border-zinc-50 pl-5 md:pl-8 transition-all group hover:border-zinc-950/10`}>
     <span className={`text-[8px] md:text-[9px] font-mono uppercase tracking-[0.4em] text-zinc-300 block font-bold`}>{label}</span>
     <p className={`text-sm md:text-lg font-light text-zinc-800 leading-relaxed transition-transform duration-700 group-hover:translate-x-1 italic`}>
        {content}
     </p>
  </div>
);

