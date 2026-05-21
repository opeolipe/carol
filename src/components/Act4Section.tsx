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
    experiment: "Urgency and familiarity create cognitive blind spots.",
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
    experiment: "Identified 100 deceptive patterns in 'safe' flows.",
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
    experiment: "Visualizing signal interference in trust flows.",
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
    experiment: "Mapping the muscle memory of security rituals.",
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
    experiment: "Time-decaying interface architecture.",
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
    experiment: "Isolating the source of the signal drift.",
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
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

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
    >
      <motion.div style={{ opacity }} className="max-w-7xl mx-auto h-full flex flex-col">
        {/* Header Metadata */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-32 relative z-10">
           <div className="space-y-12">
              <div className="flex items-center gap-6">
                 <span className="text-[10px] font-mono tracking-[1em] text-zinc-400 font-bold uppercase">Act IV</span>
                 <div className="w-16 h-px bg-zinc-200" />
                 <span className="text-[11px] font-mono text-zinc-950 uppercase tracking-[0.5em] font-black italic">Active_Signals_Detected</span>
              </div>
              <h2 className="text-[clamp(4.5rem,12vw,12rem)] font-black tracking-[-0.08em] text-zinc-950 leading-[0.75] uppercase">
                Investigation <br />
                <span className="text-zinc-200 block mt-2">Archive</span>
              </h2>
           </div>
           
           <div className="max-w-md space-y-8">
              <p className="text-[14px] md:text-[16px] font-medium text-zinc-950 leading-tight uppercase tracking-tight">
                The noisy internet is a system <br />
                of evolving traces. These are <br />
                the investigations in progress.
              </p>
              <div className="flex items-center gap-6 border-t-[3px] border-zinc-950 pt-6">
                 <div className="w-3 h-3 rounded-full bg-zinc-950 animate-pulse" />
                 <span className="text-[11px] font-mono uppercase tracking-[0.3em] font-black">CORE_NODE_SYNC: {SIDE_QUESTS.length} SIGNALS FOUND</span>
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
           <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-40">
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
           <div className={`relative z-10 w-full h-full min-h-[60vh] transition-all duration-1000 ${selectedQuest ? 'filter blur-[0.5px]' : ''}`}>
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
           </div>


           {/* Side Quest Detail Deck (Integrated Investigation Lane) */}
           <AnimatePresence>
             {selectedQuest && (
               <motion.div
                 initial={{ opacity: 0, x: -100 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -50 }}
                 transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                 className="absolute inset-y-0 left-0 w-full md:w-[600px] bg-white/95 backdrop-blur-3xl z-[100] border-r border-zinc-100 p-12 md:p-24 flex flex-col justify-center space-y-20 shadow-[40px_0_100px_rgba(0,0,0,0.03)]"
               >
                 <button 
                   onClick={() => setSelectedQuest(null)}
                   className="absolute top-12 left-12 md:left-24 text-[11px] font-mono text-zinc-400 hover:text-zinc-950 uppercase tracking-[0.6em] transition-all flex items-center gap-8 group"
                 >
                   <div className="w-12 h-px bg-zinc-200 group-hover:w-16 group-hover:bg-zinc-950 transition-all" />
                   Close_Archive
                 </button>

                 <div className="space-y-12">
                    <div className="flex items-center gap-8">
                       <span className="text-[14px] font-mono text-zinc-300 font-black">{selectedQuest.id}</span>
                       <div className="w-2 h-2 rounded-full bg-zinc-950/20" />
                       <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-[0.4em]">{selectedQuest.status}</span>
                    </div>
                    
                    <div className="space-y-6">
                       <h3 className="text-[clamp(3.5rem,6vw,6rem)] font-black tracking-[-0.08em] text-zinc-950 leading-[0.8] uppercase italic">
                          {selectedQuest.title}
                       </h3>
                       <div className="max-w-md">
                          <p className="text-3xl font-light text-zinc-950 leading-tight italic">
                             "{selectedQuest.observation}"
                          </p>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-16 border-t border-zinc-50 pt-16">
                     <div className="space-y-12">
                        <DetailRow label="Investigation" content={selectedQuest.experiment} />
                        <DetailRow label="Discovery" content={selectedQuest.discovery} />
                     </div>

                     <div className="pt-8">
                        <a href="#" className="flex items-center justify-between group/enter">
                           <div className="space-y-2">
                              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">Access_Full_Trace</span>
                              <span className="text-2xl text-zinc-950 font-black group-hover/enter:tracking-widest transition-all duration-700 italic uppercase">Open_Investigation →</span>
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
                    <div className="w-2 h-2 rounded-full bg-zinc-950 shadow-lg" />
                    <span className="text-[9px] font-mono text-zinc-950 uppercase tracking-[0.4em] font-black">Active Signal</span>
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
  mousePos: { x: number, y: number };
  selectedQuest: SideQuest | null;
}

const QuestNode: React.FC<NodeProps> = ({ quest, isSelected, isVisited, onClick, mousePos, selectedQuest }) => {
  const isNew = quest.isNew;
  
  // Signal Gravity & Repulsion Logic
  const distToMouse = Math.sqrt(Math.pow(quest.x - mousePos.x, 2) + Math.pow(quest.y - mousePos.y, 2));
  const repulsionRange = 25; // WIDER range for hover anticipation
  const repulsionStrength = distToMouse < repulsionRange ? (1 - distToMouse / repulsionRange) * 25 : 0;
  
  // Predictable vs Unpredictable Drift
  const driftRef = useRef({ x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 });
  const time = Date.now() * 0.001;
  const signalDriftX = Math.sin(time + parseInt(quest.id.split('-')[1])) * 2;
  const signalDriftY = Math.cos(time * 0.7 + parseInt(quest.id.split('-')[1])) * 2;

  // Calculate repulsion vector
  const dx = quest.x - mousePos.x;
  const dy = quest.y - mousePos.y;
  const angle = Math.atan2(dy, dx);
  const offsetX = (Math.cos(angle) * repulsionStrength) + signalDriftX;
  const offsetY = (Math.sin(angle) * repulsionStrength) + signalDriftY;

  // Signal specific behaviors
  const flicker = quest.status === 'IN_PROGRESS' || quest.isIrrational;
  const intensityScale = 0.9 + (quest.intensity * 0.2);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      animate={{ 
        x: offsetX, 
        y: offsetY,
        scale: isSelected ? 1.4 : 1,
        opacity: selectedQuest ? (isSelected ? 1 : 0.05) : 1,
      }}
      transition={{ 
        type: "spring", 
        stiffness: 80, 
        damping: 20,
        delay: isSelected ? 0 : 0.1 * parseInt(quest.id.split('-')[1])
      }}
      style={{ left: `${quest.x}%`, top: `${quest.y}%`, zIndex: isSelected ? 50 : 10 }}
      className="absolute group"
      onClick={onClick}
    >
      <div 
        className={`relative flex items-center justify-center ${quest.isIrrational ? 'cursor-not-allowed cursor-wait' : 'cursor-pointer'}`}
        onClick={(e) => {
          e.stopPropagation();
          if (quest.isIrrational) return;
          onClick();
        }}
      >
         {/* Signal Pulse (Intensity Driven) */}
         <motion.div 
            animate={{ 
               scale: [1, 2 + (quest.intensity * 0.2), 1],
               opacity: [0.15, 0.02, 0.15],
            }}
            transition={{ duration: 6 / quest.intensity, repeat: Infinity, ease: "linear" }}
            className={`absolute w-16 h-16 rounded-full border ${isNew ? 'border-zinc-950/20' : 'border-zinc-100'} ${quest.isIrrational ? 'border-dashed border-red-100' : ''}`}
         />

         {/* Core Node */}
         <div className="relative flex items-center justify-center">
            <motion.div 
               animate={flicker ? { 
                 opacity: [1, 0.4, 1],
                 scale: [1, 1.1, 1],
               } : {}}
               transition={{ duration: 0.8, repeat: Infinity }}
               className={`w-6 h-6 rounded-full border-[3px] transition-all duration-1000 shadow-lg ${
                 isSelected 
                   ? 'bg-zinc-950 border-zinc-950' 
                   : isVisited 
                     ? 'bg-white border-zinc-100' 
                     : isNew 
                       ? 'bg-zinc-950 border-zinc-950'
                       : 'bg-white border-zinc-950'
               }`}
               style={{ scale: intensityScale }}
            />
            
            {/* Metadata (Refined Hierarchy) */}
            <div className={`absolute -top-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 transition-all duration-1000 pointer-events-none
              ${isSelected || (distToMouse < 8 && !selectedQuest) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            >
               <div className="flex items-center gap-3">
                  <span className="text-[9px] font-mono text-zinc-300 uppercase tracking-[0.4em] font-black">{quest.type}</span>
                  {quest.isIrrational && <span className="text-[8px] font-mono text-red-500/50 uppercase tracking-widest">[ERR]</span>}
               </div>
               <span className={`text-[18px] font-black tracking-[-0.04em] uppercase transition-all duration-700 px-6 py-2 rounded-sm border shadow-2xl whitespace-nowrap
                 ${isSelected ? 'text-white bg-zinc-950 border-zinc-950' : 'text-zinc-950 bg-white border-zinc-100'}`}
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
  <div className={`space-y-4 border-l border-zinc-100 pl-12 transition-all group hover:border-zinc-950`}>
     <span className={`text-[10px] font-mono uppercase tracking-[0.6em] text-zinc-300 block font-black`}>{label}</span>
     <p className={`text-2xl font-light text-zinc-950 leading-snug transition-transform duration-700 group-hover:translate-x-2 italic`}>
        {content}
     </p>
  </div>
);

