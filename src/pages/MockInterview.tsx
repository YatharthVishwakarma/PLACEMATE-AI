import { useState } from 'react';
import { Mic2, ChevronRight, ChevronLeft, CheckCircle2, RotateCcw, Play, Award, Sparkles, Bot, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { storage } from '../lib/localStorage';
import { askOpenAI } from '../lib/openai';

interface Question {
  id: string;
  question: string;
  hints: string[];
  sampleAnswer: string;
  concepts: string[];
}

const questionBank: Record<string, Record<string, Question[]>> = {
  Technical: {
    Easy: [
      { id: 't-e-1', question: 'What is the difference between an array and a linked list?', hints: ['Think about memory allocation', 'Consider access time'], sampleAnswer: 'Arrays store elements in contiguous memory, allowing O(1) random access. Linked lists store elements as nodes with pointers, offering O(1) insertion/deletion at head but O(n) access. Arrays are better for indexed access; linked lists for frequent insertions/deletions.', concepts: ['Memory allocation', 'Time complexity', 'Data structures'] },
      { id: 't-e-2', question: 'Explain the concept of OOP with an example.', hints: ['Four pillars of OOP', 'Real-world analogy'], sampleAnswer: 'OOP (Object-Oriented Programming) organizes code into objects with properties (attributes) and behaviors (methods). The four pillars are: Encapsulation (bundling data), Inheritance (deriving classes), Polymorphism (different forms), Abstraction (hiding complexity). Example: A Car class has attributes (speed, color) and methods (drive(), brake()).', concepts: ['Encapsulation', 'Inheritance', 'Polymorphism', 'Abstraction'] },
      { id: 't-e-3', question: 'What is the difference between == and === in JavaScript?', hints: ['Type coercion', 'Strict equality'], sampleAnswer: '== performs loose equality with type coercion (5 == "5" is true). === performs strict equality checking both value and type (5 === "5" is false). Always prefer === in production code to avoid unexpected type coercions.', concepts: ['Type coercion', 'Strict equality', 'JavaScript basics'] },
    ],
    Medium: [
      { id: 't-m-1', question: 'Explain how a HashMap works internally in Java/Python.', hints: ['Hash function', 'Collision handling', 'Buckets'], sampleAnswer: 'A HashMap uses a hash function to map keys to bucket indices. When storing a key-value pair: 1) Compute hash(key) % capacity to find bucket index, 2) Store in that bucket. Collisions (same index) are handled via chaining (linked list at each bucket) or open addressing. Average O(1) operations with load factor management.', concepts: ['Hash function', 'Collision resolution', 'Load factor', 'Amortized complexity'] },
      { id: 't-m-2', question: 'What is the difference between process and thread?', hints: ['Memory isolation', 'Context switching', 'IPC'], sampleAnswer: 'A process is an independent program with its own memory space. A thread is a lightweight unit within a process that shares the same memory. Threads communicate easily (shared memory) but require synchronization. Processes are more isolated and crash-safe. Context switching threads is faster than processes.', concepts: ['Operating Systems', 'Memory management', 'Synchronization', 'Context switching'] },
      { id: 't-m-3', question: 'What are database indexes and when should you use them?', hints: ['Query performance', 'Write overhead', 'Cardinality'], sampleAnswer: 'Indexes are data structures (usually B-trees) that speed up data retrieval at the cost of extra storage and slower writes. Use them on: columns in WHERE clauses, JOIN conditions, ORDER BY fields, and high-cardinality columns. Avoid on small tables, columns with low cardinality, or tables with heavy write loads.', concepts: ['DBMS', 'B-trees', 'Query optimization', 'Trade-offs'] },
    ],
    Hard: [
      { id: 't-h-1', question: 'Design a URL shortener system like bit.ly.', hints: ['Hash generation', 'Database schema', 'Scalability', 'Caching'], sampleAnswer: 'Key components: 1) Hash generation (base62 encoding of ID), 2) Database (id, shortCode, longURL, createdAt, clickCount), 3) Cache layer (Redis for hot URLs), 4) Load balancer for horizontal scaling. Handle: custom aliases, expiry, analytics. Estimate: 100M URLs, 1000 req/s reads, 100 req/s writes.', concepts: ['System design', 'Hashing', 'Caching', 'Database design', 'Scalability'] },
    ],
  },
  HR: {
    Easy: [
      { id: 'hr-e-1', question: 'Tell me about yourself.', hints: ['Present-Past-Future format', '2 minutes max', 'Relevant to the role'], sampleAnswer: 'Start with your current status (student at X college, pursuing B.Tech in CS). Then cover relevant past experiences (internship, projects). End with why you\'re excited about this opportunity. Keep it to 90 seconds, focused, and confident. Avoid listing your resume — add personality.', concepts: ['Self-presentation', 'Confidence', 'Clarity', 'Relevance'] },
      { id: 'hr-e-2', question: 'Why do you want to work at our company?', hints: ['Research the company', 'Align your goals', 'Be specific'], sampleAnswer: 'Research before the interview: recent news, products, culture, mission. Structure: 1) Something specific about the company ("Your work on ML for healthcare..."), 2) How it aligns with your goals ("I want to build systems that..."), 3) What you bring ("My experience in..."). Avoid generic answers like "great company" or "good salary".', concepts: ['Research', 'Motivation', 'Cultural fit', 'Specificity'] },
    ],
    Medium: [
      { id: 'hr-m-1', question: 'Describe a situation where you handled a conflict in a team.', hints: ['STAR method', 'Focus on resolution', 'Show maturity'], sampleAnswer: 'Use STAR: Situation (project X had conflicting approaches), Task (needed to align the team), Action (scheduled a meeting, listened to both sides, proposed a compromise), Result (delivered on time, everyone felt heard). Key: show you seek win-win, communicate clearly, and focus on the project goal, not personal ego.', concepts: ['STAR method', 'Conflict resolution', 'Emotional intelligence', 'Team dynamics'] },
    ],
    Hard: [
      { id: 'hr-h-1', question: 'Where do you see yourself in 5 years?', hints: ['Ambitious but realistic', 'Align with company growth', 'Show commitment'], sampleAnswer: 'Be aspirational but grounded: "In 5 years, I aim to be a senior engineer leading end-to-end feature development, having contributed significantly to [company\'s mission]. I want to mentor junior developers and take on more ownership." Shows ambition, loyalty, and a growth mindset without claiming to be CTO in year 3.', concepts: ['Career planning', 'Ambition', 'Loyalty', 'Growth mindset'] },
    ],
  },
  Behavioral: {
    Easy: [
      { id: 'b-e-1', question: 'Tell me about a time you missed a deadline. What did you do?', hints: ['Be honest', 'Show accountability', 'Focus on learning'], sampleAnswer: 'Choose a real but non-critical example. STAR format: what happened, what you did immediately (communicated early, reprioritized), and most importantly — what you learned and how you changed your workflow. Employers respect accountability and self-improvement far more than perfection.', concepts: ['Accountability', 'Time management', 'Communication', 'Growth mindset'] },
    ],
    Medium: [
      { id: 'b-m-1', question: 'Describe a situation where you had to learn something new very quickly.', hints: ['Specific technology or skill', 'Your learning approach', 'The outcome'], sampleAnswer: 'STAR: I joined a project using React (which I hadn\'t used). In 2 weeks I completed the official docs, built a mini project, paired with a senior dev, and delivered my first feature. Outcome: feature shipped on time, received positive code review. Shows: self-directed learning, resourcefulness, and delivery under pressure.', concepts: ['Adaptability', 'Learning agility', 'Resourcefulness', 'Delivery'] },
    ],
    Hard: [
      { id: 'b-h-1', question: 'Tell me about the most challenging project you worked on and how you overcame the obstacles.', hints: ['Choose genuinely complex', 'Highlight your specific role', 'Multiple obstacles'], sampleAnswer: 'Pick your strongest project. Structure: 1) What made it hard (technical + team challenges), 2) Specific actions you took (not "we"), 3) Quantified outcomes. Example: "Database was too slow — I profiled queries, added indexes, and rewrote 3 N+1 queries, cutting load time by 60%." Shows problem-solving depth and ownership.', concepts: ['Problem-solving', 'Ownership', 'Technical depth', 'Impact measurement'] },
    ],
  },
  DSA: {
    Easy: [
      { id: 'd-e-1', question: 'Given an array, find the two numbers that sum to a target. Explain your approach.', hints: ['Brute force first', 'Hash map optimization', 'One pass solution'], sampleAnswer: 'Brute force: O(n²) — check all pairs. Optimized: Use a hash map. For each number x, check if (target - x) exists in the map. If yes, return the pair. If no, add x to the map. This is O(n) time, O(n) space. Walk through an example: [2,7,11,15], target=9 → 2+7=9.', concepts: ['Hash maps', 'Two-pass vs one-pass', 'Time/space trade-off'] },
    ],
    Medium: [
      { id: 'd-m-1', question: 'Explain the sliding window technique and give an example problem.', hints: ['Fixed vs variable window', 'When to expand/shrink', 'Example: longest substring'], sampleAnswer: 'Sliding window maintains a dynamic subarray/substring range using two pointers. For "Longest Substring Without Repeating Characters": expand right pointer while chars are unique (track in set), shrink left pointer when duplicate found. O(n) time instead of O(n²) brute force. Best for contiguous subarrays/substrings with constraints.', concepts: ['Two pointers', 'Hash set tracking', 'O(n) optimization', 'Subarray problems'] },
    ],
    Hard: [
      { id: 'd-h-1', question: 'How would you find the median of two sorted arrays in O(log(m+n))?', hints: ['Binary search on smaller array', 'Partition concept', 'Edge cases'], sampleAnswer: 'Binary search on the smaller array. Find a partition point such that left half of both arrays combined contains (m+n)/2 elements. Check that maxLeft1 <= minRight2 and maxLeft2 <= minRight1. If not, adjust partition. The median is average of max(maxLeft) and min(minRight) for even total, or max(maxLeft) for odd. O(log(min(m,n))).', concepts: ['Binary search', 'Partitioning', 'Boundary conditions', 'Median property'] },
    ],
  },
};

interface SessionConfig {
  role: string;
  type: string;
  difficulty: string;
  count: number;
}

interface Answer {
  questionId: string;
  answer: string;
  reviewed: boolean;
  feedback?: AIFeedback;
}

interface AIFeedback {
  score: number;
  strengths: string[];
  improvements: string[];
  modelAnswer: string;
}

const FALLBACK_QUESTIONS: Question[] = [
  { id: 'fb-1', question: 'What is the difference between an array and a linked list?', hints: ['Think about memory allocation', 'Consider access time'], sampleAnswer: 'Arrays store elements in contiguous memory, allowing O(1) random access. Linked lists store elements as nodes with pointers, offering O(1) insertion/deletion at head but O(n) access. Arrays are better for indexed access; linked lists for frequent insertions/deletions.', concepts: ['Memory allocation', 'Time complexity', 'Data structures'] },
  { id: 'fb-2', question: 'Tell me about yourself.', hints: ['Present-Past-Future format', '2 minutes max', 'Relevant to the role'], sampleAnswer: 'Start with your current status, then cover relevant past experiences (internship, projects). End with why you\'re excited about this opportunity. Keep it to 90 seconds, focused, and confident.', concepts: ['Self-presentation', 'Confidence', 'Clarity'] },
  { id: 'fb-3', question: 'Describe a challenging project you worked on and how you overcame the obstacles.', hints: ['Choose genuinely complex', 'Highlight your specific role', 'Multiple obstacles'], sampleAnswer: 'Pick your strongest project. Structure: 1) What made it hard (technical + team challenges), 2) Specific actions you took (not "we"), 3) Quantified outcomes. Shows problem-solving depth and ownership.', concepts: ['Problem-solving', 'Ownership', 'Technical depth'] },
];

async function generateAIQuestions(cfg: SessionConfig): Promise<Question[]> {
  const prompt = `You are a technical interviewer preparing a candidate for a ${cfg.role} position. Generate exactly ${cfg.count} interview questions for a ${cfg.difficulty} difficulty ${cfg.type} interview.

Return ONLY a JSON object with this exact shape:
{"questions": [{"question": string, "hints": string[2], "sampleAnswer": string, "concepts": string[3]}]}

Rules:
- Each "question" is a single interview question tailored to the role and difficulty.
- Each "hints" array has exactly 2 short pointers the candidate can consider.
- "sampleAnswer" is a strong model answer, 2-4 sentences.
- "concepts" lists exactly 3 key concepts a good answer should mention.
- Vary the questions; do not repeat topics.`;

  const raw = await askOpenAI([
    { role: 'system', content: 'You are an expert interview coach. Respond only with valid JSON.' },
    { role: 'user', content: prompt },
  ], { json: true });

  const parsed = JSON.parse(raw) as { questions?: unknown };
  if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
    throw new Error('AI returned no questions');
  }

  return parsed.questions.slice(0, cfg.count).map((q, i) => {
    const obj = q as Record<string, unknown>;
    const hints = Array.isArray(obj.hints) ? obj.hints.filter((h): h is string => typeof h === 'string') : [];
    const concepts = Array.isArray(obj.concepts) ? obj.concepts.filter((c): c is string => typeof c === 'string') : [];
    if (typeof obj.question !== 'string' || typeof obj.sampleAnswer !== 'string') {
      throw new Error('AI returned malformed questions');
    }
    return {
      id: `ai-${Date.now()}-${i}`,
      question: obj.question,
      hints,
      sampleAnswer: obj.sampleAnswer,
      concepts,
    };
  });
}

