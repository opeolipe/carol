import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sparkles, Footprints, AlertCircle, RefreshCw, Layers, Compass, ExternalLink } from 'lucide-react';
import { useArchiveStillness } from './StillnessState';

interface ArchiveNode {
  id: string;
  title: string;
  type: 'INVESTIGATION' | 'FIELD_NOTE' | 'ACTIVE_SIGNAL';
  state: 'ACTIVE' | 'ARCHIVED' | 'UNRESOLVED' | 'RECENT' | 'DRIFTING' | 'DECAYING';
  category: string;
  url?: string;
  description: string;
  observedDate: string;
  resonanceCoeff: number; // For styling float levels
  coordinates: string;
}

interface CategorySpec {
  id: string;
  name: string;
  code: string;
  description: string;
  icon: any;
  subLabels: string[];
}

export const ArchiveAtlas = ({ 
  investigations, 
  fieldNotes, 
  activeSignals 
}: { 
  investigations: any[]; 
  fieldNotes: any[]; 
  activeSignals: any[]; 
}) => {
  const isStill = useArchiveStillness();
  const [selectedCategory, setSelectedCategory] = useState<string>('CAT-TRST');
  const [visitedNodes, setVisitedNodes] = useState<string[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [simulationState, setSimulationState] = useState<'IDLE' | 'ANALYZING' | 'LOCKED'>('IDLE');
  const [activeTab, setActiveTab] = useState<'MAP' | 'CONSTELLATION'>('MAP');

  const categories: CategorySpec[] = [
    {
      id: 'CAT-TRST',
      name: 'Trust Systems',
      code: 'TRST-900',
      description: 'System-wide architectures designed to manipulate or secure confidence and institutional authority.',
      icon: Shield,
      subLabels: ['Credential Simulation', 'Asymmetric Disclosure', 'Authentication Drift']
    },
    {
      id: 'CAT-PSYC',
      name: 'Scam Psychology',
      code: 'PSYC-240',
      description: 'The behavioral exploitation of fear, cognitive fatigue, and panic-driven cognitive tunnel vision.',
      icon: AlertCircle,
      subLabels: ['Frictionless Traps', 'Urgency Injectors', 'Commitment Hooks']
    },
    {
      id: 'CAT-INTF',
      name: 'Interface Behavior',
      code: 'INTF-112',
      description: 'Micro-animations, haptic feedback profiles, and reactive layouts designed to provoke spatial action.',
      icon: Layers,
      subLabels: ['Cursor Entrapment', 'Whitespace Gravity', 'Gaze Locking']
    },
    {
      id: 'CAT-AIEX',
      name: 'AI Experiments',
      code: 'AIEX-089',
      description: 'Observations regarding generative mimicry, deliberate authority delays, and automated community synthesis.',
      icon: Sparkles,
      subLabels: ['Dynamic Text Generation', 'Artificial Authority Loops', 'Sycophancy Triggers']
    },
    {
      id: 'CAT-UNRS',
      name: 'Unresolved Traces',
      code: 'UNRS-404',
      description: 'Faded signals, untargeted anomalies, and suspicious computational latencies with zero server-side attribution.',
      icon: Compass,
      subLabels: ['Ghost Background Work', 'Telemetry Overflow', 'Dormant Port Activity']
    },
    {
      id: 'CAT-SIDE',
      name: 'Side Quests',
      code: 'SIDE-007',
      description: 'Ad-hoc deep dives into rogue application mechanics, dark-domain exploration, and personal trust auditing.',
      icon: Footprints,
      subLabels: ['Off-Book Audits', 'Manual Deconstruction', 'Decoy Routing']
    },
    {
      id: 'CAT-TRIG',
      name: 'Behavioral Triggers',
      code: 'TRIG-515',
      description: 'Design choices that act as psychological detonators, forcing immediate motor reaction or compliance.',
      icon: RefreshCw,
      subLabels: ['Compulsivity Anchors', 'Fear-of-Missing-Out Gauges', 'Saccade Interruptions']
    }
  ];

  // Map incoming database nodes under specific Atlas Categories dynamically for connected exploration
  const getMappedNodes = (): ArchiveNode[] => {
    const list: ArchiveNode[] = [];

    // Map blog investigations (with custom mappings to fit our editorial Categories)
    investigations.forEach((inv, i) => {
      let cat = 'CAT-TRST';
      if (inv.slug.includes('silence')) cat = 'CAT-INTF';
      if (inv.slug.includes('product')) cat = 'CAT-TRST';
      if (inv.slug.includes('hello')) cat = 'CAT-SIDE';

      list.push({
        id: `inv-${inv.slug}`,
        title: inv.title,
        type: 'INVESTIGATION',
        state: (inv.signalState as any) || 'ACTIVE',
        category: cat,
        url: `/carol/blog/${inv.slug}`,
        description: inv.description,
        observedDate: inv.date,
        resonanceCoeff: 0.15 + (i * 0.08),
        coordinates: inv.investigationId || `TRC-${i}09`
      });
    });

    // Map Field Notes
    fieldNotes.forEach((fn, i) => {
      let cat = 'CAT-PSYC';
      if (fn.slug.includes('scam')) cat = 'CAT-PSYC';
      if (fn.slug.includes('stress')) cat = 'CAT-TRIG';
      if (fn.slug.includes('institutional')) cat = 'CAT-TRST';
      if (fn.slug.includes('latency')) cat = 'CAT-AIEX';

      list.push({
        id: `fn-${fn.slug}`,
        title: fn.title,
        type: 'FIELD_NOTE',
        state: (fn.signalState as any) || 'UNRESOLVED',
        category: cat,
        url: `/carol/notes`, // redirects to Field Notes page with active highlight
        description: fn.observation,
        observedDate: fn.date,
        resonanceCoeff: 0.22 + (i * 0.05),
        coordinates: fn.coordinates || `SYS-TRC-${i}12`
      });
    });

    // Map Active Signals
    activeSignals.forEach((sig, i) => {
      let cat = 'CAT-UNRS';
      if (sig.slug?.includes('urgency') || sig.observation.includes('URGENCY')) cat = 'CAT-TRIG';
      if (sig.slug?.includes('trust') || sig.observation.includes('TRUST')) cat = 'CAT-AIEX';
      if (sig.slug?.includes('scam') || sig.observation.includes('SCAM')) cat = 'CAT-PSYC';

      list.push({
        id: `sig-${i}`,
        title: sig.category,
        type: 'ACTIVE_SIGNAL',
        state: (sig.status === 'TRACKING' ? 'ACTIVE' : sig.status === 'DRIFTING' ? 'DRIFTING' : 'ARCHIVED') as any,
        category: cat,
        description: sig.observation,
        observedDate: sig.timestamp,
        resonanceCoeff: 0.12 + (i * 0.07),
        coordinates: sig.coordinates || `LIVE-LOC-${i}8`
      });
    });

    return list;
  };

  const allNodes = getMappedNodes();
  const filteredNodes = allNodes.filter(node => node.category === selectedCategory);

  useEffect(() => {
    const stored = localStorage.getItem('atlas_explore_history_v1');
    if (stored) {
      setVisitedNodes(JSON.parse(stored));
    }
  }, []);

  const handleNodeInspect = (nodeId: string) => {
    if (!visitedNodes.includes(nodeId)) {
      const updated = [...visitedNodes, nodeId];
      setVisitedNodes(updated);
      localStorage.setItem('atlas_explore_history_v1', JSON.stringify(updated));
    }

    setSimulationState('ANALYZING');
    setTimeout(() => {
      setSimulationState('LOCKED');
    }, 850);
  };

  return (
    <div className="space-y-16">
      {/* Narrative Entry Track / Status Meter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-100 pb-8">
        <div className="space-y-1">
          <span className="text-[7px] font-mono uppercase tracking-[0.4em] text-zinc-400 font-bold block">Archive_Trace_Systems</span>
          <span className="text-xs font-mono text-zinc-500">
            A real-time structural constellation map revealing resonance between independent traces.
          </span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex bg-zinc-50 border border-zinc-100 p-1 rounded-full">
            <button
              onClick={() => setActiveTab('MAP')}
              className={`px-4 py-1.5 text-[8px] font-mono uppercase tracking-widest rounded-full transition-all duration-300 ${activeTab === 'MAP' ? 'bg-zinc-950 text-white' : 'text-zinc-400 hover:text-zinc-900'}`}
            >
              Signal_Overlay
            </button>
            <button
              onClick={() => setActiveTab('CONSTELLATION')}
              className={`px-4 py-1.5 text-[8px] font-mono uppercase tracking-widest rounded-full transition-all duration-300 ${activeTab === 'CONSTELLATION' ? 'bg-zinc-950 text-white' : 'text-zinc-400 hover:text-zinc-900'}`}
            >
              Systemic_Topology
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Interface Area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start relative min-h-[500px]">
        {/* Left Side: Editorial Category Selectors with designation IDs */}
        <div className="md:col-span-4 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-zinc-100">
            <div className="w-1.5 h-1.5 bg-zinc-950" />
            <span className="text-[7px] font-mono uppercase tracking-[0.4em] text-zinc-950 font-black">Investigation_Portals</span>
          </div>

          <div className="space-y-2 md:space-y-3">
            {categories.map((catSpec) => {
              const IconComp = catSpec.icon;
              const isSelected = selectedCategory === catSpec.id;
              
              return (
                <button
                  key={catSpec.id}
                  onClick={() => {
                    if (isStill) return; // Reduce interaction density
                    setSelectedCategory(catSpec.id);
                    setSimulationState('IDLE');
                  }}
                  className={`w-full text-left p-4 md:p-5 border transition-all duration-1000 relative overflow-hidden group ${
                    isSelected 
                      ? 'bg-zinc-950 border-zinc-950 text-white' 
                      : isStill 
                      ? 'bg-white border-zinc-100/60 opacity-60 cursor-default'
                      : 'bg-white border-zinc-100 hover:border-zinc-300 hover:bg-zinc-50/50'
                  }`}
                >
                  {/* Category Code Label */}
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-[7px] font-mono uppercase tracking-widest ${
                      isSelected 
                        ? 'text-zinc-400' 
                        : isStill 
                        ? 'text-zinc-300'
                        : 'text-zinc-300 group-hover:text-zinc-500'
                    }`}>
                      {catSpec.code}
                    </span>
                    <IconComp className={`w-3.5 h-3.5 transition-transform duration-1000 ${
                      isSelected 
                        ? 'text-emerald-400 opacity-100 rotate-12' 
                        : isStill 
                        ? 'text-zinc-200 opacity-40'
                        : 'text-zinc-300 group-hover:rotate-12'
                    }`} />
                  </div>

                  {/* Category Bold Name */}
                  <h3 className="text-sm font-bold tracking-tighter uppercase mb-2">
                    {catSpec.name}
                  </h3>

                  {/* Sub labels row - quiet and minimal */}
                  <div className="flex flex-wrap gap-x-3 gap-y-1 pt-2 border-t border-zinc-50/10">
                    {catSpec.subLabels.slice(0, 2).map((label, idx) => (
                      <span key={idx} className={`text-[6px] font-mono uppercase tracking-widest ${
                        isSelected 
                          ? 'text-zinc-500' 
                          : isStill 
                          ? 'text-zinc-300'
                          : 'text-zinc-300 group-hover:text-zinc-400'
                      }`}>
                        {label}
                      </span>
                    ))}
                  </div>

                  {/* Decorative indicator lines */}
                  {isSelected && (
                    <motion.div 
                      layoutId="portalActiveSpine"
                      className="absolute left-0 top-0 bottom-0 w-[3px] bg-emerald-500"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side Column: Active Atlas Constellation Drawing & Dynamic Display */}
        <div className="md:col-span-8 space-y-8 min-h-[500px] flex flex-col justify-between">
          
          {/* Constellation Workspace Canvas */}
          <div className="relative border border-zinc-100 p-8 min-h-[420px] bg-zinc-50/20 flex flex-col justify-between select-none">
            
            {/* Geometric Grid Background Elements */}
            <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-[0.03] pointer-events-none">
              {Array.from({ length: 36 }).map((_, idx) => (
                <div key={idx} className="border-r border-b border-zinc-950" />
              ))}
            </div>

            {/* Simulated Live Metadata */}
            <div className="flex justify-between items-start text-[6px] font-mono text-zinc-400 uppercase tracking-[0.2em] relative z-10">
              <div>
                [ SYSTEM_COALESCENCE: ACTIVE ] <br />
                RESOLVED_DISSENT_COEFF: {(filteredNodes.length * 0.14).toFixed(2)}
              </div>
              <div className="text-right">
                OBS_ANCHOR_RANGE: <span className="text-zinc-950 font-bold">{selectedCategory}</span> <br />
                SYS_CYCLE: {new Date().toLocaleTimeString('en-US', { hour12: false })} UTC
              </div>
            </div>

            {/* Dynamic Svg Inter-Node Pathways Connector */}
            {activeTab === 'CONSTELLATION' && (
              <div className="absolute inset-0 pointer-events-none z-0">
                <svg className="w-full h-full opacity-30">
                  <AnimatePresence>
                    {filteredNodes.map((node, i) => {
                      // Custom staggered positions based on metrics to create real-time connection paths
                      const startX = 20;
                      const startY = 100 + i * 40;
                      const endX = 240 + (i * 45) % 180;
                      const endY = 80 + i * 65;

                      return (
                        <motion.path
                          key={node.id}
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 0.6 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1.5, delay: i * 0.1, ease: 'easeInOut' }}
                          d={`M ${startX} ${startY} Q ${(startX + endX) / 2 - 40} ${endY - 20}, ${endX} ${endY}`}
                          fill="none"
                          stroke={node.state === 'DRIFTING' ? '#7c3aed' : node.state === 'UNRESOLVED' ? '#f59e0b' : '#10b981'}
                          strokeWidth="0.5"
                          strokeDasharray="4, 4"
                        />
                      );
                    })}
                  </AnimatePresence>
                </svg>
              </div>
            )}

            {/* Main Interactive Node Network container */}
            <div className="relative z-10 my-8 space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredNodes.map((node, idx) => {
                  const isVisited = visitedNodes.includes(node.id);
                  const isHovered = hoveredNode === node.id;
                  
                  // Motion effects based on current systemic signalState
                  const isDrifting = node.state === 'DRIFTING';
                  const isDecaying = node.state === 'DECAYING';
                  const isUnresolved = node.state === 'UNRESOLVED';

                  return (
                    <motion.div
                      key={node.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ 
                        opacity: isDecaying ? 0.6 : 1, 
                        x: 0,
                        y: isDrifting && !isStill ? [0, -4, 4, 0] : 0,
                      }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ 
                        duration: isStill ? 1.5 : 0.8, 
                        ease: [0.19, 1, 0.22, 1], 
                        delay: idx * 0.05,
                        y: isDrifting && !isStill ? { duration: 4, repeat: Infinity, ease: 'easeInOut' } : undefined
                      }}
                      onMouseEnter={() => !isStill && setHoveredNode(node.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                      onClick={() => !isStill && handleNodeInspect(node.id)}
                      className={`p-4 bg-white border transition-all duration-1000 relative ${
                        isStill 
                          ? 'border-zinc-100 opacity-80 cursor-default' 
                          : isHovered 
                          ? 'border-zinc-950 translation-x-1 shadow-[8px_8px_24px_rgba(0,0,0,0.02)]' 
                          : 'border-zinc-100'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1 flex-grow">
                          <div className="flex items-center gap-3">
                            <span className="text-[7px] font-mono text-zinc-300 uppercase tracking-widest font-black">
                              {node.coordinates}
                            </span>
                            <span className={`text-[6px] font-mono uppercase px-2 py-0.5 rounded-full border ${
                              isStill ? 'text-zinc-400 border-zinc-100 bg-zinc-50' :
                              isUnresolved ? 'text-amber-500 border-amber-100 bg-amber-50/30 font-bold' :
                              isDrifting ? 'text-purple-500 border-purple-100 bg-purple-50/30' :
                              isDecaying ? 'text-rose-400 border-rose-100 bg-rose-50/10 font-black' :
                              'text-emerald-500 border-emerald-100 bg-emerald-50/30'
                            }`}>
                              {isStill ? 'STILLED' : node.state}
                            </span>
                            {isVisited && (
                              <span className="text-[6px] font-mono text-zinc-400 tracking-wider">
                                [ Trace_Retained ]
                              </span>
                            )}
                          </div>
                          
                          <h4 className="text-sm font-bold uppercase tracking-tight text-zinc-950">
                            {node.title}
                          </h4>
                          <p className="text-xs font-light text-zinc-500 line-clamp-2 max-w-xl italic">
                            {node.description}
                          </p>
                        </div>

                        {/* Direct Follow Connection link */}
                        {node.url && (
                          <a
                            href={isStill ? undefined : node.url}
                            className={`p-2 border rounded-full transition-all duration-1000 flex items-center justify-center ${
                              isHovered && !isStill 
                                ? 'bg-zinc-950 border-zinc-950 text-white' 
                                : 'bg-transparent border-zinc-100 text-zinc-400'
                            }`}
                            aria-label={`Inspect trace on ${node.title}`}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {filteredNodes.length === 0 && (
                <div className="py-16 text-center space-y-3">
                  <div className="w-8 h-px bg-zinc-200 mx-auto" />
                  <span className="text-[7px] font-mono text-zinc-300 uppercase tracking-[0.4em] block">Zero_Attribution_Matches</span>
                  <p className="text-xs font-light text-zinc-400 italic">No nodes are currently operating in this quadrant range.</p>
                </div>
              )}
            </div>

            {/* Bottom-right coordinates tracker */}
            <div className="flex justify-between items-end border-t border-zinc-100 pt-4 text-[6px] font-mono text-zinc-400 uppercase tracking-[0.2em] relative z-10">
              <span>ACTIVE_RESONANCE_INDEX: {filteredNodes.length} MATCHES</span>
              <span>© CAROLINE_TERMINAL_2026</span>
            </div>
          </div>

          {/* Connected Trace Explainer Section */}
          <div className="border border-zinc-100 p-6 md:p-8 bg-zinc-50/20 space-y-4">
             <div className="flex items-center gap-3">
                <div className={`w-2 h-[1px] bg-zinc-950 transition-all duration-1000 ${isStill ? 'opacity-30' : 'animate-pulse'}`} />
                <span className={`text-[7px] font-mono uppercase tracking-[0.4em] font-black transition-colors duration-1000 ${isStill ? 'text-purple-400' : 'text-zinc-950'}`}>
                  {isStill ? 'TEMPORAL_DRIFT_LOCKED_STILLNESS_ENGAGED' : 'Topology_Analysis_Ready'}
                </span>
             </div>
             <p className="text-[12px] font-light text-zinc-600 leading-relaxed italic pr-4">
               Each category represents an overarching behavioral system. Hover over any portal mapping on the left to trace how disparate data streams (comprising completed Investigations, active Field Notes, and persistent global monitoring Signals) interlock. Hovering elements reveals structural resonance pathways designed specifically to preserve context.
             </p>
          </div>

        </div>
      </div>
    </div>
  );
};
