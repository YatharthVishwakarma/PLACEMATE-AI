import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, RadarChart,
  PolarGrid, PolarAngleAxis, Radar, CartesianGrid, Legend,
} from 'recharts';
import { BarChart3, TrendingUp, Target, Award } from 'lucide-react';
import { storage } from '../lib/localStorage';
import { defaultStats, progressOverTime, weeklyActivity, skillsData, dsaProblems, assessmentHistory } from '../lib/demoData';

const COLORS = ['#8B5CF6', '#22D3EE', '#10B981', '#F59E0B', '#EF4444'];

export default function ProgressAnalytics() {
  const stats = storage.getStats() ?? defaultStats;
  const savedAssessments = storage.getAssessments();
  const assessments = savedAssessments.length > 0 ? savedAssessments : assessmentHistory.map((h, i) => ({
    id: String(i), subject: h.subject, score: h.score, total: h.total, date: h.date, timeSpent: 10
  }));

  const savedProgress = storage.getDSAProgress();
  const dsaByTopic = ['Arrays', 'Strings', 'Linked Lists', 'Stacks & Queues', 'Searching & Sorting', 'Recursion', 'Trees', 'Graphs', 'Dynamic Programming'].map((topic) => {
    const probs = dsaProblems.filter((p) => p.topic === topic);
    const solved = probs.filter((p) => (savedProgress[p.id] ?? p.status) === 'Solved').length;
    return { topic: topic.split(' ')[0], solved, total: probs.length, pct: Math.round((solved / probs.length) * 100) };
  });

  const diffData = [
    { name: 'Easy', value: Object.entries(savedProgress).filter(([id, s]) => dsaProblems.find((p) => p.id === id && p.difficulty === 'Easy') && s === 'Solved').length || 12, fill: '#10B981' },
    { name: 'Medium', value: Object.entries(savedProgress).filter(([id, s]) => dsaProblems.find((p) => p.id === id && p.difficulty === 'Medium') && s === 'Solved').length || 8, fill: '#F59E0B' },
    { name: 'Hard', value: Object.entries(savedProgress).filter(([id, s]) => dsaProblems.find((p) => p.id === id && p.difficulty === 'Hard') && s === 'Solved').length || 2, fill: '#EF4444' },
  ];

  const assessmentData = assessments.slice(-6).map((a) => ({
    subject: typeof a.subject === 'string' ? a.subject.split(' ')[0] : a.subject,
    score: Math.round((a.score / a.total) * 100),
  }));

  return (
    <div className="space-y-6 fade-in">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 className="w-5 h-5 text-violet-400" />
          <h1 className="text-xl font-bold text-white">Progress Analytics</h1>
        </div>
        <p className="text-slate-400 text-sm">A comprehensive view of your placement preparation journey.</p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Readiness Score', value: `${stats.placementReadiness}%`, icon: Target, color: 'text-violet-400', bg: 'bg-violet-500/10' },
          { label: 'Study Hours', value: `${stats.totalStudyHours}h`, icon: TrendingUp, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
          { label: 'Assessments Done', value: stats.assessmentsCompleted, icon: Award, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Interviews Done', value: stats.interviewsCompleted, icon: BarChart3, color: 'text-orange-400', bg: 'bg-orange-500/10' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-[#141B31] border border-white/5 rounded-2xl p-5">
            <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Readiness over time */}
        <div className="bg-[#141B31] border border-white/5 rounded-2xl p-5">
          <h3 className="text-white font-semibold text-sm mb-4">Readiness Score Over Time</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={progressOverTime}>
              <CartesianGrid stroke="#1E2A48" strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#141B31', border: '1px solid #1E2A48', borderRadius: '10px', fontSize: '12px' }} />
              <Line type="monotone" dataKey="readiness" stroke="#8B5CF6" strokeWidth={2.5} dot={{ fill: '#8B5CF6', r: 4 }} name="Readiness %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly study hours */}
        <div className="bg-[#141B31] border border-white/5 rounded-2xl p-5">
          <h3 className="text-white font-semibold text-sm mb-4">Weekly Study Hours</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyActivity} barSize={20}>
              <XAxis dataKey="day" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#141B31', border: '1px solid #1E2A48', borderRadius: '10px', fontSize: '12px' }} />
              <Bar dataKey="hours" fill="#22D3EE" radius={[6, 6, 0, 0]} name="Hours" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* DSA topic progress */}
        <div className="bg-[#141B31] border border-white/5 rounded-2xl p-5">
          <h3 className="text-white font-semibold text-sm mb-4">DSA Topic Progress</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dsaByTopic} layout="vertical" barSize={10}>
              <XAxis type="number" domain={[0, 100]} tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="topic" tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} width={60} />
              <Tooltip contentStyle={{ background: '#141B31', border: '1px solid #1E2A48', borderRadius: '10px', fontSize: '12px' }} formatter={(v) => [`${v}%`, 'Solved']} />
              <Bar dataKey="pct" fill="#8B5CF6" radius={[0, 6, 6, 0]} name="% Solved" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Assessment performance */}
        <div className="bg-[#141B31] border border-white/5 rounded-2xl p-5">
          <h3 className="text-white font-semibold text-sm mb-4">Assessment Performance</h3>
          {assessmentData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={assessmentData} barSize={20}>
                <XAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#141B31', border: '1px solid #1E2A48', borderRadius: '10px', fontSize: '12px' }} formatter={(v) => [`${v}%`, 'Score']} />
                <Bar dataKey="score" fill="#10B981" radius={[6, 6, 0, 0]} name="Score %" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-slate-500 text-sm">
              Complete some assessments to see performance data
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Difficulty breakdown pie */}
        <div className="bg-[#141B31] border border-white/5 rounded-2xl p-5">
          <h3 className="text-white font-semibold text-sm mb-4">DSA Difficulty Breakdown (Solved)</h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={160}>
              <PieChart>
                <Pie data={diffData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {diffData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#141B31', border: '1px solid #1E2A48', borderRadius: '10px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {diffData.map((d) => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: d.fill }} />
                  <span className="text-xs text-slate-400">{d.name}</span>
                  <span className="text-xs font-semibold text-white ml-1">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skill radar */}
        <div className="bg-[#141B31] border border-white/5 rounded-2xl p-5">
          <h3 className="text-white font-semibold text-sm mb-4">Skill Coverage Radar</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={skillsData}>
              <PolarGrid stroke="#1E2A48" />
              <PolarAngleAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 10 }} />
              <Radar dataKey="value" stroke="#22D3EE" fill="#22D3EE" fillOpacity={0.15} name="Proficiency" />
              <Tooltip contentStyle={{ background: '#141B31', border: '1px solid #1E2A48', borderRadius: '10px', fontSize: '12px' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Improvement areas */}
      <div className="bg-[#141B31] border border-white/5 rounded-2xl p-5">
        <h3 className="text-white font-semibold text-sm mb-3">Areas Needing Improvement</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {skillsData
            .filter((s) => s.value < 65)
            .map(({ name, value }) => (
              <div key={name} className="bg-orange-500/5 border border-orange-500/15 rounded-xl p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-slate-300">{name}</span>
                  <span className="text-sm font-bold text-orange-400">{value}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: `${value}%` }} />
                </div>
                <p className="text-xs text-slate-500 mt-2">Recommended: Practice more and take the assessment</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
