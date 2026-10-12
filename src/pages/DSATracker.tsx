import { useState, useMemo } from 'react';
import { Code2, ExternalLink, CheckCircle2, Circle, Clock, Filter, Search } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { dsaProblems } from '../lib/demoData';
import { storage } from '../lib/localStorage';
import type { DSAProblem, DSAStatus, DSADifficulty } from '../types';
import { cn } from '../lib/utils';

const TOPICS = ['All', 'Arrays', 'Strings', 'Linked Lists', 'Stacks & Queues', 'Searching & Sorting', 'Recursion', 'Trees', 'Graphs', 'Dynamic Programming'];
const DIFFICULTIES: (DSADifficulty | 'All')[] = ['All', 'Easy', 'Medium', 'Hard'];
const STATUSES: (DSAStatus | 'All')[] = ['All', 'Solved', 'Attempted', 'Not Started'];

const diffColor: Record<DSADifficulty, string> = {
  Easy: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  Hard: 'text-red-400 bg-red-500/10 border-red-500/20',
};

const statusConfig: Record<DSAStatus, { icon: React.ElementType; color: string; label: string }> = {
  Solved: { icon: CheckCircle2, color: 'text-emerald-400', label: 'Solved' },
  Attempted: { icon: Clock, color: 'text-yellow-400', label: 'Attempted' },
  'Not Started': { icon: Circle, color: 'text-slate-600', label: 'Not Started' },
};

