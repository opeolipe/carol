import React, { useRef, useEffect, useState, createContext, useContext } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { useArchiveStillness, getStillnessState } from './StillnessState';
import { useSignalDrift, driftCoordinate } from './SignalDriftState';

export type DepthState = 
  | 'QUICK_OBSERVATION' 
  | 'DEEP_INVESTIGATION' 
  | 'UNRESOLVED_FRAGMENT' 
  | 'ONGOING_SIGNAL' 
  | 'ARCHIVED_TRACE';

export const DepthContext = createContext<{
  depth: DepthState;
  setDepth: (depth: DepthState) => void;
  isStill: boolean;
  isRevisited: boolean;
}>({
  depth: 'DEEP_INVESTIGATION',
  setDepth: () => {},
  isStill: false,
  isRevisited: false
});

export const GlitchedText = ({ children }: { children: string }) => {
  const { depth, isRevisited } = useContext(DepthContext);
  const [displayText, setDisplayText] = useState(children);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (depth !== 'UNRESOLVED_FRAGMENT' || isRevisited) {
      setDisplayText(children);
      return;
    }

    const chars = 'µ§¶†‡αβγδεζηθικλμνξοπρστυφχψω╳█░▒▓';
    let interval: NodeJS.Timeout;

    if (!isHovered) {
      interval = setInterval(() => {
        const words = children.split(' ');
        const scrambledWords = words.map(word => {
          if (word.length > 5 && Math.random() < 0.15) {
            const idx = Math.floor(Math.random() * word.length);
            return word.substring(0, idx) + chars[Math.floor(Math.random() * chars.length)] + word.substring(idx + 1);
          }
          return word;
        });
        setDisplayText(scrambledWords.join(' '));
      }, 1600);
    } else {
      let iteration = 0;
      interval = setInterval(() => {
        setDisplayText(children.split('').map((char, index) => {
          if (index < iteration) return children[index];
          if (char === ' ') return ' ';
          return chars[Math.floor(Math.random() * chars.length)];
        }).join(''));

        if (iteration >= children.length) {
          clearInterval(interval);
          setDisplayText(children);
        }
        iteration += Math.ceil(children.length / 15);
      }, 40);
    }

    return () => clearInterval(interval);
  }, [depth, isHovered, children, isRevisited]);

  return (
    <span 
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
      className={`transition-colors duration-500 ${depth === 'UNRESOLVED_FRAGMENT' ? 'hover:text-amber-600/90 cursor-help' : ''}`}
    >
      {displayText}
    </span>
  );
};

export const RedactedBlock = ({ children }: { children: string }) => {
  const { depth, isRevisited } = useContext(DepthContext);
  const [revealed, setRevealed] = useState(false);

  const isRedacted = depth === 'UNRESOLVED_FRAGMENT' && !isRevisited && !revealed;

  if (!isRedacted) return <span>{children}</span>;

  return (
    <span 
      onClick={() => setRevealed(true)}
      className="relative inline-block bg-zinc-950 text-transparent select-none px-1 rounded cursor-pointer hover:bg-zinc-800 transition-colors duration-300"
    >
      {children}
      <span className="absolute inset-0 px-1 text-[6.5px] font-mono text-zinc-500 text-center uppercase tracking-tighter hover:text-zinc-400 select-none leading-normal pt-1 animate-pulse">
        [ redacted ]
      </span>
    </span>
  );
};

interface MetadataProps {
  label: string;
  value: string;
}

const MetadataItem = ({ label, value }: MetadataProps) => (
  <div className="flex flex-col gap-1 border-t border-zinc-100 pt-4">
    <span className="text-[7px] font-mono uppercase tracking-[0.4em] text-zinc-300 font-bold">{label}</span>
    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">{value}</span>
  </div>
);

