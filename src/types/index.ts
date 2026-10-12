export type TargetRole =
  | 'Software Developer'
  | 'Data Analyst'
  | 'AI/ML Engineer'
  | 'Frontend Developer'
  | 'Backend Developer';

export type CodingLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type YearOfStudy = '1st Year' | '2nd Year' | '3rd Year' | '4th Year' | 'Final Year';

export interface UserProfile {
  name: string;
  college: string;
  degree: string;
  branch: string;
  year: YearOfStudy;
  targetRole: TargetRole;
  codingLevel: CodingLevel;
  targetTimeline: string;
  avatar?: string;
  onboardingComplete: boolean;
  createdAt: string;
}

export interface RoadmapPhase {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  skills: string[];
  tasks: RoadmapTask[];
  duration: string;
  completed: boolean;
  progress: number;
}

export interface RoadmapTask {
  id: string;
  title: string;
  completed: boolean;
}

export type DSADifficulty = 'Easy' | 'Medium' | 'Hard';
export type DSAStatus = 'Not Started' | 'Attempted' | 'Solved';

export interface DSAProblem {
  id: string;
  title: string;
  topic: string;
  difficulty: DSADifficulty;
  status: DSAStatus;
  url?: string;
}

export interface AssessmentResult {
  id: string;
  subject: string;
  score: number;
  total: number;
  date: string;
  timeSpent: number;
}

export interface InterviewSession {
  id: string;
  role: string;
  type: string;
  difficulty: string;
  questionsAttempted: number;
  totalQuestions: number;
  date: string;
  score: number;
}

export interface AppStats {
  placementReadiness: number;
  skillsMastered: number;
  dsaSolved: number;
  learningStreak: number;
  totalStudyHours: number;
  assessmentsCompleted: number;
  interviewsCompleted: number;
  roadmapProgress: number;
}

export interface ActivityEntry {
  id: string;
  type: 'dsa' | 'assessment' | 'interview' | 'roadmap' | 'resume';
  description: string;
  timestamp: string;
  xp?: number;
}

export interface WeeklyActivity {
  day: string;
  hours: number;
  problems: number;
}