async function reviewAnswer(cfg: SessionConfig, question: string, answer: string): Promise<AIFeedback> {
  const prompt = `A candidate interviewing for a ${cfg.role} position (${cfg.type} interview, ${cfg.difficulty} difficulty) was asked:

"${question}"

They answered:
"${answer}"

Evaluate their answer and return ONLY a JSON object with this exact shape:
{"score": number (0-100), "strengths": string[2-3], "improvements": string[1-3], "modelAnswer": string}

Rules:
- "score" reflects quality: completeness, correctness, structure, relevance.
- "strengths" are specific things they did well (be encouraging but honest; empty answers score 0).
- "improvements" are concrete, actionable suggestions.
- "modelAnswer" is a strong 2-4 sentence model answer to this exact question.`;

  const raw = await askOpenAI([
    { role: 'system', content: 'You are a supportive but rigorous interview coach. Respond only with valid JSON.' },
    { role: 'user', content: prompt },
  ], { json: true });

  const parsed = JSON.parse(raw) as Record<string, unknown>;
  const toStrArr = (v: unknown): string[] =>
    Array.isArray(v) ? v.filter((s): s is string => typeof s === 'string') : [];
  const modelAnswer = typeof parsed.modelAnswer === 'string' ? parsed.modelAnswer : '';
  const score = typeof parsed.score === 'number' ? Math.max(0, Math.min(100, Math.round(parsed.score))) : 0;
  const strengths = toStrArr(parsed.strengths);
  const improvements = toStrArr(parsed.improvements);
  if (!modelAnswer && strengths.length === 0 && improvements.length === 0) {
    throw new Error('AI returned malformed feedback');
  }
  return { score, strengths, improvements, modelAnswer };
}

