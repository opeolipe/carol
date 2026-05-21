import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useArchiveStillness } from './StillnessState';
import { useSignalDrift, driftCoordinate, driftRearrange, driftStateEmphasis } from './SignalDriftState';

interface FieldNote {
  title: string;
  category: string;
  date: string;
  signalState: 'ACTIVE' | 'ARCHIVED' | 'UNRESOLVED' | 'RECENT' | 'DRIFTING' | 'DECAYING';
  coordinates?: string;
  observation: string;
  insight: string;
  unresolvedSignal: string;
  pattern: string;
  slug: string;
}

export const FieldNotesList = ({ initialNotes }: { initialNotes: FieldNote[] }) => {
  const isStill = useArchiveStillness();
  const drift = useSignalDrift();
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [degradeLevel, setDegradeLevel] = useState<Record<string, number>>({});
  const [historyCount, setHistoryCount] = useState<Record<string, number>>({});

  useEffect(() => {
    // Read previous visits to simulate interaction memory or decay
    const stored = localStorage.getItem('field_notes_decay_v1');
    if (stored) {
      setHistoryCount(JSON.parse(stored));
    }
  }, []);

  const handleNoteClick = (slug: string) => {
    setSelectedNote(selectedNote === slug ? null : slug);
    
    // Track interactions to show signal decay / change structure over time
    const updatedCount = { ...historyCount, [slug]: (historyCount[slug] || 0) + 1 };
    setHistoryCount(updatedCount);
    localStorage.setItem('field_notes_decay_v1', JSON.stringify(updatedCount));
    
    // Simulate gradual decay level increase for read item
    if (updatedCount[slug] > 2) {
      setDegradeLevel(prev => ({ ...prev, [slug]: Math.min((updatedCount[slug] - 2) * 0.15, 0.6) }));
    }
  };

  // Dynamically drift and shuffle components depending on overall archive drift coefficients
  const driftedNotes = driftRearrange(initialNotes, drift.visits).map(note => ({
    ...note,
    signalState: driftStateEmphasis(note.signalState, drift.visits, drift.timeDrift),
    coordinates: driftCoordinate(note.coordinates, drift.visits, drift.timeDrift)
  }));

  const filteredNotes = activeFilter === 'ALL' 
    ? driftedNotes 
    : driftedNotes.filter(n => n.signalState === activeFilter);

  const filterStates: ('ALL' | 'ACTIVE' | 'DRIFTING' | 'UNRESOLVED' | 'DECAYING')[] = [
    'ALL', 'ACTIVE', 'DRIFTING', 'UNRESOLVED', 'DECAYING'
  ];

  const stateBadges: Record<string, { color: string; label: string }> = {
    ACTIVE: { color: 'bg-emerald-500', label: 'Active_Signal' },
    DRIFTING: { color: 'bg-purple-500', label: 'Drifting_Signal' },
    UNRESOLVED: { color: 'bg-amber-500', label: 'Unresolved_Focus' },
    DECAYING: { color: 'bg-rose-400', label: 'Signal_Decay' }
  };

  return (
    <div className="space-y-16">
      {/* Editorial Filter Rail */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-100 pb-8">
        <div className="space-y-1">
          <span className="text-[7px] font-mono uppercase tracking-[0.4em] text-zinc-400 font-bold block">Archive_Filter_System</span>
          <span className="text-xs font-mono text-zinc-500">Filter observations by decay state and structural resonance.</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {filterStates.map((state) => (
            <button
              key={state}
              onClick={() => setActiveFilter(state)}
              className={`px-3 py-1 text-[8px] font-mono uppercase tracking-widest border transition-all duration-500 ${
                activeFilter === state 
                  ? 'bg-zinc-950 text-white border-zinc-950' 
                  : 'bg-transparent text-zinc-400 border-zinc-100 hover:border-zinc-300 hover:text-zinc-600'
              }`}
            >
              {state}
            </button>
          ))}
        </div>
      </div>

      {/* Field Notes Column */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredNotes.map((note, index) => {
            const isExpanded = selectedNote === note.slug;
            const decay = degradeLevel[note.slug] || 0;
            const visits = historyCount[note.slug] || 0;
            
            return (
              <motion.div
                key={note.slug}
                layout
                initial={{ opacity: 0, scale: 0.98, y: 15 }}
                animate={{ 
                  opacity: 1 - decay, 
                  scale: 1, 
                  y: 0,
                  filter: decay > 0 ? `blur(${decay * 1.5}px)` : 'blur(0px)'
                }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1], delay: index * 0.05 }}
                className={`group relative p-8 border border-zinc-100 bg-white transition-opacity duration-1000 ${isStill ? 'opacity-80' : 'opacity-100'}`}
              >
                {/* Horizontal Spine Accents */}
                <div className={`absolute top-0 left-0 w-2 h-[1px] bg-zinc-950/20 transition-all duration-[1500ms] ${isStill ? '' : 'group-hover:w-full'}`} />
                <div className="absolute top-0 left-0 w-[1px] h-4 bg-zinc-950/20" />

                {/* Meta Row */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-1.5 h-1.5 rounded-full transition-all duration-1000 ${isStill ? 'bg-zinc-300 shadow-none animate-none' : (stateBadges[note.signalState]?.color || 'bg-zinc-200')}`} />
                    <span className="text-[7px] font-mono text-zinc-300 uppercase tracking-widest">
                      {isStill ? 'STILLED_TEMPORAL' : (stateBadges[note.signalState]?.label || 'Dossier')} / {note.coordinates || 'N/A'}
                    </span>
                  </div>
                  {visits > 0 && (
                     <span className="text-[6px] font-mono text-zinc-400 tracking-wider">
                       Ex_Count: {visits}
                     </span>
                  )}
                </div>

                {/* Title & Core thought */}
                <div className={`space-y-3 ${isStill ? 'cursor-default' : 'cursor-pointer'}`} onClick={() => !isStill && handleNoteClick(note.slug)}>
                  <span className="text-[8px] font-mono text-zinc-400 uppercase tracking-[0.3em] font-medium block">
                    {note.category}
                  </span>
                  <h3 className={`text-xl font-bold tracking-tighter uppercase text-zinc-950 transition-colors duration-1000 ${isStill ? '' : 'group-hover:text-zinc-600'}`}>
                    {note.title}
                  </h3>
                  <div className="pt-2">
                     <p className="text-md font-light text-zinc-700 leading-relaxed italic pr-4">
                       “{note.observation}”
                     </p>
                  </div>
                </div>

                {/* Expand indicator */}
                <div className="pt-6 flex items-center justify-between border-t border-zinc-50 mt-6 select-none">
                  <button 
                    disabled={isStill}
                    onClick={() => !isStill && handleNoteClick(note.slug)}
                    className={`text-[8px] font-mono uppercase tracking-[0.4em] transition-colors duration-1000 ${
                      isStill 
                        ? 'text-zinc-300 cursor-default' 
                        : 'text-zinc-400 hover:text-zinc-950'
                    }`}
                  >
                    {isStill ? '[ Locked_for_Stillness ]' : isExpanded ? 'Collapse_Signal -' : 'Expand_Dossier_Fibers +'}
                  </button>
                  <span className="text-[8px] font-mono text-zinc-300 uppercase block">
                    {new Date(note.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                  </span>
                </div>

                {/* Subconscious Breakdown Panels */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden mt-6 pt-6 border-t border-zinc-100 space-y-6"
                    >
                      {/* One Behavioral Insight */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-zinc-300" />
                          <span className="text-[6px] font-mono uppercase tracking-widest text-zinc-400 font-bold block">Behavioral_Insight</span>
                        </div>
                        <p className="text-sm font-light text-zinc-600 leading-relaxed pl-3 border-l border-zinc-100">
                          {note.insight}
                        </p>
                      </div>

                      {/* One Unresolved Signal */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-[1px] bg-amber-500" />
                          <span className="text-[6px] font-mono uppercase tracking-widest text-zinc-400 font-bold block">Unresolved_Signal_Draft</span>
                        </div>
                        <p className="text-sm font-light text-zinc-500 italic pl-3 border-l border-amber-100">
                          {note.unresolvedSignal}
                        </p>
                      </div>

                      {/* One Internet Pattern Noticed */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-1 h-1 bg-purple-500" />
                          <span className="text-[6px] font-mono uppercase tracking-widest text-zinc-400 font-bold block">Internet_Pattern_Noticed</span>
                        </div>
                        <p className="text-xs font-mono uppercase tracking-widest text-zinc-500 pl-3">
                          {note.pattern}
                        </p>
                      </div>

                      {visits > 3 && (
                        <div className="text-[7px] font-mono text-rose-400 uppercase tracking-widest animate-pulse border border-rose-100/30 p-2 text-center bg-rose-50/10">
                          System Warning: Heavy replication detects atomic signal drift. Decay rate accelerated.
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
