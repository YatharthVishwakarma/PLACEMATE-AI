import { useNavigate } from 'react-router-dom';
import {
  Zap, FileText, Mic2, Code2, Map,
  CheckCircle2, ArrowRight, Star, Users, TrendingUp,
  ChevronRight, BookOpen, Award
} from 'lucide-react';

const features = [
  {
    icon: Map,
    color: 'violet',
    title: 'AI Career Roadmap',
    description: 'Get a personalized, phase-by-phase learning plan built around your target role and experience level.',
  },
  {
    icon: FileText,
    color: 'cyan',
    title: 'Resume AI Analyzer',
    description: 'Upload your resume and get instant, actionable feedback on structure, keywords, and impact.',
  },
  {
    icon: Mic2,
    color: 'emerald',
    title: 'Mock Interview Studio',
    description: 'Practice technical, HR, and behavioral questions with instant, structured feedback.',
  },
  {
    icon: Code2,
    color: 'orange',
    title: 'DSA Tracker',
    description: 'Track your coding progress across all major topics with curated problem sets and analytics.',
  },
];

const steps = [
  { step: '01', title: 'Set Up Your Profile', desc: 'Tell us your target role, college, and current level. Takes under 2 minutes.' },
  { step: '02', title: 'Get Your Roadmap', desc: 'Receive a personalized, phase-by-phase preparation plan tailored to your goals.' },
  { step: '03', title: 'Track & Improve', desc: 'Practice daily, complete assessments, and watch your placement readiness score grow.' },
];

const stats = [
  { value: '10K+', label: 'Students Preparing', icon: Users },
  { value: '85%', label: 'Readiness Improvement', icon: TrendingUp },
  { value: '500+', label: 'Practice Problems', icon: Code2 },
  { value: '4.8★', label: 'Average Rating', icon: Star },
];