export const InvestigationHeader = ({ 
  title, 
  description, 
  metadata,
  state = 'ACTIVE'
}: { 
  title: string; 
  description: string; 
  metadata: MetadataProps[];
  state?: 'ACTIVE' | 'ARCHIVED' | 'UNRESOLVED' | 'RECENT' | 'DRIFTING';
}) => {
  const { depth, isRevisited, isStill } = useContext(DepthContext);
  
  const stateColors = {
    ACTIVE: 'bg-emerald-500',
    ARCHIVED: 'bg-zinc-300',
    UNRESOLVED: 'bg-amber-500',
    RECENT: 'bg-blue-500',
    DRIFTING: 'bg-purple-500'
  };

  const duration = depth === 'QUICK_OBSERVATION' ? 0.7 : depth === 'ARCHIVED_TRACE' ? 0.2 : 2.0;
  const isArchived = depth === 'ARCHIVED_TRACE';
  const isUnresolved = depth === 'UNRESOLVED_FRAGMENT';
  const isOngoing = depth === 'ONGOING_SIGNAL';

  return (
    <header className={`space-y-12 mb-32 md:mb-48 pt-12 transition-all duration-[1500ms] ${isArchived ? 'filter grayscale opacity-70' : ''}`}>
      <motion.div
        initial={{ opacity: 0, y: isArchived ? 0 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration, ease: [0.19, 1, 0.22, 1] }}
        className="space-y-8"
      >
        <div className="flex flex-wrap items-center gap-4">
          <div className="w-12 h-[1px] bg-zinc-950" />
          <span className="text-[10px] font-mono uppercase tracking-[0.6em] text-zinc-950 font-black italic">
            {isArchived ? 'System_Trace_Archived_Static' : 'System_Trace_Initialize'}
          </span>
          
          <div className="flex flex-wrap items-center gap-2 text-[8px] font-mono text-zinc-400">
            <span>// LENS:</span>
            <span className={`px-2 py-0.5 rounded-full text-white font-bold tracking-widest ${
              isRevisited ? 'bg-purple-500' :
              depth === 'QUICK_OBSERVATION' ? 'bg-blue-500' :
              depth === 'DEEP_INVESTIGATION' ? 'bg-emerald-600' :
              depth === 'UNRESOLVED_FRAGMENT' ? 'bg-amber-500 animate-pulse' :
              depth === 'ONGOING_SIGNAL' ? 'bg-purple-600' :
              'bg-zinc-400'
            }`}>
              {isRevisited ? 'REVISITED_STABILIZED 🔒' : depth}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-3 bg-zinc-50 px-4 py-1.5 border border-zinc-100 rounded-full">
             <motion.div 
               animate={{ 
                 opacity: isArchived ? 0.5 : [0.3, 1, 0.3], 
                 x: isOngoing && !isStill ? [0, 3, -3, 0] : 0,
                 scale: isOngoing && !isStill ? [1, 1.25, 1] : 1
               }}
               transition={{ duration: isOngoing ? 0.6 : 2, repeat: Infinity }}
               className={`w-2 h-2 rounded-full ${stateColors[state] || 'bg-zinc-300'}`} 
             />
             <span className="text-[7px] font-mono uppercase tracking-[0.3em] text-zinc-500 font-bold">{state}</span>
             {isOngoing && !isStill && (
               <span className="text-[6px] font-mono text-purple-400 animate-pulse">[ DRIFT_ACTIVE ]</span>
             )}
          </div>
        </div>
        <h1 className="text-[clamp(2.5rem,7vw,9rem)] font-bold tracking-tighter text-zinc-950 leading-[0.85] uppercase max-w-6xl">
          {isUnresolved && !isRevisited ? (
            <GlitchedText>{title}</GlitchedText>
          ) : title}
        </h1>
        <p className="text-[clamp(1.1rem,2vw,1.9rem)] font-light text-zinc-400 leading-tight tracking-tight max-w-4xl italic">
          {description}
        </p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 pt-12">
        {metadata.map((m, i) => {
          const isMetadataCorrupt = isUnresolved && !isRevisited && (m.label === 'Signal_Category' || m.label === 'Archive_State');
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: duration * 0.75, delay: isArchived ? 0 : 0.4 + i * 0.1 }}
            >
              <div className="flex flex-col gap-1 border-t border-zinc-100 pt-4">
                <span className="text-[7px] font-mono uppercase tracking-[0.4em] text-zinc-300 font-bold">{m.label}</span>
                <span className={`text-[10px] font-mono uppercase tracking-widest ${isMetadataCorrupt ? 'text-amber-500 font-bold' : 'text-zinc-500'}`}>
                  {isMetadataCorrupt ? (
                    <GlitchedText>DATA_CORRUPTED</GlitchedText>
                  ) : m.value}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </header>
  );
};

export const UnresolvedQuestion = ({ children }: { children: React.ReactNode }) => {
  const { depth, isRevisited } = useContext(DepthContext);
  const isUnresolved = depth === 'UNRESOLVED_FRAGMENT';

  return (
    <motion.div 
      initial={{ opacity: 0, x: 10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className={`my-16 md:my-24 p-8 md:p-12 border-2 flex gap-8 items-center transition-all duration-[1000ms] ${
        isUnresolved && !isRevisited
          ? 'border-amber-500/50 bg-amber-500/[0.02] shadow-[0_0_15px_rgba(245,158,11,0.05)] animate-pulse'
          : 'border-dashed border-zinc-100 bg-zinc-50/30'
      }`}
    >
      <div className={`text-[2rem] md:text-[3rem] font-black transition-colors duration-1000 ${isUnresolved && !isRevisited ? 'text-amber-500' : 'text-zinc-200'}`}>?</div>
      <div className="space-y-2">
         <span className={`text-[7px] font-mono uppercase tracking-[0.4em] font-bold transition-colors duration-1000 ${isUnresolved && !isRevisited ? 'text-amber-500' : 'text-zinc-400'}`}>
           {isUnresolved ? 'Unresolved_Structural_Ambiguity_Detected ⚠' : 'Unresolved_Structural_Ambiguity'}
         </span>
         <p className="text-[14px] md:text-[18px] font-light text-zinc-500 leading-tight italic">
           {children}
         </p>
      </div>
    </motion.div>
  );
};

export const ArchiveReference = ({ label, href }: { label: string; href: string }) => (
  <a 
    href={href} 
    className="inline-flex items-center gap-3 px-4 py-2 border border-zinc-100 hover:border-zinc-950 hover:bg-zinc-950 hover:text-white transition-all duration-500 group"
  >
    <div className="w-1.5 h-1.5 rounded-full bg-zinc-200 group-hover:bg-emerald-500" />
    <span className="text-[8px] font-mono uppercase tracking-[0.4em] font-black">{label}</span>
  </a>
);

export const InvestigationObservation = ({ children, label = "Observation" }: { children: React.ReactNode; label?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-25% 0px -25% 0px" });
  const { depth, isRevisited, isStill } = useContext(DepthContext);
  
  const isUnresolved = depth === 'UNRESOLVED_FRAGMENT';
  const isOngoing = depth === 'ONGOING_SIGNAL';
  const isArchived = depth === 'ARCHIVED_TRACE';

  // Recursive text intercept or plain text decoding wrapper
  const recursiveGlitch = (node: React.ReactNode, active: boolean, read: boolean): React.ReactNode => {
    if (!active || read) return node;
    if (typeof node === 'string') {
      return <GlitchedText>{node}</GlitchedText>;
    }
    if (Array.isArray(node)) {
      return node.map(child => recursiveGlitch(child, active, read));
    }
    if (React.isValidElement(node)) {
      const subChildren = node.props.children;
      if (subChildren) {
        return React.cloneElement(node as any, {
          ...node.props,
          children: React.Children.map(subChildren, child => recursiveGlitch(child, active, read))
        });
      }
    }
    return node;
  };

  const processedChildren = recursiveGlitch(children, isUnresolved, isRevisited);

  return (
    <motion.section 
      ref={ref}
      initial={{ opacity: 0, y: isArchived ? 0 : 30, filter: isArchived ? 'none' : 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: "-10% 0px" }}
      animate={{ 
        opacity: isInView ? 1 : isArchived ? 0.6 : 0.35,
        scale: isInView ? 1 : isArchived ? 1 : 0.97,
        filter: isInView ? 'blur(0px)' : isArchived ? 'none' : 'blur(4px)'
      }}
      transition={{ duration: isArchived ? 0.2 : 1.8, ease: [0.19, 1, 0.22, 1] }}
      className={`relative py-12 md:py-32 border-l pl-6 md:pl-20 mb-8 md:mb-16 transition-all duration-1000 ${
        isUnresolved && !isRevisited ? 'border-dashed border-amber-300' :
        isOngoing && !isStill ? 'border-purple-300/60' :
        isArchived ? 'border-zinc-200' : 'border-zinc-100'
      }`}
    >
      <div className={`absolute -left-3 top-1/2 -translate-y-1/2 h-[1px] transition-all duration-1000 ${
        isInView 
          ? (isUnresolved ? 'bg-amber-500 w-12' : isOngoing ? 'bg-purple-500 w-12' : 'bg-zinc-950 w-12') 
          : 'bg-zinc-200 w-6'
      }`} />
      <span className={`text-[8px] md:text-[9px] font-mono uppercase tracking-[0.5em] font-bold block mb-6 md:mb-10 transition-colors duration-1000 ${
        isInView 
          ? (isUnresolved ? 'text-amber-500' : isOngoing ? 'text-purple-400' : 'text-zinc-950') 
          : 'text-zinc-200'
      }`}>
        {label} {isUnresolved && !isRevisited && ' // UNSTABLE'}
      </span>
      <div className="text-[clamp(1.1rem,1.8vw,1.8rem)] font-light text-zinc-800 leading-relaxed md:leading-[1.8] tracking-normal max-w-4xl selection:bg-zinc-950 selection:text-white">
        {processedChildren}
      </div>
    </motion.section>
  );
};

export const InvestigationEvidence = ({ src, alt, caption, metadata, details }: { src?: string; alt?: string; caption?: string; metadata?: MetadataProps[]; details?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-15% 0px -15% 0px" });
  const [isExpanded, setIsExpanded] = React.useState(false);
  const { depth, isRevisited, isStill } = useContext(DepthContext);
  
  const [isHovering, setIsHovering] = useState(false);
  const [stabilizeProgress, setStabilizeProgress] = useState(depth === 'DEEP_INVESTIGATION' ? 0 : 100);

  const isDeep = depth === 'DEEP_INVESTIGATION';
  const isUnresolved = depth === 'UNRESOLVED_FRAGMENT';
  const isOngoing = depth === 'ONGOING_SIGNAL';
  const isArchived = depth === 'ARCHIVED_TRACE';

  useEffect(() => {
    if (!isDeep || isRevisited) {
      setStabilizeProgress(100);
      return;
    }
    let timer: NodeJS.Timeout;
    if (isHovering && !isStill) {
      timer = setInterval(() => {
        setStabilizeProgress(p => {
          if (p >= 100) {
            clearInterval(timer);
            return 100;
          }
          return p + 4;
        });
      }, 50);
    } else {
      setStabilizeProgress(0);
    }
    return () => clearInterval(timer);
  }, [isHovering, isDeep, isRevisited, isStill]);

  const isLocked = isDeep && !isRevisited && stabilizeProgress < 100;

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, scale: isArchived ? 1 : 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      animate={{ 
        opacity: isInView ? 1 : 0.45,
        filter: isInView ? 'none' : isArchived ? 'grayscale(1)' : 'grayscale(0.6) blur(2px)'
      }}
      transition={{ duration: isArchived ? 0.2 : 2.5, ease: [0.19, 1, 0.22, 1] }}
      className={`my-16 md:my-48 space-y-6 md:space-y-10 transition-all duration-[1500ms] ${isArchived ? 'filter grayscale brightness-90' : ''}`}
    >
      <div 
        onClick={() => {
          if (!isLocked) setIsExpanded(!isExpanded);
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="relative aspect-[4/3] md:aspect-[21/9] bg-zinc-50 border border-zinc-100 overflow-hidden flex items-center justify-center group shrink-0 cursor-crosshair"
      >
         {src ? (
           <img 
             src={src} 
             alt={alt} 
             className={`w-full h-full object-cover transition-all duration-[4000ms] ease-out ${
               isLocked ? 'blur-md opacity-25 scale-95' : 'opacity-90 group-hover:scale-105'
             }`} 
           />
         ) : (
           <div className={`text-[10px] md:text-[12px] font-mono uppercase tracking-[0.8em] font-black italic transition-colors duration-1000 ${
             isLocked ? 'text-zinc-300' : 'text-zinc-400'
           }`}>
             {isLocked ? `[ DECODING_TRACE: ${stabilizeProgress}% ]` : isExpanded ? "[ DEEP_TRACE_ACTIVE ]" : "[ FRAGMENT_LOCKED ]"}
           </div>
         )}
         
         {isLocked && (
           <div className="absolute inset-0 bg-zinc-950/20 backdrop-blur-[4px] flex flex-col items-center justify-center font-mono gap-2 pointer-events-none">
             <div className="border border-purple-500/30 px-4 py-2 bg-zinc-950/70 text-purple-400 text-[8px] uppercase tracking-[0.3em] text-center animate-pulse">
               Hold Cursor to De-Drift Segment
             </div>
             <div className="w-48 h-1 bg-zinc-900 border border-zinc-800 rounded-full overflow-hidden">
               <div className="h-full bg-purple-500 transition-all duration-100" style={{ width: `${stabilizeProgress}%` }} />
             </div>
           </div>
         )}

         {!isLocked && isUnresolved && !isRevisited && (
           <div className="absolute inset-0 bg-amber-500/[0.015] pointer-events-none flex items-center justify-center">
             <div className="text-[6.5px] font-mono text-amber-500 border border-amber-500/20 px-3 py-1 bg-zinc-950/40 uppercase tracking-widest animate-pulse">
               UNRESOLVED_FRAGMENT_FEED_OVERRIDE
             </div>
           </div>
         )}

         <div className="absolute inset-0 noise-texture opacity-[0.04] pointer-events-none" />
         <div className="absolute top-4 left-4 md:top-8 md:left-8 flex items-center gap-3">
           <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-colors duration-1000 ${
             isStill ? 'bg-zinc-300' :
             isLocked ? 'bg-purple-400 animate-ping' :
             isInView ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-300'
           }`} />
           <span className="text-[7px] md:text-[8px] font-mono text-zinc-950 uppercase tracking-[0.5em] font-black">
             {isLocked ? "Trace_Re-Aligning" : isExpanded ? "Investigation_Expanded" : "Active_Trace_Lock"}
           </span>
         </div>
         {isExpanded && !isLocked && (
           <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-zinc-950/20 backdrop-blur-[2px] flex items-center justify-center pointer-events-none"
           >
              <div className="border border-white/20 p-4 bg-zinc-950/40 text-white font-mono text-[8px] uppercase tracking-widest text-center">
                Sub-System_Analysis_Ready
              </div>
           </motion.div>
         )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 px-4 md:px-0">
        <div className="md:col-span-8 space-y-8">
          <p className="text-[11px] md:text-[12px] font-mono text-zinc-400 uppercase tracking-[0.3em] leading-loose md:pl-8 border-l border-zinc-100">
            {caption || "No associated narrative for this fragment."}
          </p>
          
          {isExpanded && !isLocked && details && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="md:pl-8 space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-4 h-[1px] bg-zinc-950" />
                <span className="text-[7px] font-mono uppercase tracking-[0.4em] font-black text-zinc-950 italic">Modular_Breakdown</span>
              </div>
              <p className="text-[14px] font-light text-zinc-600 leading-relaxed max-w-xl">
                {details}
              </p>
            </motion.div>
          )}
        </div>
        {metadata && (
          <div className="md:col-span-4 grid grid-cols-2 gap-6 border-l border-zinc-100 pl-8 md:pl-12">
            {metadata.map((m, i) => (
              <div key={i} className="flex flex-col gap-1">
                <span className="text-[6px] md:text-[7px] font-mono uppercase tracking-widest text-zinc-300 font-bold">{m.label}</span>
                <span className="text-[8px] md:text-[9px] font-mono text-zinc-600 uppercase tracking-tighter">{m.value}</span>
              </div>
            ))}
            {isExpanded && !isLocked && (
               <div className="col-span-2 pt-4 border-t border-zinc-50 flex items-center gap-2">
                 <span className="text-[6px] font-mono text-emerald-500 uppercase tracking-widest">[ AUTHENTICATED ]</span>
               </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};


export const SignalMarker = ({ children, observation }: { children: React.ReactNode; observation: string }) => {
  const [isActive, setIsActive] = React.useState(false);

  return (
    <span className="relative inline-block cursor-help group" onClick={() => setIsActive(!isActive)}>
      <span className={`transition-all duration-700 underline decoration-zinc-200 underline-offset-4 decoration-dotted ${isActive ? 'text-zinc-950 bg-emerald-50/50 decoration-emerald-500' : 'text-zinc-500 group-hover:text-zinc-900 group-hover:decoration-zinc-400'}`}>
        {children}
      </span>
      <div className={`absolute -right-2 top-0 w-1 h-1 rounded-full bg-emerald-400 transition-opacity duration-700 ${isActive ? 'opacity-100 animate-ping' : 'opacity-0'}`} />
      
      {isActive && (
        <motion.div 
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="absolute z-[100] left-0 mt-4 w-64 p-6 bg-white border border-zinc-100 shadow-[12px_12px_40px_rgba(0,0,0,0.08)] space-y-4"
        >
          <div className="flex items-center gap-3">
             <div className="w-2 h-[1px] bg-zinc-950" />
             <span className="text-[7px] font-mono uppercase tracking-[0.4em] text-zinc-950 font-black">Local_Signal_Analysis</span>
          </div>
          <p className="text-[12px] font-light text-zinc-600 leading-relaxed italic">
            {observation}
          </p>
        </motion.div>
      )}
    </span>
  );
};


export const InvestigationSignal = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
    whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
    viewport={{ once: true }}
    transition={{ duration: 2, ease: [0.19, 1, 0.22, 1] }}
    className="my-32 p-12 md:p-24 bg-zinc-950 text-white space-y-12 relative overflow-hidden group"
  >
    <div className="absolute top-0 left-0 w-full h-[1px] bg-white/10 group-hover:bg-white/30 transition-colors duration-1000" />
    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/10 group-hover:bg-white/30 transition-colors duration-1000" />
    <div className="relative z-10 space-y-8">
      <div className="flex items-center gap-6">
         <div className="w-8 h-[1px] bg-white/40" />
         <span className="text-[10px] font-mono uppercase tracking-[0.6em] text-white/40 font-black">Highlighted_Signal</span>
      </div>
      <h4 className="text-[clamp(2rem,5vw,4.5rem)] font-bold tracking-tighter uppercase leading-[0.9]">
        {title}
      </h4>
      <div className="text-[14px] md:text-[18px] font-light text-zinc-400 leading-relaxed max-w-3xl border-l border-white/5 pl-8 md:pl-12">
        {children}
      </div>
    </div>
    {/* Subconscious Motion Grid */}
    <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
       <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
    </div>
  </motion.div>
);

export const InvestigationAnnotation = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-30% 0px -30% 0px" });

  return (
    <div ref={ref} className="flex gap-12 items-start my-20 group transition-all duration-1000">
      <div className={`w-[1px] transition-all duration-1000 mt-2 ${isInView ? 'h-32 bg-zinc-950' : 'h-16 bg-zinc-100'}`} />
      <div className="space-y-4">
         <div className="flex items-center gap-3">
            <span className={`text-[8px] font-mono uppercase tracking-[0.4em] font-bold transition-colors duration-1000 ${isInView ? 'text-zinc-950' : 'text-zinc-300'}`}>Subconscious_Note</span>
            {isInView && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[6px] font-mono text-emerald-500 uppercase tracking-widest"
              >
                [ CAPTURED ]
              </motion.span>
            )}
         </div>
         <p className={`text-[13px] md:text-[16px] font-light italic leading-relaxed max-w-2xl transition-colors duration-1000 ${isInView ? 'text-zinc-600' : 'text-zinc-400'}`}>
           {children}
         </p>
      </div>
    </div>
  );
}

export const InvestigationConclusion = ({ children }: { children: React.ReactNode }) => (
  <section className="mt-64 pt-48 border-t-2 border-zinc-950 space-y-16 pb-48 relative">
     <div className="absolute -top-[1.2rem] left-1/2 -translate-x-1/2 bg-[var(--background)] px-12">
        <div className="inline-flex items-center gap-6 px-10 py-3 border-2 border-zinc-950 rounded-full bg-white shadow-[8px_8px_0px_rgba(0,0,0,0.05)]">
          <div className="w-3 h-3 rounded-full bg-zinc-950 animate-pulse" />
          <span className="text-[12px] font-mono uppercase tracking-[0.5em] text-zinc-950 font-black">Unresolved_Conclusion</span>
        </div>
     </div>
     <div className="text-[clamp(1.5rem,3.5vw,3.5rem)] font-light text-zinc-900 leading-[1.2] tracking-tight max-w-5xl mx-auto text-center">
       {children}
     </div>
     <div className="pt-32 flex flex-col items-center gap-6 opacity-30">
       <div className="w-px h-32 bg-zinc-950" />
       <span className="text-[10px] font-mono uppercase tracking-[1em] font-black italic">End_Of_Trace</span>
       <div className="text-[7px] font-mono text-zinc-400 uppercase tracking-[0.2em] pt-4">© 2024 Archive_Terminal_System</div>
     </div>
  </section>
);

export const ArchivePathway = ({ 
  traces,
  signals = [],
  fieldNotes = []
}: { 
  traces: { title: string; slug: string; investigationId?: string; category?: string; description?: string }[];
  signals?: { observation: string; category: string; timestamp: string; status: string; coordinates?: string }[];
  fieldNotes?: { title: string; slug: string; category: string; observation: string; insight: string; unresolvedSignal: string; pattern: string; date: string; coordinates?: string }[];
}) => {
  const isStill = useArchiveStillness();
  const drift = useSignalDrift();
  const [history, setHistory] = useState<string[]>([]);
  const [hoveredTrace, setHoveredTrace] = useState<string | null>(null);
  const [expandedNote, setExpandedNote] = useState<string | null>(null);
  const [tickerOffset, setTickerOffset] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem('archive_memory_v1');
    if (stored) setHistory(JSON.parse(stored));

    // Slow atmospheric background simulation
    const interval = setInterval(() => {
      const currentStatus = (window as any).__archiveStillnessState || 'ACTIVE';
      if (currentStatus !== 'STILL') {
        setTickerOffset(prev => (prev + 1) % 360);
      }
    }, 120);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="mt-48 pt-32 border-t border-zinc-100 pb-32 relative">
      {/* Editorial Navigation Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-20">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center w-6 h-6">
            <motion.div 
              animate={{ rotate: isStill ? 0 : 360 }}
              transition={{ duration: isStill ? 0 : 12, repeat: isStill ? 0 : Infinity, ease: 'linear' }}
              className="absolute inset-0 border border-dashed border-zinc-900/30 rounded-full"
            />
            <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-1000 ${isStill ? 'bg-purple-400' : 'bg-emerald-500'}`} />
          </div>
          <div className="space-y-1">
            <span className="text-[9px] font-mono uppercase tracking-[0.5em] text-zinc-900 font-black block">SYSTEMIC_CONTINUATION_LAYER</span>
            <span className={`text-[7px] font-mono uppercase tracking-[0.3em] transition-colors duration-1000 block ${isStill ? 'text-purple-400' : 'text-zinc-400'}`}>
              {isStill ? 'Status: Temporal_Stillness_Resting' : 'Status: Observation_Engaged_Constant'}
            </span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4 text-right">
          <span className="text-[7px] font-mono uppercase tracking-widest text-zinc-300">
            [ COORDINATES SYSTEM LINK: SECURE_REF_VECTOR ]
          </span>
        </div>
      </div>

      {/* Main Dual Continuum Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        {/* Left Segment: Recurring Investigations & Pathways (Traces) */}
        <div className="lg:col-span-7 space-y-12">
          <div className="flex items-center gap-3 border-b border-zinc-50 pb-4">
             <span className="text-[8px] font-mono uppercase tracking-[0.4em] text-zinc-400 font-bold">Investigation_Continuity</span>
             <span className="text-[6px] font-mono uppercase px-2 py-0.5 border border-zinc-100 rounded-full text-zinc-400 bg-zinc-50/50">Recurring_Traces</span>
          </div>

          <div className="space-y-6">
            {traces.map((trace, i) => {
              const isExamined = history.includes(trace.slug);
              const isHovered = hoveredTrace === trace.slug && !isStill;

              return (
                <div 
                  key={trace.slug}
                  onMouseEnter={() => !isStill && setHoveredTrace(trace.slug)}
                  onMouseLeave={() => setHoveredTrace(null)}
                  className="relative group block"
                >
                  <a 
                    href={isStill ? undefined : `/carol/blog/${trace.slug}`}
                    className={`flex flex-col gap-4 p-8 border border-zinc-100 transition-all duration-1000 relative z-10 ${
                      isStill 
                        ? 'bg-zinc-50/10 border-zinc-50 opacity-60 cursor-default' 
                        : isExamined
                        ? 'bg-purple-50/[0.02] border-purple-100/50 hover:border-purple-300 shadow-[4px_4px_16px_rgba(124,58,237,0.015)]'
                        : 'bg-white/40 backdrop-blur-[2px] group-hover:border-zinc-950'
                    }`}
                  >
                    <div className="flex justify-between items-start text-zinc-400">
                      <span className="text-[7px] font-mono tracking-widest uppercase block">
                        {trace.investigationId || "TRC-7429"} 
                        {isExamined && <span className="ml-2 text-purple-400 font-medium lowercase tracking-wider italic">[ memory stilled in space ]</span>}
                      </span>
                      {!isStill && (
                        <svg className={`w-4 h-4 transition-all duration-500 ${isExamined ? 'text-purple-300 group-hover:text-purple-500 group-hover:translate-x-1 group-hover:-translate-y-1' : 'text-zinc-300 group-hover:text-zinc-950 group-hover:translate-x-1 group-hover:-translate-y-1'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                        </svg>
                      )}
                    </div>

                    <h3 className="text-2xl font-bold tracking-tighter uppercase text-zinc-950 leading-tight">
                      {trace.title}
                    </h3>

                    {trace.description && (
                      <p className="text-sm font-light text-zinc-500 leading-relaxed italic pr-4 max-w-lg">
                        {trace.description}
                      </p>
                    )}

                    <div className="flex items-center gap-3 pt-2">
                       <span className={`text-[8px] font-mono uppercase tracking-widest transition-colors duration-1000 ${
                         isStill 
                           ? 'text-zinc-300' 
                           : isExamined
                           ? 'text-purple-400 group-hover:text-purple-500 font-bold'
                           : 'text-zinc-400 group-hover:text-zinc-950 font-bold'
                       }`}>
                         {isStill ? '[ Core_Fibers_Resting_Secure ]' : isExamined ? 'Inspect_Stilled_Dossier_Fibers →' : 'Inspect_Dossier_Fibers →'}
                       </span>
                    </div>
                  </a>

                  {/* Aesthetic Shadow Displacement */}
                  <div className={`absolute inset-0 bg-zinc-950/[0.01] -z-10 transition-transform duration-700 pointer-events-none ${
                    isStill ? '' : 'group-hover:translate-x-1.5 group-hover:translate-y-1.5'
                  }`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Segment: Ambient Monitoring & Daily Field Fragments (Signals & Connected Observations) */}
        <div className="lg:col-span-1" /> {/* Layout Spacing Spacer */}

        <div className="lg:col-span-4 space-y-12">
          
          {/* Active Broadcast Monitors */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-zinc-50 pb-4">
              <span className="text-[8px] font-mono uppercase tracking-[0.4em] text-zinc-400 font-bold">Ambient_Live_Frequencies</span>
              <span className="text-[7px] font-mono text-zinc-300 uppercase tracking-widest">[ DRIFT: {drift.telemetryDrift} ]</span>
              <span className={`w-1.5 h-1.5 rounded-full transition-all duration-1000 ${
                isStill ? 'bg-purple-400/55 animate-none scale-90' : 'bg-emerald-500 animate-ping'
              }`} />
            </div>

            <div className="space-y-4">
              {signals && signals.map((sig, i) => (
                <div key={i} className="p-5 border border-dashed border-zinc-200 bg-zinc-50/20 space-y-3 relative group">
                  <div className="flex justify-between items-center text-[7px] font-mono text-zinc-400 uppercase tracking-widest">
                    <span>{isStill ? "STABILIZED" : sig.status}</span>
                    <span>{sig.coordinates ? driftCoordinate(sig.coordinates, drift.visits, drift.timeDrift) : "SYS_TRC"}</span>
                  </div>
                  <p className="text-xs font-light text-zinc-600 leading-relaxed italic">
                    “{sig.observation}”
                  </p>
                  <div className="flex justify-between items-center text-[6px] font-mono text-zinc-300 uppercase">
                    <span>COORDINATE_RESIDENCE</span>
                    <span>{isStill ? "RESTING" : (new Date(sig.timestamp).toLocaleTimeString('en-US', { hour12: false }) || "UTC_TIME")}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Connected Observations (Field Notes) */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-zinc-50 pb-4">
               <span className="text-[8px] font-mono uppercase tracking-[0.4em] text-zinc-400 font-bold">Connected_Field_Observations</span>
               <span className={`text-[6px] font-mono uppercase transition-all duration-1000 ${isStill ? 'text-zinc-300 animate-none' : 'text-purple-400 animate-pulse'}`}>
                 {isStill ? '[ SIGNALS_STABILIZED ]' : '[ DRIFT_ALERT ]'}
               </span>
            </div>

            <div className="space-y-3">
              {fieldNotes && fieldNotes.map((note, idx) => {
                const isOpen = expandedNote === note.slug;
                
                return (
                  <div 
                    key={note.slug} 
                    className="border border-zinc-100 bg-white/30 transition-all duration-500 overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedNote(isOpen ? null : note.slug)}
                      className="w-full text-left p-4 flex justify-between items-center hover:bg-zinc-50/50 transition-colors"
                    >
                      <div className="space-y-1">
                        <span className="text-[7px] font-mono text-zinc-400 uppercase tracking-widest block">{note.category}</span>
                        <h4 className="text-xs font-bold uppercase tracking-tight text-zinc-950">{note.title}</h4>
                      </div>
                      <span className="text-xs font-mono text-zinc-300">
                        {isOpen ? '[-]' : '[+]'}
                      </span>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-4 pb-4 overflow-hidden border-t border-zinc-50 pt-3 space-y-4 text-xs font-light text-zinc-600"
                        >
                          <p className="italic leading-relaxed">
                            {note.observation}
                          </p>
                          
                          <div className="space-y-2 border-t border-zinc-50 pt-3">
                            <div>
                               <span className="text-[6px] font-mono uppercase tracking-widest text-zinc-400 font-bold block">Behav_Insight:</span>
                               <p className="text-[11px] text-zinc-500">{note.insight}</p>
                            </div>
                            <div>
                               <span className="text-[6px] font-mono uppercase tracking-widest text-zinc-400 font-bold block">Pattern_Registered:</span>
                               <span className="text-[10px] font-mono uppercase text-purple-500">{note.pattern}</span>
                            </div>
                          </div>
                          
                          <a 
                            href="/carol/notes" 
                            className="inline-block text-[7px] font-mono uppercase tracking-widest bg-zinc-950 text-white px-3 py-1 mt-2 hover:bg-zinc-800 transition-colors"
                          >
                            Explore_All_Field_Notes_Module →
                          </a>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Atmospheric Ticker Backdrop line */}
      <div className="mt-32 pt-8 border-t border-zinc-950/10 flex flex-col md:flex-row md:items-center justify-between gap-6 pointer-events-none opacity-40 select-none">
         <span className="text-[8px] font-mono uppercase tracking-[0.5em] text-zinc-400">
           TRACE_INTEGRITY: HIGH_FIDELITY
         </span>
         <span className="text-[8px] font-mono uppercase tracking-[0.5em] text-zinc-400">
           ACTIVE_PERIPHERAL_SCAN_GRID: [DEGREES_CALIBRATION_{tickerOffset}°]
         </span>
         <span className="text-[8px] font-mono uppercase tracking-[0.5em] text-zinc-400">
           AUTO_SURFACING_SIGNAL_SET
         </span>
      </div>
    </section>
  );
};

export const ReadingEnvironment = ({ 
  children, 
  slug, 
  state = 'ACTIVE' 
}: { 
  children: React.ReactNode, 
  slug?: string, 
  state?: 'ACTIVE' | 'ARCHIVED' | 'UNRESOLVED' | 'RECENT' | 'DRIFTING' 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isStill = useArchiveStillness();
  const [isRevisited, setIsRevisited] = useState(false);
  
  // Set initial depth state based on default Astro state parameter
  const [depth, setDepth] = useState<DepthState>(() => {
    switch (state) {
      case 'ARCHIVED': return 'ARCHIVED_TRACE';
      case 'UNRESOLVED': return 'UNRESOLVED_FRAGMENT';
      case 'RECENT': return 'QUICK_OBSERVATION';
      case 'DRIFTING': return 'ONGOING_SIGNAL';
      case 'ACTIVE': default: return 'DEEP_INVESTIGATION';
    }
  });

  const [hoveredLensDesc, setHoveredLensDesc] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      const stored = localStorage.getItem('archive_memory_v1');
      const history = stored ? JSON.parse(stored) : [];
      if (history.includes(slug)) {
        setIsRevisited(true);
      } else {
        localStorage.setItem('archive_memory_v1', JSON.stringify([...history, slug]));
        window.dispatchEvent(new CustomEvent('archive_memory_updated'));
      }
    }
  }, [slug]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Dynamic characteristics mapped directly on chosen DepthState
  const depthStyles: Record<DepthState, {
    gridColor: string;
    gridSize: string;
    opacity: number;
    containerClass: string;
  }> = {
    QUICK_OBSERVATION: {
      gridColor: 'rgba(59, 130, 246, 0.04)',
      gridSize: '100px',
      opacity: 0.15,
      containerClass: 'bg-[color-mix(in_srgb,var(--background)_96%,#3b82f6_4%)]'
    },
    DEEP_INVESTIGATION: {
      gridColor: isRevisited ? 'rgba(167, 139, 250, 0.04)' : 'rgba(16, 185, 129, 0.04)',
      gridSize: '80px',
      opacity: 0.25,
      containerClass: isRevisited ? 'bg-[color-mix(in_srgb,var(--background)_96%,#8b5cf6_4%)]' : 'bg-[var(--background)]'
    },
    UNRESOLVED_FRAGMENT: {
      gridColor: 'rgba(245, 158, 11, 0.04)',
      gridSize: '60px',
      opacity: 0.35,
      containerClass: 'bg-[color-mix(in_srgb,var(--background)_96%,#f59e0b_4%)]'
    },
    ONGOING_SIGNAL: {
      gridColor: 'rgba(139, 92, 246, 0.05)',
      gridSize: '40px',
      opacity: 0.4,
      containerClass: 'bg-[color-mix(in_srgb,var(--background)_95%,#8b5cf6_5%)]'
    },
    ARCHIVED_TRACE: {
      gridColor: 'rgba(113, 113, 122, 0.02)',
      gridSize: '160px',
      opacity: 0.1,
      containerClass: 'bg-[var(--background)] grayscale'
    }
  };

  const currentStyles = depthStyles[depth] || depthStyles['DEEP_INVESTIGATION'];

  // Stills and locks coordinates/parallax if isRevisited or isStill
  const gridOpacity = useTransform(
    scrollYProgress, 
    [0, 0.1, 0.9, 1], 
    [currentStyles.opacity * 1.5, currentStyles.opacity, currentStyles.opacity, currentStyles.opacity * 1.5]
  );

  const bgSaturation = useTransform(
    scrollYProgress, 
    [0, 0.2], 
    [
      isRevisited || depth === 'ARCHIVED_TRACE' ? 'grayscale(0.85) blur(0px)' : 'grayscale(0)', 
      isRevisited || depth === 'ARCHIVED_TRACE' ? 'grayscale(0.85) blur(0px)' : 'grayscale(0.2)'
    ]
  );

  const depthOptions: { state: DepthState; label: string; desc: string; num: string }[] = [
    { state: 'QUICK_OBSERVATION', label: 'QUCK', desc: 'Minimal metadata, high typography legibility, instant load', num: '01' },
    { state: 'DEEP_INVESTIGATION', label: 'DEEP', desc: 'Interactive evidence lock, slow cinematic pacing, detailed gridding', num: '02' },
    { state: 'UNRESOLVED_FRAGMENT', label: 'FRAG', desc: 'Interactive text decoder glitches, clickable redacted blocks, warning highlights', num: '03' },
    { state: 'ONGOING_SIGNAL', label: 'LIVE', desc: 'Continuous scrolling sonar grid, responsive coordinates, live broadcast blinkers', num: '04' },
    { state: 'ARCHIVED_TRACE', label: 'ARCH', desc: 'Monochrome static visual layer, locked coordinates, zero-movement pacing', num: '05' }
  ];

  return (
    <DepthContext.Provider value={{ depth, setDepth, isStill, isRevisited }}>
      <div 
        ref={containerRef} 
        className={`relative min-h-screen transition-all duration-[2000ms] ${currentStyles.containerClass}`}
      >
        {/* Dynamic Reading Background Grid overlay */}
        <motion.div 
          style={{ opacity: gridOpacity, filter: bgSaturation }}
          className="fixed inset-0 pointer-events-none z-0"
        >
          <div className="w-full h-full" style={{ 
            backgroundImage: `linear-gradient(to right, ${currentStyles.gridColor} 1px, transparent 1px), linear-gradient(to bottom, ${currentStyles.gridColor} 1px, transparent 1px)`,
            backgroundSize: `${currentStyles.gridSize} ${currentStyles.gridSize}`
          }} />
        </motion.div>
        
        {/* Noise Atmosphere */}
        <motion.div 
          style={{ opacity: useTransform(scrollYProgress, [0, 0.15], [depth === 'ONGOING_SIGNAL' ? 0.08 : 0.03, 0.015]) }}
          className="fixed inset-0 noise-texture pointer-events-none z-1"
        />

        {/* Scanline Overlay for Fragmented/Live depths */}
        {(depth === 'UNRESOLVED_FRAGMENT' || depth === 'ONGOING_SIGNAL') && (
          <div className="fixed inset-0 pointer-events-none z-[2] scanline-texture opacity-[0.015] select-none" />
        )}

        {/* Floating Depth Lens HUD (Desktop) */}
        <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-end gap-3 font-mono text-[8px] bg-white/60 p-4 border border-zinc-100 backdrop-blur-[6px] rounded-2xl shadow-[4px_4px_24px_rgba(0,0,0,0.015)] select-none">
          <div className="flex items-center gap-2 border-b border-zinc-100 pb-2 w-full justify-between mb-1">
             <span className="text-[7px] text-zinc-950 font-black letter tracking-widest">DEPTH_LENS</span>
             <span className="text-[6px] text-zinc-300">[{depthOptions.findIndex(o => o.state === depth) + 1}/5]</span>
          </div>

          <div className="flex flex-col gap-1.5 w-full">
            {depthOptions.map((opt) => {
              const isActive = depth === opt.state;
              return (
                <button
                  key={opt.state}
                  onClick={() => setDepth(opt.state)}
                  onMouseEnter={() => setHoveredLensDesc(opt.desc)}
                  onMouseLeave={() => setHoveredLensDesc(null)}
                  className={`flex items-center justify-between gap-4 px-2 py-1.5 rounded text-left border transition-all duration-300 ${
                    isActive 
                      ? 'bg-zinc-950 text-white border-zinc-950' 
                      : 'bg-transparent text-zinc-400 border-transparent hover:border-zinc-100 hover:text-zinc-700'
                  }`}
                >
                  <span className="text-[7px] opacity-65">{opt.num}</span>
                  <span className="font-bold uppercase tracking-widest">{opt.label}</span>
                  <div className={`w-1 h-1 rounded-full ${isActive ? 'bg-emerald-400' : 'bg-transparent'}`} />
                </button>
              );
            })}
          </div>

          {/* Micro explanation slot */}
          <div className="w-28 text-[7px] text-zinc-400/80 leading-normal pt-2 border-t border-zinc-50 italic transition-all duration-300">
            {hoveredLensDesc || `Lens: ${depthOptions.find(o => o.state === depth)?.desc}`}
          </div>

          {isRevisited && (
            <div className="w-full text-center mt-2 pt-2 border-t border-purple-100/30 text-[6.5px] font-bold text-purple-400 animate-pulse bg-purple-50/10 p-1">
              REVISITED: STABILIZED 🔒
            </div>
          )}
        </div>

        {/* Compact Selector HUD (Mobile) */}
        <div className="fixed bottom-0 left-0 w-full z-40 md:hidden bg-white/90 border-t border-zinc-100 backdrop-blur-[8px] px-6 py-4 flex flex-col gap-2 font-mono select-none">
          <div className="flex items-center justify-between text-[7px] text-zinc-400">
            <span className="font-black tracking-widest text-zinc-950">INVESTIGATE_DEPTH_LENS</span>
            <span>{isRevisited ? 'REVISITED [SYSTEM_STABLE]' : 'ACTIVE_TUNER'}</span>
          </div>
          <div className="flex gap-1 justify-between">
            {depthOptions.map((opt) => {
              const isActive = depth === opt.state;
              return (
                <button
                  key={opt.state}
                  onClick={() => setDepth(opt.state)}
                  className={`flex-1 text-center py-1.5 text-[7px] font-bold tracking-tighter border rounded ${
                    isActive 
                      ? 'bg-zinc-950 text-white border-zinc-950' 
                      : 'bg-zinc-50/50 text-zinc-400 border-zinc-100'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="relative z-10 pb-20 md:pb-0">
          {children}
        </div>
      </div>
    </DepthContext.Provider>
  );
};

