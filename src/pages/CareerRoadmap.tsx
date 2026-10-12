import { useState } from 'react';
import {
  ChevronDown, ChevronUp, CheckCircle2, Circle,
  Clock, Target, Zap, Map, RefreshCw
} from 'lucide-react';
import { storage } from '../lib/localStorage';
import { roadmapTemplates } from '../lib/demoData';
import type { RoadmapPhase } from '../types';
import { cn } from '../lib/utils';

function PhaseCard({ phase, onToggleTask, onMarkComplete }: {
  phase: RoadmapPhase;
  onToggleTask: (phaseId: string, taskId: string) => void;
  onMarkComplete: (phaseId: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const completedTasks = phase.tasks.filter((t) => t.completed).length;

  const statusColor = phase.completed
    ? 'border-emerald-500/30 bg-emerald-500/5'
    : phase.progress > 0
    ? 'border-violet-500/30 bg-violet-500/5'
    : 'border-white/8 bg-transparent';

  return (
    <div className={cn('rounded-2xl border transition-all', statusColor)}>
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm',
            phase.completed ? 'bg-emerald-500/20 text-emerald-400' :
            phase.progress > 0 ? 'bg-violet-500/20 text-violet-400' :
            'bg-white/8 text-slate-400'
          )}>
            {phase.completed ? <CheckCircle2 className="w-5 h-5" /> : phase.id.split('-')[1]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-white font-semibold text-sm">{phase.title}</h3>
                <p className="text-slate-400 text-xs mt-1">{phase.description}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="w-3 h-3" />
                  {phase.duration}
                </div>
                {phase.completed && (
                  <span className="text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">Done</span>
                )}
                {!phase.completed && phase.progress > 0 && (
                  <span className="text-xs bg-violet-500/15 text-violet-400 border border-violet-500/20 px-2 py-0.5 rounded-full">In Progress</span>
                )}
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all', phase.completed ? 'bg-emerald-500' : 'bg-violet-500')}
                  style={{ width: `${phase.progress}%` }}
                />
              </div>
              <span className="text-xs text-slate-500">{completedTasks}/{phase.tasks.length} tasks</span>
            </div>
          </div>
          <button
            onClick={() => setExpanded((e) => !e)}
            className="text-slate-400 hover:text-white transition-colors flex-shrink-0"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-5 pb-5 border-t border-white/5 pt-4 space-y-4 fade-in">
          {/* Objectives */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Target className="w-3 h-3" /> Learning Objectives
            </p>
            <ul className="space-y-1">
              {phase.objectives.map((obj) => (
                <li key={obj} className="flex items-start gap-2 text-xs text-slate-400">
                  <span className="text-violet-400 mt-0.5">•</span>
                  {obj}
                </li>
              ))}
            </ul>
          </div>

          {/* Skills */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Zap className="w-3 h-3" /> Skills to Acquire
            </p>
            <div className="flex flex-wrap gap-1.5">
              {phase.skills.map((skill) => (
                <span key={skill} className="text-xs bg-white/5 text-slate-400 border border-white/8 px-2.5 py-1 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Tasks */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Tasks</p>
            <div className="space-y-2">
              {phase.tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5 cursor-pointer hover:border-white/10 transition-colors"
                  onClick={() => !phase.completed && onToggleTask(phase.id, task.id)}
                >
                  {task.completed
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    : <Circle className="w-4 h-4 text-slate-600 flex-shrink-0" />}
                  <span className={cn('text-sm flex-1', task.completed ? 'text-slate-500 line-through' : 'text-slate-300')}>
                    {task.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {!phase.completed && (
            <button
              onClick={() => onMarkComplete(phase.id)}
              className="w-full py-2.5 rounded-xl border border-emerald-500/30 text-emerald-400 text-sm font-medium hover:bg-emerald-500/10 transition-colors"
            >
              Mark Phase as Complete
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function CareerRoadmap() {
  const profile = storage.getProfile();
  const [phases, setPhases] = useState<RoadmapPhase[]>(() => {
    const saved = storage.getRoadmap();
    if (saved && saved.length > 0) return saved;
    const template = roadmapTemplates[profile?.targetRole ?? 'Software Developer'] ?? roadmapTemplates['Software Developer'];
    return template;
  });
  const [generated, setGenerated] = useState(!!storage.getRoadmap());

  const completedCount = phases.filter((p) => p.completed).length;
  const overallProgress = Math.round(phases.reduce((acc, p) => acc + p.progress, 0) / phases.length);

  const handleToggleTask = (phaseId: string, taskId: string) => {
    setPhases((prev) => {
      const updated = prev.map((phase) => {
        if (phase.id !== phaseId) return phase;
        const tasks = phase.tasks.map((t) => t.id === taskId ? { ...t, completed: !t.completed } : t);
        const done = tasks.filter((t) => t.completed).length;
        const progress = Math.round((done / tasks.length) * 100);
        return { ...phase, tasks, progress, completed: progress === 100 };
      });
      storage.setRoadmap(updated);
      return updated;
    });
  };

  const handleMarkComplete = (phaseId: string) => {
    setPhases((prev) => {
      const updated = prev.map((phase) => {
        if (phase.id !== phaseId) return phase;
        const tasks = phase.tasks.map((t) => ({ ...t, completed: true }));
        return { ...phase, tasks, progress: 100, completed: true };
      });
      storage.setRoadmap(updated);
      storage.addActivity({
        id: Date.now().toString(),
        type: 'roadmap',
        description: `Completed a roadmap phase`,
        timestamp: new Date().toISOString(),
        xp: 50,
      });
      return updated;
    });
  };

  const handleGenerate = () => {
    const role = profile?.targetRole ?? 'Software Developer';
    const template = roadmapTemplates[role] ?? roadmapTemplates['Software Developer'];
    storage.setRoadmap(template);
    setPhases(template);
    setGenerated(true);
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Map className="w-5 h-5 text-violet-400" />
            <h1 className="text-xl font-bold text-white">Career Roadmap</h1>
          </div>
          <p className="text-slate-400 text-sm">
            Personalized for: <span className="text-violet-300 font-medium">{profile?.targetRole ?? 'Software Developer'}</span>
          </p>
        </div>
        <button
          onClick={handleGenerate}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          {generated ? 'Regenerate Roadmap' : 'Generate My Roadmap'}
        </button>
      </div>

      {/* Disclaimer */}
      <div className="bg-blue-500/5 border border-blue-500/15 rounded-xl px-4 py-3 text-xs text-slate-500">
        This roadmap is a personalized recommendation based on your profile. It uses predefined learning templates — not live AI generation. Update your profile to change your target role and roadmap.
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Phases', value: phases.length, color: 'text-white' },
          { label: 'Completed', value: completedCount, color: 'text-emerald-400' },
          { label: 'In Progress', value: phases.filter((p) => p.progress > 0 && !p.completed).length, color: 'text-violet-400' },
          { label: 'Overall Progress', value: `${overallProgress}%`, color: 'text-cyan-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-[#141B31] border border-white/5 rounded-xl p-4 text-center">
            <p className={cn('text-2xl font-bold', color)}>{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Overall progress bar */}
      <div className="bg-[#141B31] border border-white/5 rounded-xl p-4">
        <div className="flex justify-between text-xs text-slate-400 mb-2">
          <span>Overall Roadmap Progress</span>
          <span>{overallProgress}%</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Phases */}
      <div className="space-y-3">
        {phases.map((phase) => (
          <PhaseCard
            key={phase.id}
            phase={phase}
            onToggleTask={handleToggleTask}
            onMarkComplete={handleMarkComplete}
          />
        ))}
      </div>
    </div>
  );
}
