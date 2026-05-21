import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';

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
  const stateColors = {
    ACTIVE: 'bg-emerald-500',
    ARCHIVED: 'bg-zinc-300',
    UNRESOLVED: 'bg-amber-500',
    RECENT: 'bg-blue-500',
    DRIFTING: 'bg-purple-500'
  };

  return (
    <header className="space-y-12 mb-32 md:mb-48 pt-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2, ease: [0.19, 1, 0.22, 1] }}
        className="space-y-8"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-[1px] bg-zinc-950" />
          <span className="text-[10px] font-mono uppercase tracking-[0.6em] text-zinc-950 font-black italic">System_Trace_Initialize</span>
          <div className="ml-auto flex items-center gap-3 bg-zinc-50 px-4 py-1.5 border border-zinc-100 rounded-full">
             <motion.div 
               animate={{ opacity: [0.3, 1, 0.3], x: state === 'DRIFTING' ? [0, 2, -2, 0] : 0 }}
               transition={{ duration: state === 'DRIFTING' ? 0.5 : 2, repeat: Infinity }}
               className={`w-2 h-2 rounded-full ${stateColors[state]}`} 
             />
             <span className="text-[7px] font-mono uppercase tracking-[0.3em] text-zinc-500 font-bold">{state}</span>
             {state === 'DRIFTING' && (
               <span className="text-[6px] font-mono text-purple-400 animate-pulse">[ DRIFT_DETECTED ]</span>
             )}
          </div>
        </div>
        <h1 className="text-[clamp(3rem,8vw,10rem)] font-bold tracking-tighter text-zinc-950 leading-[0.85] uppercase max-w-6xl">
          {title}
        </h1>
        <p className="text-[clamp(1.2rem,2.2vw,2.2rem)] font-light text-zinc-400 leading-tight tracking-tight max-w-4xl italic">
          {description}
        </p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 pt-12">
        {metadata.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.8 + i * 0.15 }}
          >
            <MetadataItem {...m} />
          </motion.div>
        ))}
      </div>
    </header>
  );
};

export const UnresolvedQuestion = ({ children }: { children: React.ReactNode }) => (
  <motion.div 
    initial={{ opacity: 0, x: 10 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className="my-16 md:my-24 p-8 md:p-12 border-2 border-dashed border-zinc-100 flex gap-8 items-center bg-zinc-50/30"
  >
    <div className="text-[2rem] md:text-[3rem] font-black text-zinc-200">?</div>
    <div className="space-y-2">
       <span className="text-[7px] font-mono uppercase tracking-[0.4em] text-zinc-400 font-bold">Unresolved_Structural_Ambiguity</span>
       <p className="text-[14px] md:text-[18px] font-light text-zinc-500 leading-tight italic">
         {children}
       </p>
    </div>
  </motion.div>
);

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

  return (
    <motion.section 
      ref={ref}
      initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: "-10% 0px" }}
      animate={{ 
        opacity: isInView ? 1 : 0.35,
        scale: isInView ? 1 : 0.97,
        filter: isInView ? 'blur(0px)' : 'blur(4px)'
      }}
      transition={{ duration: 1.8, ease: [0.19, 1, 0.22, 1] }}
      className="relative py-12 md:py-32 border-l border-zinc-100 pl-6 md:pl-20 mb-8 md:mb-16 transition-all duration-1000"
    >
      <div className={`absolute -left-3 top-1/2 -translate-y-1/2 h-[1px] transition-all duration-1000 ${isInView ? 'bg-zinc-950 w-12' : 'bg-zinc-200 w-6'}`} />
      <span className={`text-[8px] md:text-[9px] font-mono uppercase tracking-[0.5em] font-bold block mb-6 md:mb-10 transition-colors duration-1000 ${isInView ? 'text-zinc-950' : 'text-zinc-200'}`}>{label}</span>
      <div className="text-[clamp(1.1rem,1.8vw,1.8rem)] font-light text-zinc-800 leading-relaxed md:leading-[1.8] tracking-normal max-w-4xl selection:bg-zinc-950 selection:text-white">
        {children}
      </div>
    </motion.section>
  );
};


