import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from 'recharts';
import {
  TrendingUp, Code2, Flame, Star, ArrowRight,
  CheckCircle2, Clock, Zap, BookOpen, Map, FileText, Mic2,
} from 'lucide-react';
import { storage } from '../lib/localStorage';
import { defaultStats, weeklyActivity, sampleActivity, skillsData } from '../lib/demoData';
import type { ActivityEntry } from '../types';
import { cn } from '../lib/utils';

function StatCard({ label, value, icon: Icon, color, sub }: {
  label: string; value: string | number; icon: React.ElementType; color: string; sub?: string;
}) {
  return (
    <div className="bg-[#141B31] border border-white/5 rounded-2xl p-5 card-hover">
      <div className="flex items-start justify-between mb-3">
        <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', color)}>
          <Icon className="w-4 h-4" />
        </div>
        <TrendingUp className="w-4 h-4 text-emerald-400 opacity-60" />
      </div>
      <p className="text-2xl font-bold text-white mb-0.5">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
      {sub && <p className="text-xs text-emerald-400 mt-1">{sub}</p>}
    </div>
  );
}

function ActivityItem({ entry }: { entry: ActivityEntry }) {
  const icons: Record<string, { icon: React.ElementType; color: string }> = {
    dsa: { icon: Code2, color: 'text-cyan-400 bg-cyan-500/10' },
    assessment: { icon: Star, color: 'text-yellow-400 bg-yellow-500/10' },
    interview: { icon: Mic2, color: 'text-violet-400 bg-violet-500/10' },
    roadmap: { icon: Map, color: 'text-emerald-400 bg-emerald-500/10' },
    resume: { icon: FileText, color: 'text-orange-400 bg-orange-500/10' },
  };
  const cfg = icons[entry.type] ?? icons.dsa;
  const Icon = cfg.icon;
  const elapsed = Math.floor((Date.now() - new Date(entry.timestamp).getTime()) / 3600000);
  const timeStr = elapsed < 1 ? 'just now' : elapsed < 24 ? `${elapsed}h ago` : `${Math.floor(elapsed / 24)}d ago`;

  return (
    <div className="flex items-start gap-3">
      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', cfg.color)}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-300 leading-tight">{entry.description}</p>
        <p className="text-xs text-slate-600 mt-0.5">{timeStr}</p>
      </div>
      {entry.xp && (
        <span className="text-xs font-medium text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full">
          +{entry.xp} XP
        </span>
      )}
    </div>
  );
}