export default function DSATracker() {
  const savedProgress = storage.getDSAProgress();
  const [progress, setProgress] = useState<Record<string, DSAStatus>>(() => {
    const initial: Record<string, DSAStatus> = {};
    dsaProblems.forEach((p) => {
      initial[p.id] = savedProgress[p.id] ?? p.status;
    });
    return initial;
  });

  const [topic, setTopic] = useState('All');
  const [difficulty, setDifficulty] = useState<DSADifficulty | 'All'>('All');
  const [status, setStatus] = useState<DSAStatus | 'All'>('All');
  const [search, setSearch] = useState('');

  const updateStatus = (id: string, newStatus: DSAStatus) => {
    const updated = { ...progress, [id]: newStatus };
    setProgress(updated);
    storage.setDSAProgress(updated);
    if (newStatus === 'Solved') {
      storage.addActivity({
        id: Date.now().toString(),
        type: 'dsa',
        description: `Solved "${dsaProblems.find((p) => p.id === id)?.title}"`,
        timestamp: new Date().toISOString(),
        xp: 10,
      });
    }
  };

  const filteredProblems = useMemo(() => {
    return dsaProblems.filter((p) => {
      if (topic !== 'All' && p.topic !== topic) return false;
      if (difficulty !== 'All' && p.difficulty !== difficulty) return false;
      if (status !== 'All' && progress[p.id] !== status) return false;
      if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [topic, difficulty, status, search, progress]);

  const totalSolved = Object.values(progress).filter((s) => s === 'Solved').length;
  const totalAttempted = Object.values(progress).filter((s) => s === 'Attempted').length;
  const total = dsaProblems.length;

  const topicStats = TOPICS.filter((t) => t !== 'All').map((t) => {
    const probs = dsaProblems.filter((p) => p.topic === t);
    const solved = probs.filter((p) => progress[p.id] === 'Solved').length;
    return { topic: t.split(' ')[0], solved, total: probs.length };
  });

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Code2 className="w-5 h-5 text-violet-400" />
          <h1 className="text-xl font-bold text-white">DSA Tracker</h1>
        </div>
        <p className="text-slate-400 text-sm">Track your coding preparation across all major topics.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Problems', value: total, color: 'text-white' },
          { label: 'Solved', value: totalSolved, color: 'text-emerald-400' },
          { label: 'Attempted', value: totalAttempted, color: 'text-yellow-400' },
          { label: 'Completion', value: `${Math.round((totalSolved / total) * 100)}%`, color: 'text-violet-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-[#141B31] border border-white/5 rounded-xl p-4 text-center">
            <p className={cn('text-2xl font-bold', color)}>{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-[#141B31] border border-white/5 rounded-2xl p-5">
        <h3 className="text-white font-semibold text-sm mb-4">Topic-wise Progress</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={topicStats} barSize={16}>
            <XAxis dataKey="topic" tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#141B31', border: '1px solid #1E2A48', borderRadius: '10px', fontSize: '12px' }}
              labelStyle={{ color: '#F8FAFC' }}
            />
            <Bar dataKey="total" fill="#1E2A48" radius={[4, 4, 0, 0]} name="Total" />
            <Bar dataKey="solved" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="Solved" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Filters */}
      <div className="bg-[#141B31] border border-white/5 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-300">Filters</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search problems..."
              className="bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-300 placeholder-slate-500 w-44 focus:outline-none focus:border-violet-500/50"
            />
          </div>
          <select value={topic} onChange={(e) => setTopic(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none">
            {TOPICS.map((t) => <option key={t} value={t} className="bg-[#141B31]">{t}</option>)}
          </select>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as DSADifficulty | 'All')}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none">
            {DIFFICULTIES.map((d) => <option key={d} value={d} className="bg-[#141B31]">{d}</option>)}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value as DSAStatus | 'All')}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none">
            {STATUSES.map((s) => <option key={s} value={s} className="bg-[#141B31]">{s}</option>)}
          </select>
        </div>
        <p className="text-xs text-slate-500">{filteredProblems.length} problems shown</p>
      </div>

      {/* Problems table */}
      <div className="bg-[#141B31] border border-white/5 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 gap-2 px-5 py-3 border-b border-white/5 text-xs font-medium text-slate-500 uppercase tracking-wider">
          <div className="col-span-1">Status</div>
          <div className="col-span-5">Problem</div>
          <div className="col-span-3 hidden sm:block">Topic</div>
          <div className="col-span-2">Difficulty</div>
          <div className="col-span-1">Link</div>
        </div>
        <div className="divide-y divide-white/3">
          {filteredProblems.length === 0 && (
            <div className="p-8 text-center">
              <Code2 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-500 text-sm">No problems match your filters.</p>
            </div>
          )}
          {filteredProblems.map((problem) => {
            const currentStatus = progress[problem.id] ?? problem.status;
            const cfg = statusConfig[currentStatus];
            const StatusIcon = cfg.icon;

            return (
              <div key={problem.id} className="grid grid-cols-12 gap-2 px-5 py-3 items-center hover:bg-white/2 transition-colors">
                {/* Status toggle */}
                <div className="col-span-1">
                  <div className="relative group">
                    <StatusIcon className={cn('w-4 h-4 cursor-pointer', cfg.color)} />
                    <div className="absolute left-6 top-0 z-10 hidden group-hover:block bg-[#141B31] border border-white/10 rounded-xl shadow-xl min-w-36 p-1">
                      {(['Solved', 'Attempted', 'Not Started'] as DSAStatus[]).map((s) => {
                        const sc = statusConfig[s];
                        const Ic = sc.icon;
                        return (
                          <button key={s} onClick={() => updateStatus(problem.id, s)}
                            className={cn('flex items-center gap-2 w-full px-3 py-1.5 rounded-lg text-xs hover:bg-white/5 transition-colors', sc.color)}>
                            <Ic className="w-3.5 h-3.5" />
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="col-span-5">
                  <p className="text-sm text-slate-300 font-medium truncate">{problem.title}</p>
                </div>
                <div className="col-span-3 hidden sm:block">
                  <span className="text-xs text-slate-500">{problem.topic}</span>
                </div>
                <div className="col-span-2">
                  <span className={cn('text-xs border px-2 py-0.5 rounded-full font-medium', diffColor[problem.difficulty])}>
                    {problem.difficulty}
                  </span>
                </div>
                <div className="col-span-1">
                  {problem.url ? (
                    <a href={problem.url} target="_blank" rel="noopener noreferrer"
                      className="text-slate-500 hover:text-cyan-400 transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : <span className="text-slate-700 text-xs">—</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