export const InvestigationEvidence = ({ src, alt, caption, metadata, details }: { src?: string; alt?: string; caption?: string; metadata?: MetadataProps[]; details?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-15% 0px -15% 0px" });
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      animate={{ 
        opacity: isInView ? 1 : 0.45,
        filter: isInView ? 'none' : 'grayscale(0.6) blur(2px)'
      }}
      transition={{ duration: 2.5, ease: [0.19, 1, 0.22, 1] }}
      className="my-16 md:my-48 space-y-6 md:space-y-10 transition-all duration-[1500ms]"
    >
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="relative aspect-[4/3] md:aspect-[21/9] bg-zinc-50 border border-zinc-100 overflow-hidden flex items-center justify-center group shrink-0 cursor-crosshair"
      >
         {src ? (
           <img src={src} alt={alt} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-[4000ms] ease-out" />
         ) : (
           <div className="text-[10px] md:text-[12px] font-mono text-zinc-200 uppercase tracking-[0.8em] font-black italic">
             {isExpanded ? "[ DEEP_TRACE_ACTIVE ]" : "[ FRAGMENT_LOCKED ]"}
           </div>
         )}
         <div className="absolute inset-0 noise-texture opacity-[0.04] pointer-events-none" />
         <div className="absolute top-4 left-4 md:top-8 md:left-8 flex items-center gap-3">
           <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-colors duration-1000 ${isInView ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-300'}`} />
           <span className="text-[7px] md:text-[8px] font-mono text-zinc-950 uppercase tracking-[0.5em] font-black">
             {isExpanded ? "Investigation_Expanded" : "Active_Trace_Lock"}
           </span>
         </div>
         {isExpanded && (
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
          
          {isExpanded && details && (
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
            {isExpanded && (
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
     <div className="absolute -top-[1.2rem] left-1/2 -translate-x-1/2 bg-[#fbfbf9] px-12">
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
  traces 
}: { 
  traces: { title: string; slug: string; investigationId?: string; category?: string }[] 
}) => {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('archive_memory_v1');
    if (stored) setHistory(JSON.parse(stored));
  }, []);

  return (
    <section className="mt-32 pb-64">
      <div className="flex items-center gap-4 mb-16">
        <div className="w-12 h-[1px] bg-zinc-950" />
        <span className="text-[10px] font-mono uppercase tracking-[0.6em] text-zinc-950 font-black">Connected_Pathways</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {traces.map((trace, i) => {
          const isExamined = history.includes(trace.slug);
          return (
            <motion.a
              key={trace.slug}
              href={`/carol/blog/${trace.slug}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: i * 0.1 }}
              className="group relative p-8 border border-zinc-100 hover:border-zinc-950 transition-all duration-700 bg-white"
            >
              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-start">
                  <span className="text-[7px] font-mono text-zinc-300 uppercase tracking-widest">{trace.investigationId || "TRC-7429"}</span>
                  {isExamined && (
                    <span className="text-[6px] font-mono text-emerald-500 uppercase tracking-widest border border-emerald-100 px-2 py-0.5 rounded-full bg-emerald-50/30">Already_Examined</span>
                  )}
                </div>
                <h3 className="text-[1.5rem] font-bold tracking-tighter uppercase leading-none group-hover:tracking-normal transition-all duration-700">
                  {trace.title}
                </h3>
                <div className="flex items-center gap-4 pt-4">
                  <div className="w-6 h-[1px] bg-zinc-200 group-hover:bg-zinc-950 group-hover:w-10 transition-all duration-700" />
                  <span className="text-[8px] font-mono uppercase tracking-[0.4em] text-zinc-400 group-hover:text-zinc-950 transition-colors">Follow_Signal →</span>
                </div>
              </div>
              
              {/* Background ID Watermark */}
              <div className="absolute bottom-4 right-4 text-[4rem] font-black text-zinc-950/[0.02] pointer-events-none select-none tracking-tighter uppercase">
                {trace.category || "TRACE"}
              </div>
            </motion.a>
          );
        })}
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
  
  useEffect(() => {
    if (slug) {
      const stored = localStorage.getItem('archive_memory_v1');
      const history = stored ? JSON.parse(stored) : [];
      if (!history.includes(slug)) {
        localStorage.setItem('archive_memory_v1', JSON.stringify([...history, slug]));
      }
    }
  }, [slug]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const stateGridColors = {
    ACTIVE: '#000',
    ARCHIVED: '#71717a',
    UNRESOLVED: '#d97706',
    RECENT: '#2563eb',
    DRIFTING: '#7c3aed'
  };

  const gridOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0.05, 0.015, 0.015, 0.05]);
  const bgSaturation = useTransform(scrollYProgress, [0, 0.2], ["grayscale(0)", "grayscale(0.2)"]);

  return (
    <div ref={containerRef} className="relative min-h-screen transition-all duration-[2000ms]">
      {/* Dynamic Reading Background */}
      <motion.div 
        style={{ opacity: gridOpacity, filter: bgSaturation }}
        className="fixed inset-0 pointer-events-none z-0"
      >
        <div className="w-full h-full" style={{ 
          backgroundImage: `linear-gradient(to right, ${stateGridColors[state]} 1px, transparent 1px), linear-gradient(to bottom, ${stateGridColors[state]} 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }} />
      </motion.div>
      
      {/* Noise Atmosphere */}
      <motion.div 
        style={{ opacity: useTransform(scrollYProgress, [0, 0.15], [state === 'DRIFTING' ? 0.06 : 0.03, 0.015]) }}
        className="fixed inset-0 noise-texture pointer-events-none z-1"
      />
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

