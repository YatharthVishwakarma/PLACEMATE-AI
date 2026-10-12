import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { storage } from '../lib/localStorage';
import { defaultStats, sampleActivity, roadmapTemplates } from '../lib/demoData';
import type { UserProfile, TargetRole, CodingLevel, YearOfStudy } from '../types';
import { cn } from '../lib/utils';

const STEPS = ['Personal Info', 'Academic Details', 'Career Goals', 'Ready!'];

const roles: TargetRole[] = ['Software Developer', 'Data Analyst', 'AI/ML Engineer', 'Frontend Developer', 'Backend Developer'];
const levels: CodingLevel[] = ['Beginner', 'Intermediate', 'Advanced'];
const years: YearOfStudy[] = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Final Year'];
const timelines = ['Within 3 months', '3–6 months', '6–12 months', 'More than a year'];

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div className={cn(
            'flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold transition-all',
            i < current ? 'bg-violet-600 text-white' :
            i === current ? 'bg-violet-600/20 border border-violet-500 text-violet-300' :
            'bg-white/5 text-slate-500'
          )}>
            {i < current ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
          </div>
          {i < total - 1 && (
            <div className={cn('h-px w-8 sm:w-12 transition-all', i < current ? 'bg-violet-600' : 'bg-white/10')} />
          )}
        </div>
      ))}
    </div>
  );
}