const colorMap: Record<string, string> = {
  violet: 'bg-violet-600/15 text-violet-400 border-violet-500/20',
  cyan: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
  emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  orange: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
};

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0B1020] text-white overflow-x-hidden">
      {/* Nav */}
      <nav className="border-b border-white/5 bg-[#0B1020]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white">PlaceMate<span className="text-violet-400"> AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#readiness" className="hover:text-white transition-colors">Readiness Score</a>
          </div>
          <button
            onClick={() => navigate('/onboarding')}
            className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-24 pb-20 px-6">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-600/8 rounded-full blur-3xl" />
          <div className="absolute top-20 right-10 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-violet-600/10 border border-violet-500/20 rounded-full px-4 py-1.5 text-xs font-medium text-violet-300 mb-8">
            <span className="w-1.5 h-1.5 bg-violet-400 rounded-full pulse-dot" />
            Built for Indian College Students · 2026 Placement Season
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
            Your Dream Job Starts<br />
            <span className="gradient-text">Before the Interview.</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            PlaceMate AI helps you get campus-placement ready with personalized roadmaps,
            resume analysis, mock interviews, and DSA tracking — all in one focused platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/onboarding')}
              className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-sm"
            >
              Build My Career Roadmap
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#features"
              className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/8 border border-white/10 text-slate-300 font-semibold px-8 py-3.5 rounded-xl transition-colors text-sm"
            >
              Explore Features
            </a>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
            {['No credit card required', 'Works offline after setup', 'Data saved locally'].map((t) => (
              <div key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard preview */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden border border-white/8 bg-[#0E1428] p-4">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0B1020] pointer-events-none z-10" />
            {/* Mock dashboard preview */}
            <div className="grid grid-cols-4 gap-3 mb-3">
              {[
                { label: 'Readiness Score', value: '62%', color: 'text-violet-400' },
                { label: 'Skills Mastered', value: '14', color: 'text-cyan-400' },
                { label: 'DSA Solved', value: '87', color: 'text-emerald-400' },
                { label: 'Day Streak', value: '12', color: 'text-orange-400' },
              ].map((card) => (
                <div key={card.label} className="bg-[#141B31] rounded-xl p-3 border border-white/5">
                  <p className="text-xs text-slate-500 mb-1">{card.label}</p>
                  <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 bg-[#141B31] rounded-xl p-3 border border-white/5 h-28">
                <p className="text-xs text-slate-400 mb-2 font-medium">Weekly Activity</p>
                <div className="flex items-end gap-1.5 h-16">
                  {[40, 60, 35, 80, 50, 100, 70].map((h, i) => (
                    <div key={i} className="flex-1 bg-violet-600/20 rounded-sm" style={{ height: `${h}%` }}>
                      <div className="w-full bg-violet-500 rounded-sm" style={{ height: `${h}%` }} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-[#141B31] rounded-xl p-3 border border-white/5 h-28">
                <p className="text-xs text-slate-400 mb-2 font-medium">Career Roadmap</p>
                {['Phase 1', 'Phase 2', 'Phase 3'].map((p, i) => (
                  <div key={p} className="flex items-center gap-2 mb-1">
                    <div className="flex-1 bg-white/5 rounded-full h-1.5">
                      <div className="bg-violet-500 h-1.5 rounded-full" style={{ width: `${[100, 67, 0][i]}%` }} />
                    </div>
                    <span className="text-xs text-slate-500">{[100, 67, 0][i]}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 py-12 border-y border-white/5">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ value, label, icon: Icon }) => (
            <div key={label} className="text-center">
              <div className="flex justify-center mb-2">
                <Icon className="w-5 h-5 text-violet-400" />
              </div>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-sm text-slate-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">Everything You Need to Crack Placements</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Four powerful tools, one unified platform. No more juggling between random resources.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map(({ icon: Icon, color, title, description }) => (
              <div key={title} className="bg-[#141B31] border border-white/5 rounded-2xl p-6 card-hover group">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${colorMap[color]}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-white font-semibold mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
                <div className="mt-4 flex items-center gap-1 text-xs font-medium text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-6 py-20 bg-white/2">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">How PlaceMate AI Works</h2>
            <p className="text-slate-400">Three simple steps from signup to placement-ready.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-violet-600/15 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-violet-400 font-bold text-sm">{step}</span>
                </div>
                <h3 className="text-white font-semibold mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Readiness section */}
      <section id="readiness" className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-violet-600/10 to-cyan-500/5 border border-violet-500/15 rounded-2xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-violet-400" />
                  <span className="text-sm font-medium text-violet-300">Placement Readiness Score</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Know Exactly Where You Stand</h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  Your readiness score is calculated from your DSA progress, assessment performance,
                  mock interview results, and roadmap completion. It gives you a transparent,
                  honest view of your preparation level.
                </p>
                <p className="text-xs text-slate-500 bg-yellow-500/5 border border-yellow-500/20 rounded-lg px-3 py-2">
                  Note: This score reflects your practice progress within PlaceMate AI, not an employer assessment or guaranteed placement outcome.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { label: 'DSA & Algorithms', value: 70, color: 'bg-violet-500' },
                  { label: 'Mock Interviews', value: 55, color: 'bg-cyan-500' },
                  { label: 'Technical Knowledge', value: 65, color: 'bg-emerald-500' },
                  { label: 'Roadmap Completion', value: 45, color: 'bg-orange-500' },
                ].map(({ label, value, color }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">{label}</span>
                      <span className="text-slate-300 font-medium">{value}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full ${color} rounded-full`} style={{ width: `${value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-14 h-14 rounded-2xl bg-violet-600/15 border border-violet-500/20 flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-7 h-7 text-violet-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Your Placement Journey,<br />One Smart Step at a Time.</h2>
          <p className="text-slate-400 mb-8">Join thousands of students who are preparing smarter, not harder.</p>
          <button
            onClick={() => navigate('/onboarding')}
            className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-10 py-4 rounded-xl transition-colors mx-auto text-sm"
          >
            Start Preparing for Free
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-300">PlaceMate AI</span>
          </div>
          <div className="flex gap-6 text-sm text-slate-500">
            {['Privacy Policy', 'Terms of Use', 'Contact', 'GitHub'].map((l) => (
              <a key={l} href="#" className="hover:text-slate-300 transition-colors">{l}</a>
            ))}
          </div>
          <p className="text-xs text-slate-600">© 2026 PlaceMate AI. For educational use.</p>
        </div>
      </footer>
    </div>
  );
}