function ReadinessCircle({ value }: { value: number }) {
  const radius = 54;
  const circ = 2 * Math.PI * radius;
  const dash = (value / 100) * circ;

  return (
    <div className="relative flex items-center justify-center w-36 h-36">
      <svg className="absolute -rotate-90" width="144" height="144">
        <circle cx="72" cy="72" r={radius} fill="none" stroke="#1E2A48" strokeWidth="10" />
        <circle
          cx="72" cy="72" r={radius} fill="none"
          stroke="url(#scoreGrad)" strokeWidth="10"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#22D3EE" />
          </linearGradient>
        </defs>
      </svg>
      <div className="text-center z-10">
        <p className="text-3xl font-bold text-white">{value}%</p>
        <p className="text-xs text-slate-500">Ready</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const profile = storage.getProfile();
  const stats = storage.getStats() ?? defaultStats;
  const activity = storage.getActivity();
  const roadmap = storage.getRoadmap();

  const displayActivity = activity.length > 0 ? activity : sampleActivity;
  const firstName = profile?.name?.split(' ')[0] ?? 'Student';

  const quickActions = [
    { label: 'Practice DSA', icon: Code2, to: '/dsa', color: 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/15' },
    { label: 'Mock Interview', icon: Mic2, to: '/interview', color: 'bg-violet-500/10 text-violet-400 hover:bg-violet-500/15' },
    { label: 'Analyze Resume', icon: FileText, to: '/resume', color: 'bg-orange-500/10 text-orange-400 hover:bg-orange-500/15' },
    { label: 'View Roadmap', icon: Map, to: '/roadmap', color: 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/15' },
  ];

  const completedPhases = roadmap?.filter((p) => p.completed).length ?? 0;
  const totalPhases = roadmap?.length ?? 8;

  return (
    <div className="space-y-6 fade-in">
      {/* Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back, {firstName}!
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Let's make today count toward your dream career.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-3 py-1.5">
          <Flame className="w-3.5 h-3.5 text-orange-400" />
          <span className="text-xs font-semibold text-orange-300">{stats.learningStreak} day streak</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Placement Readiness" value={`${stats.placementReadiness}%`} icon={TrendingUp} color="bg-violet-500/15 text-violet-400" sub="+8% this week" />
        <StatCard label="Skills Mastered" value={stats.skillsMastered} icon={Star} color="bg-cyan-500/15 text-cyan-400" />
        <StatCard label="DSA Solved" value={stats.dsaSolved} icon={Code2} color="bg-emerald-500/15 text-emerald-400" sub="+12 this week" />
        <StatCard label="Day Streak" value={`${stats.learningStreak} days`} icon={Flame} color="bg-orange-500/15 text-orange-400" sub="Keep going!" />
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left — Readiness + Activity chart */}
        <div className="lg:col-span-2 space-y-5">
          {/* Weekly activity */}
          <div className="bg-[#141B31] border border-white/5 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-semibold text-sm">Weekly Learning Activity</h3>
                <p className="text-slate-500 text-xs mt-0.5">Daily study hours this week</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-white">21.5h</p>
                <p className="text-xs text-emerald-400">+15% vs last week</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={weeklyActivity} barSize={20}>
                <XAxis dataKey="day" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#141B31', border: '1px solid #1E2A48', borderRadius: '10px', fontSize: '12px' }}
                  labelStyle={{ color: '#F8FAFC' }}
                  itemStyle={{ color: '#8B5CF6' }}
                />
                <Bar dataKey="hours" fill="#8B5CF6" radius={[6, 6, 0, 0]} opacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Skill radar */}
          <div className="bg-[#141B31] border border-white/5 rounded-2xl p-5">
            <h3 className="text-white font-semibold text-sm mb-4">Skill Proficiency</h3>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={skillsData}>
                <PolarGrid stroke="#1E2A48" />
                <PolarAngleAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 10 }} />
                <Radar dataKey="value" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Readiness score */}
          <div className="bg-[#141B31] border border-white/5 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold text-sm">Placement Readiness</h3>
              <Zap className="w-4 h-4 text-violet-400" />
            </div>
            <div className="flex justify-center mb-4">
              <ReadinessCircle value={stats.placementReadiness} />
            </div>
            <p className="text-xs text-center text-slate-500 mb-3">
              Based on your DSA progress, assessments, and roadmap completion
            </p>
            <div className="space-y-2">
              {[
                { label: 'DSA Progress', value: 70 },
                { label: 'Assessments', value: 58 },
                { label: 'Roadmap', value: 45 },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 w-24 flex-shrink-0">{label}</span>
                  <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-violet-500 rounded-full" style={{ width: `${value}%` }} />
                  </div>
                  <span className="text-xs text-slate-400 w-8 text-right">{value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-[#141B31] border border-white/5 rounded-2xl p-5">
            <h3 className="text-white font-semibold text-sm mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map(({ label, icon: Icon, to, color }) => (
                <button
                  key={to}
                  onClick={() => navigate(to)}
                  className={cn('flex flex-col items-center gap-1.5 py-3 rounded-xl text-xs font-medium transition-colors', color)}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Roadmap progress */}
          <div className="bg-[#141B31] border border-white/5 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold text-sm">Roadmap Progress</h3>
              <button onClick={() => navigate('/roadmap')} className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1">
                View <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              {completedPhases} of {totalPhases} phases complete
            </p>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full transition-all"
                style={{ width: `${(completedPhases / totalPhases) * 100}%` }} />
            </div>
            {roadmap?.slice(0, 3).map((phase) => (
              <div key={phase.id} className="flex items-center gap-2 py-1.5 border-b border-white/3 last:border-0">
                <CheckCircle2 className={cn('w-3.5 h-3.5 flex-shrink-0', phase.completed ? 'text-emerald-400' : 'text-slate-600')} />
                <span className={cn('text-xs', phase.completed ? 'text-slate-300 line-through' : 'text-slate-400')}>
                  {phase.title.replace('Phase', 'Ph.')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Today's tasks & Activity */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Today's tasks */}
        <div className="bg-[#141B31] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-sm">Today's Recommended Tasks</h3>
            <BookOpen className="w-4 h-4 text-violet-400" />
          </div>
          <div className="space-y-3">
            {[
              { label: 'Solve 5 LeetCode Medium problems', done: true, time: '~45 min', tag: 'DSA' },
              { label: 'Complete OS Concepts assessment', done: false, time: '~20 min', tag: 'Assessment' },
              { label: 'Practice 2 HR interview questions', done: false, time: '~15 min', tag: 'Interview' },
              { label: 'Review Phase 3 roadmap tasks', done: false, time: '~10 min', tag: 'Roadmap' },
            ].map(({ label, done, time, tag }) => (
              <div key={label} className="flex items-start gap-3">
                <div className={cn('w-4 h-4 rounded flex items-center justify-center flex-shrink-0 mt-0.5 border',
                  done ? 'bg-emerald-500 border-emerald-500' : 'border-white/20')}>
                  {done && <CheckCircle2 className="w-3 h-3 text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn('text-sm', done ? 'text-slate-500 line-through' : 'text-slate-300')}>{label}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Clock className="w-3 h-3 text-slate-600" />
                    <span className="text-xs text-slate-600">{time}</span>
                    <span className="text-xs bg-white/5 text-slate-500 px-1.5 py-0.5 rounded">{tag}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-[#141B31] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-sm">Recent Activity</h3>
            <span className="text-xs text-slate-500">Last 7 days</span>
          </div>
          <div className="space-y-4">
            {displayActivity.slice(0, 5).map((entry) => (
              <ActivityItem key={entry.id} entry={entry} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
