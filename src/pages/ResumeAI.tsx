import { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, XCircle, Zap, RotateCcw, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { storage } from '../lib/localStorage';
import { askOpenAI } from '../lib/openai';

interface AnalysisResult {
  score: number;
  sections: { name: string; found: boolean }[];
  missingKeywords: string[];
  weakVerbs: string[];
  strengths: string[];
  improvements: string[];
  checklist: { item: string; passed: boolean }[];
}

interface AIResumeAnalysis {
  score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  missingKeywords: string[];
  atsChecklist: { item: string; passed: boolean }[];
}

const SAMPLE_RESUME = `Arjun Sharma
arjun.sharma@email.com | +91 9876543210 | github.com/arjunsharma | linkedin.com/in/arjunsharma

EDUCATION
B.Tech Computer Science, VIT Vellore — 2022-2026 | CGPA: 8.4/10

EXPERIENCE
Software Development Intern | TechCorp, Bangalore | Jun 2025 – Aug 2025
- Developed REST APIs using Node.js and Express, reducing response time by 30%
- Worked on React frontend with TypeScript for internal dashboard
- Collaborated with team on database optimization

PROJECTS
E-Commerce Platform | React, Node.js, MongoDB
- Built full-stack web application with 500+ active users
- Implemented JWT authentication and payment gateway integration

DSA Practice Tracker | Python, Django
- Created tool to track LeetCode progress with analytics dashboard

SKILLS
Programming: Python, JavaScript, C++, Java
Web: React, Node.js, Express, HTML/CSS
Database: MySQL, MongoDB, PostgreSQL
Tools: Git, Docker, Linux

ACHIEVEMENTS
- LeetCode: 300+ problems solved (3-star rating)
- Smart India Hackathon 2025 finalist
- Technical Head, Coding Club VIT`;

async function analyzeWithAI(text: string, targetRole: string): Promise<AIResumeAnalysis> {
  const prompt = `Analyze this resume for a ${targetRole} position. Return ONLY a JSON object with this exact shape:
{"score": number (0-100 overall resume quality for the target role), "summary": string (2-3 sentence honest overall assessment), "strengths": string[2-4], "improvements": string[2-4], "missingKeywords": string[0-6] (important keywords/skills for a ${targetRole} that are absent from this resume), "atsChecklist": [{"item": string, "passed": boolean}] (5-8 concrete ATS-friendliness checks like contact info present, quantified achievements, appropriate length, clear section headings)}

Rules:
- Evaluate like a constructive recruiter: content quality, impact, relevance to ${targetRole}, and ATS parseability.
- Be specific — reference actual details from the resume, not generic advice.
- If the resume is sparse or placeholder-like, say so honestly and score accordingly.`;

  const raw = await askOpenAI([
    { role: 'system', content: 'You are an expert technical recruiter and resume coach. Respond only with valid JSON.' },
    { role: 'user', content: `Resume:\n\n${text.slice(0, 12000)}\n\n${prompt}` },
  ], { json: true });

  const parsed = JSON.parse(raw) as Record<string, unknown>;
  const toStrArr = (v: unknown): string[] =>
    Array.isArray(v) ? v.filter((s): s is string => typeof s === 'string') : [];
  const checklist = Array.isArray(parsed.atsChecklist)
    ? parsed.atsChecklist
        .map((c) => c as Record<string, unknown>)
        .filter((c) => typeof c.item === 'string')
        .map((c) => ({ item: c.item as string, passed: c.passed === true }))
    : [];
  const summary = typeof parsed.summary === 'string' ? parsed.summary : '';
  if (typeof parsed.score !== 'number' || !summary) {
    throw new Error('AI returned malformed analysis');
  }
  return {
    score: Math.max(0, Math.min(100, Math.round(parsed.score))),
    summary,
    strengths: toStrArr(parsed.strengths),
    improvements: toStrArr(parsed.improvements),
    missingKeywords: toStrArr(parsed.missingKeywords),
    atsChecklist: checklist,
  };
}

export default function ResumeAI() {
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('Software Developer');
  const [result, setResult] = useState<AIResumeAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const roles = ['Software Developer', 'Data Analyst', 'AI/ML Engineer', 'Frontend Developer', 'Backend Developer'];

  const handleFile = (file: File) => {
    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setResumeText(e.target?.result as string ?? '');
        setFileName(file.name);
        setError('');
        setResult(null);
      };
      reader.readAsText(file);
    } else if (file.type === 'application/pdf') {
      setFileName(file.name);
      setError('');
      setResult(null);
      setResumeText('[PDF uploaded — text extraction requires a server-side parser. For this demo, the sample resume text will be analyzed.]');
    } else {
      setError('Please upload a .txt or .pdf file.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleAnalyze = async () => {
    const textToAnalyze = resumeText.startsWith('[PDF') ? SAMPLE_RESUME : resumeText;
    if (!textToAnalyze.trim()) { setError('Please upload a resume or load the sample.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await analyzeWithAI(textToAnalyze, targetRole);
      setResult(res);
      storage.addActivity({ id: Date.now().toString(), type: 'resume', description: `Resume analyzed for ${targetRole} — score ${res.score}/100`, timestamp: new Date().toISOString(), xp: 15 });
    } catch {
      setError('AI analysis is unavailable right now. Please try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = result
    ? result.score >= 75 ? 'text-emerald-400' : result.score >= 50 ? 'text-yellow-400' : 'text-red-400'
    : 'text-white';

  return (
    <div className="space-y-6 fade-in max-w-4xl">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <FileText className="w-5 h-5 text-violet-400" />
          <h1 className="text-xl font-bold text-white">Resume AI Analyzer</h1>
        </div>
        <p className="text-slate-400 text-sm">Get instant, personalized feedback on your resume from OpenAI.</p>
      </div>

      <div className="bg-violet-500/5 border border-violet-500/15 rounded-xl px-4 py-3 text-xs text-slate-500 flex items-start gap-2">
        <Sparkles className="w-3.5 h-3.5 text-violet-400 flex-shrink-0 mt-0.5" />
        <span>Analysis is powered by OpenAI and reflects an AI-generated evaluation — helpful for practice, not a substitute for a professional recruiter's review.</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Upload */}
        <div className="space-y-4">
          <div
            className={cn(
              'border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer',
              fileName ? 'border-violet-500/40 bg-violet-500/5' : 'border-white/10 hover:border-violet-500/30 hover:bg-white/2'
            )}
            onClick={() => fileRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <input ref={fileRef} type="file" accept=".pdf,.txt" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            <Upload className="w-8 h-8 text-slate-500 mx-auto mb-3" />
            {fileName ? (
              <>
                <p className="text-sm text-violet-300 font-medium">{fileName}</p>
                <p className="text-xs text-slate-500 mt-1">Click to replace</p>
              </>
            ) : (
              <>
                <p className="text-sm text-slate-300 font-medium">Drag & drop or click to upload</p>
                <p className="text-xs text-slate-500 mt-1">Supports .txt and .pdf files</p>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-xs text-slate-500">or</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          <button
            onClick={() => { setResumeText(SAMPLE_RESUME); setFileName('sample_resume.txt'); setResult(null); setError(''); }}
            className="w-full py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-white/20 text-sm transition-colors flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 text-violet-400" />
            Load Sample Resume
          </button>

          <div>
            <label className="text-xs font-medium text-slate-400 block mb-1.5">Target Job Role</label>
            <select
              value={targetRole}
              onChange={(e) => { setTargetRole(e.target.value); setResult(null); }}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/60 transition-colors"
            >
              {roles.map((r) => <option key={r} value={r} className="bg-[#141B31]">{r}</option>)}
            </select>
          </div>

          {resumeText && (
            <div className="bg-white/3 border border-white/8 rounded-xl p-3 max-h-40 overflow-y-auto">
              <p className="text-xs text-slate-400 font-mono whitespace-pre-wrap leading-relaxed">{resumeText.slice(0, 600)}{resumeText.length > 600 ? '...' : ''}</p>
            </div>
          )}

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button
            onClick={handleAnalyze}
            disabled={loading || !resumeText}
            className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Analyze Resume
              </>
            )}
          </button>

          {result && (
            <button
              onClick={() => { setResult(null); setResumeText(''); setFileName(''); setError(''); }}
              className="w-full py-2 rounded-xl border border-white/8 text-slate-400 hover:text-white text-sm transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          )}
        </div>

        {/* Results */}
        <div className="space-y-4">
          {!result && !loading && (
            <div className="bg-[#141B31] border border-white/5 rounded-2xl p-8 text-center">
              <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">Upload your resume and click Analyze to see your detailed feedback.</p>
            </div>
          )}

          {loading && (
            <div className="bg-[#141B31] border border-white/5 rounded-2xl p-8 text-center">
              <div className="w-10 h-10 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-slate-400 text-sm">Analyzing your resume...</p>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-4 fade-in">
              {/* Score */}
              <div className="bg-[#141B31] border border-white/5 rounded-2xl p-5 text-center">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Resume Quality Score</p>
                <p className={cn('text-6xl font-bold', scoreColor)}>{result.score}</p>
                <p className="text-slate-500 text-sm mt-1">/ 100</p>
                <div className="mt-3 h-2 bg-white/5 rounded-full overflow-hidden mx-8">
                  <div
                    className={cn('h-full rounded-full transition-all', result.score >= 75 ? 'bg-emerald-500' : result.score >= 50 ? 'bg-yellow-500' : 'bg-red-500')}
                    style={{ width: `${result.score}%` }}
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="bg-violet-500/5 border border-violet-500/15 rounded-xl p-4">
                <h3 className="text-violet-400 font-semibold text-sm mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> AI Assessment
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">{result.summary}</p>
              </div>

              {/* Checklist */}
              {result.atsChecklist.length > 0 && (
                <div className="bg-[#141B31] border border-white/5 rounded-2xl p-5">
                  <h3 className="text-white font-semibold text-sm mb-3">ATS Readiness Checklist</h3>
                  <div className="space-y-2">
                    {result.atsChecklist.map(({ item, passed }) => (
                      <div key={item} className="flex items-center gap-2">
                        {passed
                          ? <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          : <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />}
                        <span className={cn('text-xs', passed ? 'text-slate-300' : 'text-slate-500')}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Strengths */}
              {result.strengths.length > 0 && (
                <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
                  <h3 className="text-emerald-400 font-semibold text-sm mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Strengths
                  </h3>
                  <ul className="space-y-1">
                    {result.strengths.map((s) => <li key={s} className="text-xs text-slate-400">• {s}</li>)}
                  </ul>
                </div>
              )}

              {/* Improvements */}
              {result.improvements.length > 0 && (
                <div className="bg-orange-500/5 border border-orange-500/15 rounded-xl p-4">
                  <h3 className="text-orange-400 font-semibold text-sm mb-2 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" /> Suggested Improvements
                  </h3>
                  <ul className="space-y-1.5">
                    {result.improvements.map((s) => <li key={s} className="text-xs text-slate-400">• {s}</li>)}
                  </ul>
                </div>
              )}

              {/* Missing keywords */}
              {result.missingKeywords.length > 0 && (
                <div className="bg-[#141B31] border border-white/5 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-slate-300 mb-2">Missing Keywords for {targetRole}</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {result.missingKeywords.map((k) => (
                      <span key={k} className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-full">{k}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