async function summarizeSession(cfg: SessionConfig, qa: { question: string; answer: string; score: number }[]): Promise<{ overall: number; summary: string; tips: string[] }> {
  const transcript = qa.map((x, i) => `Q${i + 1}: ${x.question}\nA: ${x.answer || '(no answer)'} (score: ${x.score})`).join('\n\n');
  const prompt = `A candidate just finished a ${cfg.type} mock interview for a ${cfg.role} role at ${cfg.difficulty} difficulty. Here is the transcript with per-answer scores:\n\n${transcript}\n\nReturn ONLY a JSON object with this exact shape:\n{"overall": number (0-100 overall interview score), "summary": string (2-3 sentence honest assessment), "tips": string[3-4] (specific improvement tips for the next session)}`;

  const raw = await askOpenAI([
    { role: 'system', content: 'You are an honest interview coach writing a session debrief. Respond only with valid JSON.' },
    { role: 'user', content: prompt },
  ], { json: true });

  const parsed = JSON.parse(raw) as Record<string, unknown>;
  const tips = Array.isArray(parsed.tips) ? parsed.tips.filter((t): t is string => typeof t === 'string') : [];
  const summary = typeof parsed.summary === 'string' ? parsed.summary : '';
  const overall = typeof parsed.overall === 'number' ? Math.max(0, Math.min(100, Math.round(parsed.overall))) : 0;
  if (!summary && tips.length === 0) {
    throw new Error('AI returned malformed summary');
  }
  return { overall, summary, tips };
}

