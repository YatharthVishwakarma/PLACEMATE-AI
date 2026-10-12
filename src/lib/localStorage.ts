import type {
  UserProfile,
  DSAProblem,
  AssessmentResult,
  InterviewSession,
  AppStats,
  ActivityEntry,
  RoadmapPhase,
} from '../types';

const KEYS = {
  PROFILE: 'placemate_profile',
  DSA_PROGRESS: 'placemate_dsa',
  ASSESSMENTS: 'placemate_assessments',
  INTERVIEWS: 'placemate_interviews',
  STATS: 'placemate_stats',
  ACTIVITY: 'placemate_activity',
  ROADMAP: 'placemate_roadmap',
} as const;

function get<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function set<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage errors
  }
}

export const storage = {
  getProfile: (): UserProfile | null => get<UserProfile>(KEYS.PROFILE),
  setProfile: (profile: UserProfile) => set(KEYS.PROFILE, profile),

  getDSAProgress: (): Record<string, DSAProblem['status']> =>
    get<Record<string, DSAProblem['status']>>(KEYS.DSA_PROGRESS) ?? {},
  setDSAProgress: (progress: Record<string, DSAProblem['status']>) =>
    set(KEYS.DSA_PROGRESS, progress),

  getAssessments: (): AssessmentResult[] =>
    get<AssessmentResult[]>(KEYS.ASSESSMENTS) ?? [],
  addAssessment: (result: AssessmentResult) => {
    const existing = storage.getAssessments();
    set(KEYS.ASSESSMENTS, [...existing, result]);
  },

  getInterviews: (): InterviewSession[] =>
    get<InterviewSession[]>(KEYS.INTERVIEWS) ?? [],
  addInterview: (session: InterviewSession) => {
    const existing = storage.getInterviews();
    set(KEYS.INTERVIEWS, [...existing, session]);
  },

  getStats: (): AppStats | null => get<AppStats>(KEYS.STATS),
  setStats: (stats: AppStats) => set(KEYS.STATS, stats),
  updateStats: (partial: Partial<AppStats>) => {
    const existing = storage.getStats();
    if (existing) {
      set(KEYS.STATS, { ...existing, ...partial });
    }
  },

  getActivity: (): ActivityEntry[] =>
    get<ActivityEntry[]>(KEYS.ACTIVITY) ?? [],
  addActivity: (entry: ActivityEntry) => {
    const existing = storage.getActivity();
    set(KEYS.ACTIVITY, [entry, ...existing].slice(0, 50));
  },

  getRoadmap: (): RoadmapPhase[] | null => get<RoadmapPhase[]>(KEYS.ROADMAP),
  setRoadmap: (phases: RoadmapPhase[]) => set(KEYS.ROADMAP, phases),

  clearAll: () => {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  },
};