function OptionCard({ label, selected, onClick, icon }: { label: string; selected: boolean; onClick: () => void; icon?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 w-full px-4 py-3 rounded-xl border text-sm font-medium text-left transition-all',
        selected
          ? 'border-violet-500 bg-violet-600/15 text-violet-200'
          : 'border-white/8 bg-white/3 text-slate-400 hover:border-white/20 hover:text-slate-200'
      )}
    >
      {icon && <span className="text-base">{icon}</span>}
      {label}
      {selected && <CheckCircle2 className="ml-auto w-4 h-4 text-violet-400 flex-shrink-0" />}
    </button>
  );
}

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: '',
    college: '',
    degree: '',
    branch: '',
    year: '' as YearOfStudy | '',
    targetRole: '' as TargetRole | '',
    codingLevel: '' as CodingLevel | '',
    targetTimeline: '',
  });

  const update = (key: string, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!form.name.trim()) e.name = 'Name is required';
    }
    if (step === 1) {
      if (!form.college.trim()) e.college = 'College name is required';
      if (!form.degree.trim()) e.degree = 'Degree is required';
      if (!form.branch.trim()) e.branch = 'Branch is required';
      if (!form.year) e.year = 'Please select your year';
    }
    if (step === 2) {
      if (!form.targetRole) e.targetRole = 'Please select a target role';
      if (!form.codingLevel) e.codingLevel = 'Please select your coding level';
      if (!form.targetTimeline) e.targetTimeline = 'Please select a timeline';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;
    if (step < 2) {
      setStep((s) => s + 1);
    } else {
      // Save profile
      const profile: UserProfile = {
        name: form.name,
        college: form.college,
        degree: form.degree,
        branch: form.branch,
        year: form.year as YearOfStudy,
        targetRole: form.targetRole as TargetRole,
        codingLevel: form.codingLevel as CodingLevel,
        targetTimeline: form.targetTimeline,
        onboardingComplete: true,
        createdAt: new Date().toISOString(),
      };
      storage.setProfile(profile);
      storage.setStats(defaultStats);
      sampleActivity.forEach((a) => storage.addActivity(a));
      const roadmap = roadmapTemplates[form.targetRole as TargetRole] ?? roadmapTemplates['Software Developer'];
      storage.setRoadmap(roadmap);
      setStep(3);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1020] flex flex-col items-center justify-center px-4 py-10">
      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-8">
        <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-white">PlaceMate<span className="text-violet-400"> AI</span></span>
      </div>

      <div className="w-full max-w-lg">
        {step < 3 && (
          <div className="flex flex-col items-center mb-8">
            <StepIndicator current={step} total={STEPS.length} />
            <p className="mt-4 text-xs text-slate-500 font-medium uppercase tracking-wider">
              Step {step + 1} of 3 — {STEPS[step]}
            </p>
          </div>
        )}

        <div className="bg-[#141B31] border border-white/8 rounded-2xl p-6 sm:p-8 shadow-2xl">
          {/* Step 0: Personal Info */}
          {step === 0 && (
            <div className="fade-in">
              <h2 className="text-xl font-bold text-white mb-1">Welcome! Let's start with your name.</h2>
              <p className="text-slate-400 text-sm mb-6">We'll personalize your entire experience around you.</p>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Your Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder="e.g. Arjun Sharma"
                  className={cn(
                    'w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none transition-colors',
                    errors.name ? 'border-red-500' : 'border-white/10 focus:border-violet-500/60'
                  )}
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>
            </div>
          )}

          {/* Step 1: Academic Details */}
          {step === 1 && (
            <div className="fade-in space-y-4">
              <h2 className="text-xl font-bold text-white mb-1">Your Academic Background</h2>
              <p className="text-slate-400 text-sm mb-5">Help us understand your current situation.</p>
              {[
                { key: 'college', label: 'College Name', placeholder: 'e.g. IIT Bombay, VIT Vellore' },
                { key: 'degree', label: 'Degree', placeholder: 'e.g. B.Tech, B.E., BCA' },
                { key: 'branch', label: 'Branch / Specialization', placeholder: 'e.g. Computer Science, IT, ECE' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
                  <input
                    type="text"
                    value={(form as Record<string, string>)[key]}
                    onChange={(e) => update(key, e.target.value)}
                    placeholder={placeholder}
                    className={cn(
                      'w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none transition-colors',
                      errors[key] ? 'border-red-500' : 'border-white/10 focus:border-violet-500/60'
                    )}
                  />
                  {errors[key] && <p className="text-red-400 text-xs mt-1">{errors[key]}</p>}
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Year of Study</label>
                <div className="grid grid-cols-3 gap-2">
                  {years.map((y) => (
                    <OptionCard key={y} label={y} selected={form.year === y} onClick={() => update('year', y)} />
                  ))}
                </div>
                {errors.year && <p className="text-red-400 text-xs mt-1">{errors.year}</p>}
              </div>
            </div>
          )}

          {/* Step 2: Career Goals */}
          {step === 2 && (
            <div className="fade-in space-y-5">
              <h2 className="text-xl font-bold text-white mb-1">Your Career Goals</h2>
              <p className="text-slate-400 text-sm mb-5">This shapes your personalized roadmap.</p>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Target Role</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {roles.map((r) => (
                    <OptionCard key={r} label={r} selected={form.targetRole === r} onClick={() => update('targetRole', r)} />
                  ))}
                </div>
                {errors.targetRole && <p className="text-red-400 text-xs mt-1">{errors.targetRole}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Current Coding Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {levels.map((l) => (
                    <OptionCard key={l} label={l} selected={form.codingLevel === l} onClick={() => update('codingLevel', l)} />
                  ))}
                </div>
                {errors.codingLevel && <p className="text-red-400 text-xs mt-1">{errors.codingLevel}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Target Placement Timeline</label>
                <div className="grid grid-cols-2 gap-2">
                  {timelines.map((t) => (
                    <OptionCard key={t} label={t} selected={form.targetTimeline === t} onClick={() => update('targetTimeline', t)} />
                  ))}
                </div>
                {errors.targetTimeline && <p className="text-red-400 text-xs mt-1">{errors.targetTimeline}</p>}
              </div>
            </div>
          )}

          {/* Step 3: Done */}
          {step === 3 && (
            <div className="fade-in text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">You're all set, {form.name.split(' ')[0]}!</h2>
              <p className="text-slate-400 text-sm mb-2">
                Your personalized roadmap for <span className="text-violet-300 font-medium">{form.targetRole}</span> is ready.
              </p>
              <p className="text-xs text-slate-500 mb-8 bg-white/3 border border-white/8 rounded-lg px-3 py-2">
                Your dashboard is pre-loaded with sample data to show you what PlaceMate AI looks like in action. Your real progress will replace it as you use the app.
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors mx-auto text-sm w-full"
              >
                Go to My Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Nav buttons */}
          {step < 3 && (
            <div className="flex justify-between mt-8 pt-5 border-t border-white/5">
              {step > 0 ? (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              ) : <div />}
              <button
                onClick={handleNext}
                className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm ml-auto"
              >
                {step === 2 ? 'Complete Setup' : 'Continue'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
