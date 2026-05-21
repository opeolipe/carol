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
    intensity: 4,
    date: "2026.04",
    isNew: true,
    observation: "Urgency changes the way humans read interfaces.",
    experiment: "Built a friction-based authentication system.",
    discovery: "Safety requires a specific kind of 'designed' pause.",
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
    intensity: 5,
    date: "2026.05",
    observation: "Scams often hide in the spaces where UX is most helpful.",
    experiment: "A tool that visualizes signal interference in trust flows.",
    discovery: "Systems break where the human feels most supported.",
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
    observation: "Digital rituals create blind spots in security.",
    experiment: "Mapped the muscle memory of checkout flows.",
    discovery: "Complexity is ignored if the rhythm is consistent.",
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
    experiment: "A time-decaying interface prototype.",
    discovery: "Clarity disappears when the clock starts ticking.",
    x: 85,
    y: 82
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-24 relative z-10">
           <div className="space-y-8">
              <div className="flex items-center gap-4">
                 <span className="text-[10px] font-mono tracking-[0.8em] text-zinc-400 font-bold uppercase">Act IV</span>
                 <div className="w-12 h-px bg-zinc-100" />
                 <span className="text-[10px] font-mono text-zinc-950 uppercase tracking-[0.4em] font-black italic">Active_Signals_Detected</span>
              </div>
              <h2 className="text-[clamp(3.5rem,10vw,8rem)] font-black tracking-[-0.08em] text-zinc-950 leading-[0.85] uppercase">
                Investigation <br />
                <span className="text-zinc-200">Archive</span>
              </h2>
           </div>
           
           <div className="max-w-sm space-y-6">
              <p className="text-[13px] font-medium text-zinc-600 leading-relaxed uppercase tracking-[0.1em]">
                The noisy internet is a system <br />
                of evolving traces. These are the <br />
                investigations in progress.
              </p>
              <div className="flex items-center gap-4 border-t border-zinc-50 pt-4">
                 <div className="w-2 h-2 rounded-full bg-zinc-950 animate-ping" />
                 <span className="text-[9px] font-mono uppercase tracking-[0.2em] font-black">CORE_NODE: CONNECTED ({SIDE_QUESTS.length})</span>
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
           <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-30">
              <motion.path
                d="M 20 20 L 48 52 M 48 52 L 75 15 M 75 15 L 85 82 M 85 82 L 48 52 M 48 52 L 18 78"
                fill="none"
                stroke="#000"
                strokeWidth="0.75"
                strokeDasharray="8,8"
                style={{ pathLength }}
              />
           </svg>

           {/* Interactive Nodes */}
           <div className={`relative z-10 w-full h-full min-h-[60vh] transition-all duration-1000 ${selectedQuest ? 'scale-[1.05] filter blur-[1px] opacity-40 grayscale pointer-events-none' : ''}`}>
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


           {/* Side Quest Detail Deck (Deeper Immersion) */}
           <AnimatePresence>
             {selectedQuest && (
               <motion.div
                 initial={{ opacity: 0, scale: 0.9, y: 100, filter: 'blur(20px)' }}
                 animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                 exit={{ opacity: 0, scale: 1.1, y: 50, filter: 'blur(20px)' }}
                 transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                 className="absolute inset-0 m-4 md:m-8 bg-zinc-950/95 backdrop-blur-3xl z-[100] rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl"
               >
                 {/* Immersion Background Elements */}
                 <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute inset-0 overflow-hidden">
                       <motion.div 
                         animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
                         transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                         className="w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_#fff_1px,_transparent_1px)] bg-[length:40px_40px]" 
                       />
                    </div>
                 </div>

                 <div className="relative w-full md:w-3/5 p-12 md:p-24 flex flex-col justify-end space-y-12">
                     <button 
                       onClick={() => setSelectedQuest(null)}
                       className="absolute top-12 left-12 md:left-24 text-[10px] font-mono text-zinc-500 hover:text-white uppercase tracking-[0.6em] transition-all flex items-center gap-6"
                     >
                       <div className="w-8 h-px bg-zinc-700" />
                       Return_to_Map
                     </button>

                     <div className="space-y-8">
                        <div className="flex items-center gap-6">
                           <span className="text-[12px] font-mono text-zinc-500 font-black">{selectedQuest.id}</span>
                           <div className="w-2 h-2 rounded-full bg-zinc-700" />
                           <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">{selectedQuest.status}</span>
                        </div>
                        <h3 className="text-[clamp(3.5rem,8vw,10rem)] font-black tracking-[-0.08em] text-white leading-[0.8] uppercase italic">
                           {selectedQuest.title}
                        </h3>
                     </div>

                     <div className="max-w-xl">
                        <p className="text-2xl font-light text-zinc-400 leading-tight italic">
                           "{selectedQuest.observation}"
                        </p>
                     </div>
                 </div>

                 <div className="relative w-full md:w-2/5 bg-zinc-900/50 border-l border-white/5 p-12 md:p-24 flex flex-col justify-center space-y-16">
                     <div className="space-y-12">
                        <DetailRow dark label="Experiment" content={selectedQuest.experiment} />
                        <DetailRow dark label="Discovery" content={selectedQuest.discovery} />
                     </div>

                     <div className="pt-12 border-t border-white/5">
                        <a href="#" className="flex items-center justify-between group/enter">
                           <div className="space-y-2">
                              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Investigation_Path</span>
                              <span className="text-xl text-white font-medium group-hover/enter:tracking-widest transition-all duration-700">Explore_Side_Quest</span>
                           </div>
                           <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center group-hover/enter:bg-white group-hover/enter:border-white transition-all duration-700">
                              <svg className="w-6 h-6 text-white group-hover/enter:text-zinc-950 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14 5l7 7m0 0l-7 7m7-7H3" />
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
  const repulsionRange = 15;
  const repulsionStrength = distToMouse < repulsionRange ? (1 - distToMouse / repulsionRange) * 20 : 0;
  
  // Calculate repulsion vector
  const dx = quest.x - mousePos.x;
  const dy = quest.y - mousePos.y;
  const angle = Math.atan2(dy, dx);
  const offsetX = Math.cos(angle) * repulsionStrength;
  const offsetY = Math.sin(angle) * repulsionStrength;

  // Signal specific behaviors
  const flicker = quest.status === 'IN_PROGRESS';
  const intensityScale = 0.8 + (quest.intensity * 0.15);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      animate={{ 
        x: offsetX, 
        y: offsetY,
        scale: isSelected ? 1.5 : (distToMouse < 10 ? 1.1 : 1),
      }}
      transition={{ 
        type: "spring", 
        stiffness: 100, 
        damping: 15,
        delay: 0.1 * parseInt(quest.id.split('-')[1])
      }}
      style={{ left: `${quest.x}%`, top: `${quest.y}%` }}
      className="absolute group z-10"
      onClick={onClick}
    >
      <div className="relative flex items-center justify-center cursor-pointer">
         {/* Signal Pulse (Intensity Driven) */}
         <motion.div 
            animate={{ 
               scale: [1, 1.5 + (quest.intensity * 0.1), 1],
               opacity: [0.2, 0.05, 0.2]
            }}
            transition={{ duration: 5 / quest.intensity, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute w-12 h-12 rounded-full border border-zinc-200 ${isNew ? 'border-zinc-950/20' : ''}`}
         />

         {/* Energy Field */}
         <div className="absolute w-24 h-24 rounded-full bg-transparent group-hover:bg-zinc-50/30 transition-all duration-1000 -translate-x-1/2 -translate-y-1/2 left-0 top-0" />

         {/* Core Node */}
         <div className="relative flex items-center justify-center">
            <motion.div 
               animate={flicker ? { opacity: [1, 0.4, 1] } : {}}
               transition={{ duration: 0.2, repeat: Infinity }}
               className={`w-4 h-4 rounded-full border-2 transition-all duration-700 shadow-sm ${
                 isSelected 
                   ? 'bg-zinc-950 border-zinc-950 scale-125' 
                   : isVisited 
                     ? 'bg-zinc-100 border-zinc-100 w-2.5 h-2.5' 
                     : 'bg-white border-zinc-900'
               }`}
               style={{ scale: intensityScale }}
            />
            
            {/* Metadata (Bolder Scale Contrast) */}
            <div className={`absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-700 pointer-events-none
              ${isNew || isSelected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0'}`}
            >
               <div className="flex items-center gap-2">
                  <span className="text-[8px] font-mono text-zinc-400 uppercase tracking-[0.4em] font-black">{quest.type}</span>
                  {isNew && <div className="w-1.5 h-1.5 rounded-full bg-zinc-950" />}
               </div>
               <span className="text-[14px] font-black tracking-[-0.04em] uppercase text-zinc-950 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-sm border border-zinc-100 shadow-xl whitespace-nowrap">
                  {quest.title}
               </span>
               <span className="text-[7px] font-mono text-zinc-300 uppercase tracking-widest">{quest.category} // INT:{quest.intensity}</span>
            </div>
         </div>
      </div>
    </motion.div>
  );
};

const DetailRow: React.FC<{ label: string, content: React.ReactNode, dark?: boolean }> = ({ label, content, dark }) => (
  <div className={`space-y-4 border-l ${dark ? 'border-white/10 hover:border-white/30' : 'border-zinc-100 hover:border-zinc-300'} pl-12 transition-all group`}>
     <span className={`text-[10px] font-mono uppercase tracking-[0.6em] ${dark ? 'text-zinc-600' : 'text-zinc-300'} block font-black`}>{label}</span>
     <p className={`text-xl md:text-2xl font-light ${dark ? 'text-zinc-300' : 'text-zinc-600'} leading-relaxed md:leading-snug transition-transform duration-700 group-hover:translate-x-2`}>
        {content}
     </p>
  </div>
);

