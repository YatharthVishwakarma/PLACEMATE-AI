import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Edit2, Save, X, Download, Trash2, AlertTriangle,
  CheckCircle2, GraduationCap, Target, Code2, Calendar
} from 'lucide-react';
import { storage } from '../lib/localStorage';
import { defaultStats, sampleActivity, roadmapTemplates } from '../lib/demoData';
import type { UserProfile, TargetRole, CodingLevel, YearOfStudy } from '../types';
import { cn } from '../lib/utils';

const roles: TargetRole[] = ['Software Developer', 'Data Analyst', 'AI/ML Engineer', 'Frontend Developer', 'Backend Developer'];
const levels: CodingLevel[] = ['Beginner', 'Intermediate', 'Advanced'];
const years: YearOfStudy[] = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Final Year'];

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(storage.getProfile());
  const [editing, setEditing] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<UserProfile | null>(profile);

  const stats = storage.getStats() ?? defaultStats;

  const update = (key: keyof UserProfile, value: string) => {
    if (!form) return;
    setForm((f) => f ? { ...f, [key]: value } : f);
  };

  const handleSave = () => {
    if (!form) return;
    storage.setProfile(form);
    // If role changed, regenerate roadmap
    if (form.targetRole !== profile?.targetRole) {
      const roadmap = roadmapTemplates[form.targetRole] ?? roadmapTemplates['Software Developer'];
      storage.setRoadmap(roadmap);
    }
    setProfile(form);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleCancel = () => {
    setForm(profile);
    setEditing(false);
  };

  const handleReset = () => {
    storage.clearAll();
    navigate('/onboarding');
  };

  const handleExport = () => {
    const data = {
      profile: storage.getProfile(),
      stats: storage.getStats(),
      assessments: storage.getAssessments(),
      interviews: storage.getInterviews(),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `placemate-progress-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!profile || !form) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400 mb-4">No profile found. Please complete onboarding first.</p>
        <button onClick={() => navigate('/onboarding')} className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-6 py-2.5 rounded-xl text-sm">
          Go to Onboarding
        </button>
      </div>
    );
  }

  const initials = profile.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="space-y-6 fade-in max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <User className="w-5 h-5 text-violet-400" />
            <h1 className="text-xl font-bold text-white">My Profile</h1>
          </div>
          <p className="text-slate-400 text-sm">Manage your personal information and preferences.</p>
        </div>
        {!editing ? (
          <button onClick={() => setEditing(true)}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/8 border border-white/10 text-slate-300 hover:text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors">
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={handleCancel}
              className="flex items-center gap-2 border border-white/10 text-slate-400 hover:text-white text-sm px-4 py-2.5 rounded-xl transition-colors">
              <X className="w-4 h-4" /> Cancel
            </button>
            <button onClick={handleSave}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors">
              <Save className="w-4 h-4" /> Save
            </button>
          </div>
        )}
      </div>

      {saved && (
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <p className="text-sm text-emerald-300">Profile saved successfully!</p>
        </div>
      )}

      {/* Avatar + stats summary */}
      <div className="bg-[#141B31] border border-white/5 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-bold text-white">{profile.name}</h2>
            <p className="text-slate-400 text-sm">{profile.college}</p>
            <p className="text-slate-500 text-xs mt-1">{profile.degree} · {profile.branch} · {profile.year}</p>
            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              <span className="text-xs bg-violet-500/15 text-violet-300 border border-violet-500/20 px-2.5 py-1 rounded-full">{profile.targetRole}</span>
              <span className="text-xs bg-cyan-500/15 text-cyan-300 border border-cyan-500/20 px-2.5 py-1 rounded-full">{profile.codingLevel}</span>
              <span className="text-xs bg-white/5 text-slate-400 border border-white/10 px-2.5 py-1 rounded-full">{profile.targetTimeline}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 flex-shrink-0">
            {[
              { label: 'Readiness', value: `${stats.placementReadiness}%` },
              { label: 'DSA Solved', value: stats.dsaSolved },
              { label: 'Day Streak', value: `${stats.learningStreak}d` },
              { label: 'Skills', value: stats.skillsMastered },
            ].map(({ label, value }) => (
              <div key={label} className="text-center bg-white/3 rounded-xl p-3 min-w-16">
                <p className="text-lg font-bold text-white">{value}</p>
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit form */}
      <div className="bg-[#141B31] border border-white/5 rounded-2xl p-6 space-y-5">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-violet-400" />
          Personal & Academic Information
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { key: 'name', label: 'Full Name' },
            { key: 'college', label: 'College Name' },
            { key: 'degree', label: 'Degree' },
            { key: 'branch', label: 'Branch' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="text-xs font-medium text-slate-400 block mb-1.5">{label}</label>
              {editing ? (
                <input
                  type="text"
                  value={(form as unknown as Record<string, string>)[key] ?? ''}
                  onChange={(e) => update(key as keyof UserProfile, e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/60 transition-colors"
                />
              ) : (
                <p className="text-sm text-slate-300 bg-white/3 border border-white/5 rounded-xl px-4 py-2.5">{(profile as unknown as Record<string, string>)[key]}</p>
              )}
            </div>
          ))}
        </div>

        {/* Year */}
        <div>
          <label className="text-xs font-medium text-slate-400 block mb-2">Year of Study</label>
          {editing ? (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {years.map((y) => (
                <button key={y} onClick={() => update('year', y)}
                  className={cn('px-3 py-2 rounded-xl border text-xs font-medium transition-all',
                    form.year === y ? 'border-violet-500 bg-violet-600/15 text-violet-200' : 'border-white/8 text-slate-400 hover:border-white/20')}>
                  {y}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-300 bg-white/3 border border-white/5 rounded-xl px-4 py-2.5 w-fit">{profile.year}</p>
          )}
        </div>
      </div>

      {/* Career goals */}
      <div className="bg-[#141B31] border border-white/5 rounded-2xl p-6 space-y-5">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Target className="w-4 h-4 text-violet-400" />
          Career Goals
        </h3>
        <div>
          <label className="text-xs font-medium text-slate-400 block mb-2">Target Role</label>
          {editing ? (
            <div className="grid sm:grid-cols-2 gap-2">
              {roles.map((r) => (
                <button key={r} onClick={() => update('targetRole', r)}
                  className={cn('px-3 py-2.5 rounded-xl border text-xs font-medium text-left transition-all',
                    form.targetRole === r ? 'border-violet-500 bg-violet-600/15 text-violet-200' : 'border-white/8 text-slate-400 hover:border-white/20')}>
                  {r}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-300 bg-white/3 border border-white/5 rounded-xl px-4 py-2.5 w-fit">{profile.targetRole}</p>
          )}
        </div>
        <div>
          <label className="text-xs font-medium text-slate-400 block mb-2">Coding Level</label>
          {editing ? (
            <div className="grid grid-cols-3 gap-2">
              {levels.map((l) => (
                <button key={l} onClick={() => update('codingLevel', l)}
                  className={cn('px-3 py-2.5 rounded-xl border text-xs font-medium transition-all',
                    form.codingLevel === l ? 'border-violet-500 bg-violet-600/15 text-violet-200' : 'border-white/8 text-slate-400 hover:border-white/20')}>
                  {l}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-300 bg-white/3 border border-white/5 rounded-xl px-4 py-2.5 w-fit">{profile.codingLevel}</p>
          )}
        </div>
        <div>
          <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5 mb-1.5">
            <Calendar className="w-3.5 h-3.5" /> Target Timeline
          </label>
          {editing ? (
            <input
              type="text"
              value={form.targetTimeline}
              onChange={(e) => update('targetTimeline', e.target.value)}
              className="w-full sm:w-64 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/60 transition-colors"
            />
          ) : (
            <p className="text-sm text-slate-300 bg-white/3 border border-white/5 rounded-xl px-4 py-2.5 w-fit">{profile.targetTimeline}</p>
          )}
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-[#141B31] border border-white/5 rounded-2xl p-6 space-y-4">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Code2 className="w-4 h-4 text-violet-400" />
          Data & Account
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={handleExport}
            className="flex items-center justify-center gap-2 border border-white/10 text-slate-400 hover:text-white text-sm px-4 py-2.5 rounded-xl transition-colors">
            <Download className="w-4 h-4" />
            Export My Progress (JSON)
          </button>
          <button onClick={() => setShowResetDialog(true)}
            className="flex items-center justify-center gap-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm px-4 py-2.5 rounded-xl transition-colors">
            <Trash2 className="w-4 h-4" />
            Reset All Progress
          </button>
        </div>
        <p className="text-xs text-slate-600">Resetting will delete all locally stored data and restart onboarding. This cannot be undone.</p>
      </div>

      {/* Reset confirmation dialog */}
      {showResetDialog && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141B31] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl fade-in">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-500/15 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-white font-bold">Reset All Progress?</h3>
            </div>
            <p className="text-slate-400 text-sm mb-5 leading-relaxed">
              This will permanently delete your profile, DSA progress, assessment history, and all other locally stored data. You'll be taken back to onboarding.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowResetDialog(false)}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white text-sm transition-colors">
                Cancel
              </button>
              <button onClick={handleReset}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm transition-colors">
                Yes, Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