export default function MockInterview() {
  const [phase, setPhase] = useState<'config' | 'session' | 'summary'>('config');
  const [config, setConfig] = useState<SessionConfig>({ role: 'Software Developer', type: 'Technical', difficulty: 'Medium', count: 5 });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [aiError, setAiError] = useState('');
  const [generating, setGenerating] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [summary, setSummary] = useState<{ overall: number; summary: string; tips: string[] } | null>(null);

  const roles = ['Software Developer', 'Data Analyst', 'AI/ML Engineer', 'Frontend Developer', 'Backend Developer'];
  const types = ['Technical', 'HR', 'Behavioral', 'DSA'];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  const startSession = async () => {
    setGenerating(true);
    setAiError('');
    try {
      const aiQuestions = await generateAIQuestions(config);
      setQuestions(aiQuestions);
    } catch {
      const pool = questionBank[config.type]?.[config.difficulty] ?? questionBank.Technical.Medium;
      const shuffled = [...pool].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, Math.min(config.count, pool.length));
      setQuestions(selected.length > 0 ? selected : FALLBACK_QUESTIONS);
      setAiError('AI is unavailable right now — using built-in practice questions instead.');
    } finally {
      setGenerating(false);
    }
    setAnswers({});
    setCurrentIdx(0);
    setCurrentAnswer('');
    setShowAnswer(false);
    setSummary(null);
    setPhase('session');
  };

  const submitAnswer = async () => {
    const q = questions[currentIdx];
    setAnswers((prev) => ({ ...prev, [q.id]: { questionId: q.id, answer: currentAnswer, reviewed: false } }));
    setShowAnswer(true);
    setReviewing(true);
    try {
      const feedback = await reviewAnswer(config, q.question, currentAnswer);
      setAnswers((prev) => ({ ...prev, [q.id]: { ...prev[q.id], questionId: q.id, answer: currentAnswer, reviewed: true, feedback } }));
    } catch {
      setAiError('AI feedback is unavailable right now — showing the model answer instead.');
      setAnswers((prev) => ({ ...prev, [q.id]: { ...prev[q.id], questionId: q.id, answer: currentAnswer, reviewed: true } }));
    } finally {
      setReviewing(false);
    }
  };

  const nextQuestion = () => {
    const q = questions[currentIdx];
    setAnswers((prev) => ({ ...prev, [q.id]: { ...(prev[q.id] ?? { questionId: q.id, answer: '', reviewed: false }), reviewed: true } }));
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((i) => i + 1);
      setCurrentAnswer('');
      setShowAnswer(false);
    } else {
      finishSession();
    }
  };

  const finishSession = async () => {
    const attempted = Object.values(answers).filter((a) => a.answer.trim()).length;
    const answeredQA = questions.map((q) => ({
      question: q.question,
      answer: answers[q.id]?.answer ?? '',
      score: answers[q.id]?.feedback?.score ?? 0,
    })).filter((qa) => qa.answer.trim());

    let overallScore = Math.round((attempted / questions.length) * 100);
    setSummary(null);
    setPhase('summary');
    try {
      const result = await summarizeSession(config, answeredQA);
      setSummary(result);
      overallScore = result.overall;
    } catch {
      setAiError('AI session summary is unavailable right now.');
    }

    storage.addInterview({
      id: Date.now().toString(),
      role: config.role,
      type: config.type,
      difficulty: config.difficulty,
      questionsAttempted: attempted,
      totalQuestions: questions.length,
      date: new Date().toISOString(),
      score: overallScore,
    });
    storage.addActivity({
      id: Date.now().toString(),
      type: 'interview',
      description: `Completed ${config.type} Mock Interview — ${attempted}/${questions.length} answered`,
      timestamp: new Date().toISOString(),
      xp: 30,
    });
  };

  if (phase === 'config') {
    return (
      <div className="space-y-6 fade-in max-w-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Mic2 className="w-5 h-5 text-violet-400" />
            <h1 className="text-xl font-bold text-white">Mock Interview Studio</h1>
          </div>
          <p className="text-slate-400 text-sm">Practice with AI-generated questions and get personalized feedback on your answers.</p>
        </div>

        <div className="bg-violet-500/5 border border-violet-500/15 rounded-xl px-4 py-3 text-xs text-slate-500 flex items-start gap-2">
          <Sparkles className="w-3.5 h-3.5 text-violet-400 flex-shrink-0 mt-0.5" />
          <span>Questions are generated live by OpenAI and feedback is an automated practice evaluation — not a professional recruiter assessment.</span>
        </div>

        {aiError && (
          <div className="bg-orange-500/5 border border-orange-500/15 rounded-xl px-4 py-3 text-xs text-orange-300">{aiError}</div>
        )}

        <div className="bg-[#141B31] border border-white/5 rounded-2xl p-6 space-y-5">
          <div>
            <label className="text-xs font-medium text-slate-400 block mb-2">Target Role</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {roles.map((r) => (
                <button key={r} onClick={() => setConfig((c) => ({ ...c, role: r }))}
                  className={cn('px-3 py-2.5 rounded-xl border text-xs font-medium text-left transition-all',
                    config.role === r ? 'border-violet-500 bg-violet-600/15 text-violet-200' : 'border-white/8 text-slate-400 hover:border-white/20')}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 block mb-2">Interview Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {types.map((t) => (
                <button key={t} onClick={() => setConfig((c) => ({ ...c, type: t }))}
                  className={cn('px-3 py-2.5 rounded-xl border text-xs font-medium transition-all',
                    config.type === t ? 'border-violet-500 bg-violet-600/15 text-violet-200' : 'border-white/8 text-slate-400 hover:border-white/20')}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 block mb-2">Difficulty</label>
            <div className="grid grid-cols-3 gap-2">
              {difficulties.map((d) => (
                <button key={d} onClick={() => setConfig((c) => ({ ...c, difficulty: d }))}
                  className={cn('px-3 py-2.5 rounded-xl border text-xs font-medium transition-all',
                    config.difficulty === d ? 'border-violet-500 bg-violet-600/15 text-violet-200' : 'border-white/8 text-slate-400 hover:border-white/20')}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 block mb-2">Number of Questions</label>
            <div className="grid grid-cols-4 gap-2">
              {[3, 5, 7, 10].map((n) => (
                <button key={n} onClick={() => setConfig((c) => ({ ...c, count: n }))}
                  className={cn('px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all',
                    config.count === n ? 'border-violet-500 bg-violet-600/15 text-violet-200' : 'border-white/8 text-slate-400 hover:border-white/20')}>
                  {n}
                </button>
              ))}
            </div>
          </div>

          <button onClick={startSession} disabled={generating}
            className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2">
            {generating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating your interview with AI...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Start Interview Session
              </>
            )}
          </button>
        </div>

        {/* Previous sessions */}
        {storage.getInterviews().length > 0 && (
          <div className="bg-[#141B31] border border-white/5 rounded-2xl p-5">
            <h3 className="text-white font-semibold text-sm mb-3">Recent Sessions</h3>
            <div className="space-y-2">
              {storage.getInterviews().slice(-3).reverse().map((s) => (
                <div key={s.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-sm text-slate-300">{s.type} — {s.difficulty}</p>
                    <p className="text-xs text-slate-500">{new Date(s.date).toLocaleDateString()}</p>
                  </div>
                  <span className={cn('text-sm font-semibold', s.score >= 70 ? 'text-emerald-400' : 'text-yellow-400')}>
                    {s.questionsAttempted}/{s.totalQuestions}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (phase === 'session') {
    const q = questions[currentIdx];
    const answered = !!answers[q.id]?.answer?.trim();

    return (
      <div className="space-y-5 fade-in max-w-2xl">
        {/* Progress */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mic2 className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-medium text-white">{config.type} Interview</span>
            <span className="text-xs text-slate-500">· {config.difficulty}</span>
          </div>
          <div className="text-xs text-slate-400">{currentIdx + 1} / {questions.length}</div>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-violet-500 rounded-full transition-all" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
        </div>

        {/* Question */}
        <div className="bg-[#141B31] border border-white/5 rounded-2xl p-6">
          <div className="flex items-start gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-violet-600/20 text-violet-400 flex items-center justify-center text-sm font-bold flex-shrink-0">
              Q{currentIdx + 1}
            </div>
            <p className="text-white font-medium leading-relaxed">{q.question}</p>
          </div>

          {/* Hints */}
          <div className="mb-5">
            <p className="text-xs font-medium text-slate-500 mb-2">Hints to consider:</p>
            <div className="flex flex-wrap gap-1.5">
              {q.hints.map((h) => (
                <span key={h} className="text-xs bg-white/5 text-slate-400 px-2.5 py-1 rounded-full">{h}</span>
              ))}
            </div>
          </div>

          {/* Answer input */}
          {!showAnswer && (
            <div className="space-y-3">
              <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type your answer here... Think out loud, structure your thoughts."
                rows={5}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500/60 transition-colors resize-none"
              />
              <button onClick={submitAnswer}
                className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-colors">
                Submit Answer & See Feedback
              </button>
            </div>
          )}

          {/* Feedback */}
          {showAnswer && (
            <div className="space-y-4 fade-in">
              {answered && (
                <div className="bg-white/3 border border-white/8 rounded-xl p-4">
                  <p className="text-xs font-medium text-slate-400 mb-1">Your Answer:</p>
                  <p className="text-sm text-slate-300 leading-relaxed">{answers[q.id]?.answer || 'No answer provided.'}</p>
                </div>
              )}

              {reviewing && (
                <div className="bg-violet-500/5 border border-violet-500/15 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin flex-shrink-0" />
                  <p className="text-sm text-violet-300">AI coach is reviewing your answer...</p>
                </div>
              )}

              {!reviewing && answers[q.id]?.feedback && (
                <div className="space-y-4">
                  <div className="bg-violet-500/5 border border-violet-500/15 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-medium text-violet-400 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> AI Feedback
                      </p>
                      <span className={cn('text-lg font-bold',
                        (answers[q.id].feedback?.score ?? 0) >= 70 ? 'text-emerald-400' : (answers[q.id].feedback?.score ?? 0) >= 40 ? 'text-yellow-400' : 'text-red-400')}>
                        {answers[q.id].feedback?.score ?? 0}/100
                      </span>
                    </div>
                    {answers[q.id].feedback!.strengths.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-emerald-400 mb-1">What went well</p>
                        <ul className="space-y-1">
                          {answers[q.id].feedback!.strengths.map((s) => (
                            <li key={s} className="text-xs text-slate-400 flex items-start gap-1.5">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" /> {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {answers[q.id].feedback!.improvements.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-orange-400 mb-1">To improve</p>
                        <ul className="space-y-1">
                          {answers[q.id].feedback!.improvements.map((s) => (
                            <li key={s} className="text-xs text-slate-400 flex items-start gap-1.5">
                              <AlertCircle className="w-3 h-3 text-orange-400 flex-shrink-0 mt-0.5" /> {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="bg-white/3 border border-white/8 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-400 mb-2">Model Answer</p>
                    <p className="text-sm text-slate-300 leading-relaxed">{answers[q.id].feedback!.modelAnswer || q.sampleAnswer}</p>
                  </div>
                </div>
              )}

              {!reviewing && !answers[q.id]?.feedback && (
                <div className="bg-violet-500/5 border border-violet-500/15 rounded-xl p-4">
                  <p className="text-xs font-medium text-violet-400 mb-2 flex items-center gap-1.5">
                    <Bot className="w-3.5 h-3.5" /> Model Answer & Framework
                  </p>
                  <p className="text-sm text-slate-300 leading-relaxed">{q.sampleAnswer}</p>
                </div>
              )}

              <div className="bg-white/2 border border-white/5 rounded-xl p-3">
                <p className="text-xs font-medium text-slate-400 mb-2">Key Concepts to Mention:</p>
                <div className="flex flex-wrap gap-1.5">
                  {q.concepts.map((c) => (
                    <span key={c} className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full">{c}</span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                {currentIdx > 0 && (
                  <button onClick={() => { setCurrentIdx((i) => i - 1); setCurrentAnswer(answers[questions[currentIdx - 1].id]?.answer ?? ''); setShowAnswer(!!answers[questions[currentIdx - 1].id]?.reviewed); }}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white text-sm transition-colors">
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                )}
                <button onClick={nextQuestion}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-colors">
                  {currentIdx < questions.length - 1 ? (<>Next <ChevronRight className="w-4 h-4" /></>) : 'Finish Session'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Summary
  const attempted = Object.values(answers).filter((a) => a.answer.trim()).length;
  const pct = Math.round((attempted / questions.length) * 100);

  return (
    <div className="space-y-6 fade-in max-w-2xl">
      <div className="bg-[#141B31] border border-white/5 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-violet-600/15 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
          <Award className="w-8 h-8 text-violet-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-1">Session Complete!</h2>
        <p className="text-slate-400 text-sm mb-5">Great practice — here's how you did:</p>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Answered', value: `${attempted}/${questions.length}` },
            { label: 'Completion', value: `${pct}%` },
            { label: 'Difficulty', value: config.difficulty },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white/3 rounded-xl p-3">
              <p className="text-xl font-bold text-white">{value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
        <div className="text-left space-y-2 mb-6">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">AI Coach Summary</p>
          {summary ? (
            <>
              <div className="bg-violet-500/5 border border-violet-500/15 rounded-xl p-4 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-violet-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Overall Score
                  </p>
                  <span className={cn('text-xl font-bold',
                    summary.overall >= 70 ? 'text-emerald-400' : summary.overall >= 40 ? 'text-yellow-400' : 'text-red-400')}>
                    {summary.overall}/100
                  </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{summary.summary}</p>
              </div>
              {summary.tips.map((tip) => (
                <div key={tip} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-400">{tip}</p>
                </div>
              ))}
            </>
          ) : (
            <div className="flex items-center gap-2 py-2">
              <div className="w-4 h-4 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
              <p className="text-xs text-slate-500">AI coach is preparing your session debrief...</p>
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <button onClick={() => { setPhase('config'); setQuestions([]); }}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 text-slate-400 hover:text-white text-sm transition-colors">
            <RotateCcw className="w-4 h-4" /> New Session
          </button>
          <button onClick={startSession}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-colors">
            <Play className="w-4 h-4" /> Retry Same
          </button>
        </div>
      </div>
    </div>
  );
}
