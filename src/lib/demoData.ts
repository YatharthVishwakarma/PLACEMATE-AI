import type { DSAProblem, RoadmapPhase, AppStats, ActivityEntry, WeeklyActivity } from '../types';

export const defaultStats: AppStats = {
  placementReadiness: 62,
  skillsMastered: 14,
  dsaSolved: 87,
  learningStreak: 12,
  totalStudyHours: 134,
  assessmentsCompleted: 6,
  interviewsCompleted: 3,
  roadmapProgress: 45,
};

export const weeklyActivity: WeeklyActivity[] = [
  { day: 'Mon', hours: 2.5, problems: 8 },
  { day: 'Tue', hours: 3, problems: 12 },
  { day: 'Wed', hours: 1.5, problems: 5 },
  { day: 'Thu', hours: 4, problems: 15 },
  { day: 'Fri', hours: 2, problems: 7 },
  { day: 'Sat', hours: 5, problems: 20 },
  { day: 'Sun', hours: 3.5, problems: 10 },
];

export const sampleActivity: ActivityEntry[] = [
  { id: '1', type: 'dsa', description: 'Solved "Two Sum" on LeetCode', timestamp: new Date(Date.now() - 3600000).toISOString(), xp: 10 },
  { id: '2', type: 'assessment', description: 'Completed DSA Quiz — scored 8/10', timestamp: new Date(Date.now() - 7200000).toISOString(), xp: 25 },
  { id: '3', type: 'interview', description: 'Completed Technical Mock Interview', timestamp: new Date(Date.now() - 86400000).toISOString(), xp: 30 },
  { id: '4', type: 'roadmap', description: 'Finished Phase 2: Data Structures', timestamp: new Date(Date.now() - 172800000).toISOString(), xp: 50 },
  { id: '5', type: 'dsa', description: 'Solved "Valid Parentheses"', timestamp: new Date(Date.now() - 259200000).toISOString(), xp: 10 },
  { id: '6', type: 'resume', description: 'Analyzed resume — score 74/100', timestamp: new Date(Date.now() - 345600000).toISOString(), xp: 15 },
];

export const dsaProblems: DSAProblem[] = [
  // Arrays
  { id: 'a1', title: 'Two Sum', topic: 'Arrays', difficulty: 'Easy', status: 'Solved', url: 'https://leetcode.com/problems/two-sum/' },
  { id: 'a2', title: 'Best Time to Buy and Sell Stock', topic: 'Arrays', difficulty: 'Easy', status: 'Solved', url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
  { id: 'a3', title: 'Maximum Subarray', topic: 'Arrays', difficulty: 'Medium', status: 'Solved', url: 'https://leetcode.com/problems/maximum-subarray/' },
  { id: 'a4', title: 'Container With Most Water', topic: 'Arrays', difficulty: 'Medium', status: 'Attempted', url: 'https://leetcode.com/problems/container-with-most-water/' },
  { id: 'a5', title: '3Sum', topic: 'Arrays', difficulty: 'Medium', status: 'Attempted', url: 'https://leetcode.com/problems/3sum/' },
  { id: 'a6', title: 'Trapping Rain Water', topic: 'Arrays', difficulty: 'Hard', status: 'Not Started', url: 'https://leetcode.com/problems/trapping-rain-water/' },
  { id: 'a7', title: 'Product of Array Except Self', topic: 'Arrays', difficulty: 'Medium', status: 'Solved', url: 'https://leetcode.com/problems/product-of-array-except-self/' },
  { id: 'a8', title: 'Find Minimum in Rotated Sorted Array', topic: 'Arrays', difficulty: 'Medium', status: 'Not Started', url: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/' },

  // Strings
  { id: 's1', title: 'Valid Anagram', topic: 'Strings', difficulty: 'Easy', status: 'Solved', url: 'https://leetcode.com/problems/valid-anagram/' },
  { id: 's2', title: 'Valid Parentheses', topic: 'Strings', difficulty: 'Easy', status: 'Solved', url: 'https://leetcode.com/problems/valid-parentheses/' },
  { id: 's3', title: 'Longest Substring Without Repeating Characters', topic: 'Strings', difficulty: 'Medium', status: 'Solved', url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
  { id: 's4', title: 'Longest Palindromic Substring', topic: 'Strings', difficulty: 'Medium', status: 'Attempted', url: 'https://leetcode.com/problems/longest-palindromic-substring/' },
  { id: 's5', title: 'Group Anagrams', topic: 'Strings', difficulty: 'Medium', status: 'Not Started', url: 'https://leetcode.com/problems/group-anagrams/' },
  { id: 's6', title: 'Minimum Window Substring', topic: 'Strings', difficulty: 'Hard', status: 'Not Started', url: 'https://leetcode.com/problems/minimum-window-substring/' },

  // Linked Lists
  { id: 'l1', title: 'Reverse Linked List', topic: 'Linked Lists', difficulty: 'Easy', status: 'Solved', url: 'https://leetcode.com/problems/reverse-linked-list/' },
  { id: 'l2', title: 'Merge Two Sorted Lists', topic: 'Linked Lists', difficulty: 'Easy', status: 'Solved', url: 'https://leetcode.com/problems/merge-two-sorted-lists/' },
  { id: 'l3', title: 'Linked List Cycle', topic: 'Linked Lists', difficulty: 'Easy', status: 'Solved', url: 'https://leetcode.com/problems/linked-list-cycle/' },
  { id: 'l4', title: 'Remove Nth Node From End', topic: 'Linked Lists', difficulty: 'Medium', status: 'Attempted', url: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/' },
  { id: 'l5', title: 'Reorder List', topic: 'Linked Lists', difficulty: 'Medium', status: 'Not Started', url: 'https://leetcode.com/problems/reorder-list/' },

  // Stacks and Queues
  { id: 'sq1', title: 'Min Stack', topic: 'Stacks & Queues', difficulty: 'Medium', status: 'Solved', url: 'https://leetcode.com/problems/min-stack/' },
  { id: 'sq2', title: 'Evaluate Reverse Polish Notation', topic: 'Stacks & Queues', difficulty: 'Medium', status: 'Attempted', url: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/' },
  { id: 'sq3', title: 'Daily Temperatures', topic: 'Stacks & Queues', difficulty: 'Medium', status: 'Not Started', url: 'https://leetcode.com/problems/daily-temperatures/' },
  { id: 'sq4', title: 'Largest Rectangle in Histogram', topic: 'Stacks & Queues', difficulty: 'Hard', status: 'Not Started', url: 'https://leetcode.com/problems/largest-rectangle-in-histogram/' },

  // Searching & Sorting
  { id: 'ss1', title: 'Binary Search', topic: 'Searching & Sorting', difficulty: 'Easy', status: 'Solved', url: 'https://leetcode.com/problems/binary-search/' },
  { id: 'ss2', title: 'Search in Rotated Sorted Array', topic: 'Searching & Sorting', difficulty: 'Medium', status: 'Solved', url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/' },
  { id: 'ss3', title: 'Find Peak Element', topic: 'Searching & Sorting', difficulty: 'Medium', status: 'Not Started', url: 'https://leetcode.com/problems/find-peak-element/' },
  { id: 'ss4', title: 'Median of Two Sorted Arrays', topic: 'Searching & Sorting', difficulty: 'Hard', status: 'Not Started', url: 'https://leetcode.com/problems/median-of-two-sorted-arrays/' },

  // Recursion
  { id: 'r1', title: 'Climbing Stairs', topic: 'Recursion', difficulty: 'Easy', status: 'Solved', url: 'https://leetcode.com/problems/climbing-stairs/' },
  { id: 'r2', title: 'Subsets', topic: 'Recursion', difficulty: 'Medium', status: 'Attempted', url: 'https://leetcode.com/problems/subsets/' },
  { id: 'r3', title: 'Permutations', topic: 'Recursion', difficulty: 'Medium', status: 'Not Started', url: 'https://leetcode.com/problems/permutations/' },
  { id: 'r4', title: 'Word Search', topic: 'Recursion', difficulty: 'Medium', status: 'Not Started', url: 'https://leetcode.com/problems/word-search/' },

  // Trees
  { id: 't1', title: 'Invert Binary Tree', topic: 'Trees', difficulty: 'Easy', status: 'Solved', url: 'https://leetcode.com/problems/invert-binary-tree/' },
  { id: 't2', title: 'Maximum Depth of Binary Tree', topic: 'Trees', difficulty: 'Easy', status: 'Solved', url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/' },
  { id: 't3', title: 'Same Tree', topic: 'Trees', difficulty: 'Easy', status: 'Solved', url: 'https://leetcode.com/problems/same-tree/' },
  { id: 't4', title: 'Binary Tree Level Order Traversal', topic: 'Trees', difficulty: 'Medium', status: 'Attempted', url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/' },
  { id: 't5', title: 'Validate Binary Search Tree', topic: 'Trees', difficulty: 'Medium', status: 'Not Started', url: 'https://leetcode.com/problems/validate-binary-search-tree/' },
  { id: 't6', title: 'Binary Tree Maximum Path Sum', topic: 'Trees', difficulty: 'Hard', status: 'Not Started', url: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/' },

  // Graphs
  { id: 'g1', title: 'Number of Islands', topic: 'Graphs', difficulty: 'Medium', status: 'Solved', url: 'https://leetcode.com/problems/number-of-islands/' },
  { id: 'g2', title: 'Clone Graph', topic: 'Graphs', difficulty: 'Medium', status: 'Attempted', url: 'https://leetcode.com/problems/clone-graph/' },
  { id: 'g3', title: 'Pacific Atlantic Water Flow', topic: 'Graphs', difficulty: 'Medium', status: 'Not Started', url: 'https://leetcode.com/problems/pacific-atlantic-water-flow/' },
  { id: 'g4', title: 'Course Schedule', topic: 'Graphs', difficulty: 'Medium', status: 'Not Started', url: 'https://leetcode.com/problems/course-schedule/' },
  { id: 'g5', title: 'Alien Dictionary', topic: 'Graphs', difficulty: 'Hard', status: 'Not Started' },

  // Dynamic Programming
  { id: 'dp1', title: 'House Robber', topic: 'Dynamic Programming', difficulty: 'Medium', status: 'Solved', url: 'https://leetcode.com/problems/house-robber/' },
  { id: 'dp2', title: 'Coin Change', topic: 'Dynamic Programming', difficulty: 'Medium', status: 'Attempted', url: 'https://leetcode.com/problems/coin-change/' },
  { id: 'dp3', title: 'Longest Increasing Subsequence', topic: 'Dynamic Programming', difficulty: 'Medium', status: 'Not Started', url: 'https://leetcode.com/problems/longest-increasing-subsequence/' },
  { id: 'dp4', title: '0/1 Knapsack', topic: 'Dynamic Programming', difficulty: 'Medium', status: 'Not Started' },
  { id: 'dp5', title: 'Edit Distance', topic: 'Dynamic Programming', difficulty: 'Hard', status: 'Not Started', url: 'https://leetcode.com/problems/edit-distance/' },
  { id: 'dp6', title: 'Burst Balloons', topic: 'Dynamic Programming', difficulty: 'Hard', status: 'Not Started', url: 'https://leetcode.com/problems/burst-balloons/' },
];

export const roadmapTemplates: Record<string, RoadmapPhase[]> = {
  'Software Developer': [
    {
      id: 'sd-1', title: 'Phase 1: Programming Fundamentals', description: 'Master core programming concepts and a primary language.',
      objectives: ['Write clean, readable code', 'Understand variables, loops, functions', 'Object-oriented basics'],
      skills: ['Python or Java', 'Git basics', 'Problem decomposition'],
      tasks: [
        { id: 'sd-1-1', title: 'Complete Python/Java basics course', completed: true },
        { id: 'sd-1-2', title: 'Practice 20 basic problems on HackerRank', completed: true },
        { id: 'sd-1-3', title: 'Set up GitHub profile', completed: true },
      ],
      duration: '3 weeks', completed: true, progress: 100,
    },
    {
      id: 'sd-2', title: 'Phase 2: Data Structures', description: 'Learn essential data structures used in interviews.',
      objectives: ['Implement arrays, strings, linked lists', 'Understand stacks, queues, hash maps', 'Know when to use each structure'],
      skills: ['Array manipulation', 'Linked list operations', 'Hash tables'],
      tasks: [
        { id: 'sd-2-1', title: 'Study arrays and strings (20 problems)', completed: true },
        { id: 'sd-2-2', title: 'Implement linked list from scratch', completed: true },
        { id: 'sd-2-3', title: 'Practice stack/queue problems', completed: false },
      ],
      duration: '4 weeks', completed: false, progress: 67,
    },
    {
      id: 'sd-3', title: 'Phase 3: Algorithms', description: 'Master core algorithmic techniques.',
      objectives: ['Binary search and two pointers', 'Sorting algorithms', 'Recursion and backtracking'],
      skills: ['Time complexity analysis', 'Space optimization', 'Pattern recognition'],
      tasks: [
        { id: 'sd-3-1', title: 'Learn Big-O notation thoroughly', completed: false },
        { id: 'sd-3-2', title: 'Solve 30 medium LeetCode problems', completed: false },
        { id: 'sd-3-3', title: 'Practice recursion problems', completed: false },
      ],
      duration: '5 weeks', completed: false, progress: 0,
    },
    {
      id: 'sd-4', title: 'Phase 4: OOP & Design Patterns', description: 'Understand object-oriented design for building scalable systems.',
      objectives: ['Solid OOP principles', 'Common design patterns', 'Clean code practices'],
      skills: ['Inheritance, polymorphism', 'SOLID principles', 'Design patterns'],
      tasks: [
        { id: 'sd-4-1', title: 'Build a small OOP project', completed: false },
        { id: 'sd-4-2', title: 'Study 5 common design patterns', completed: false },
      ],
      duration: '3 weeks', completed: false, progress: 0,
    },
    {
      id: 'sd-5', title: 'Phase 5: DBMS & OS Concepts', description: 'Core computer science fundamentals for technical rounds.',
      objectives: ['SQL queries and normalization', 'Process management', 'Memory management'],
      skills: ['SQL', 'Joins and indexing', 'OS scheduling'],
      tasks: [
        { id: 'sd-5-1', title: 'Practice 30 SQL queries', completed: false },
        { id: 'sd-5-2', title: 'Study OS concepts: deadlock, scheduling', completed: false },
      ],
      duration: '3 weeks', completed: false, progress: 0,
    },
    {
      id: 'sd-6', title: 'Phase 6: Development Projects', description: 'Build real-world projects to demonstrate skills.',
      objectives: ['Full-stack application', 'REST APIs', 'Deployment basics'],
      skills: ['React or Node.js', 'REST APIs', 'Docker basics'],
      tasks: [
        { id: 'sd-6-1', title: 'Build a full-stack CRUD app', completed: false },
        { id: 'sd-6-2', title: 'Deploy to cloud (Vercel/Railway)', completed: false },
      ],
      duration: '5 weeks', completed: false, progress: 0,
    },
    {
      id: 'sd-7', title: 'Phase 7: Resume & Portfolio', description: 'Craft a compelling resume and developer portfolio.',
      objectives: ['ATS-optimized resume', 'GitHub portfolio', 'LinkedIn profile'],
      skills: ['Technical writing', 'Personal branding', 'Project showcase'],
      tasks: [
        { id: 'sd-7-1', title: 'Write ATS-friendly resume', completed: false },
        { id: 'sd-7-2', title: 'Polish 3 GitHub projects with READMEs', completed: false },
        { id: 'sd-7-3', title: 'Update LinkedIn profile', completed: false },
      ],
      duration: '2 weeks', completed: false, progress: 0,
    },
    {
      id: 'sd-8', title: 'Phase 8: Interview Preparation', description: 'Prepare for technical and HR interview rounds.',
      objectives: ['Mock interviews', 'Behavioral questions', 'System design basics'],
      skills: ['Communication', 'Problem-solving approach', 'STAR method'],
      tasks: [
        { id: 'sd-8-1', title: 'Complete 10 mock interviews', completed: false },
        { id: 'sd-8-2', title: 'Prepare 20 HR answers using STAR method', completed: false },
        { id: 'sd-8-3', title: 'Study basic system design concepts', completed: false },
      ],
      duration: '4 weeks', completed: false, progress: 0,
    },
  ],
  'Data Analyst': [
    {
      id: 'da-1', title: 'Phase 1: Python & Statistics', description: 'Foundation in Python and statistical thinking.',
      objectives: ['Python for data manipulation', 'Descriptive statistics', 'Data types'],
      skills: ['Python', 'NumPy', 'Pandas'],
      tasks: [
        { id: 'da-1-1', title: 'Complete Python data analysis course', completed: true },
        { id: 'da-1-2', title: 'Practice 15 Pandas exercises', completed: true },
      ],
      duration: '4 weeks', completed: true, progress: 100,
    },
    {
      id: 'da-2', title: 'Phase 2: SQL & Databases', description: 'Query and analyze data from relational databases.',
      objectives: ['Complex SQL queries', 'Joins and aggregations', 'Window functions'],
      skills: ['SQL', 'PostgreSQL', 'Data modeling'],
      tasks: [
        { id: 'da-2-1', title: 'Solve 50 SQL problems on Mode Analytics', completed: false },
        { id: 'da-2-2', title: 'Build a database project', completed: false },
      ],
      duration: '3 weeks', completed: false, progress: 30,
    },
    {
      id: 'da-3', title: 'Phase 3: Data Visualization', description: 'Tell compelling stories with data.',
      objectives: ['Chart selection', 'Dashboard design', 'Storytelling with data'],
      skills: ['Tableau or Power BI', 'Matplotlib', 'Seaborn'],
      tasks: [
        { id: 'da-3-1', title: 'Build 3 Tableau dashboards', completed: false },
        { id: 'da-3-2', title: 'Complete a data storytelling project', completed: false },
      ],
      duration: '3 weeks', completed: false, progress: 0,
    },
    {
      id: 'da-4', title: 'Phase 4: Machine Learning Basics', description: 'Apply ML techniques to real data problems.',
      objectives: ['Supervised learning', 'Model evaluation', 'Feature engineering'],
      skills: ['Scikit-learn', 'Regression', 'Classification'],
      tasks: [
        { id: 'da-4-1', title: 'Complete ML course on Kaggle', completed: false },
        { id: 'da-4-2', title: 'Submit to 2 Kaggle competitions', completed: false },
      ],
      duration: '5 weeks', completed: false, progress: 0,
    },
  ],
  'Frontend Developer': [
    {
      id: 'fe-1', title: 'Phase 1: HTML, CSS & JavaScript', description: 'Master the holy trinity of the web.',
      objectives: ['Semantic HTML', 'CSS layout and animations', 'Vanilla JS'],
      skills: ['HTML5', 'CSS3', 'ES6+'],
      tasks: [
        { id: 'fe-1-1', title: 'Build 5 responsive layouts', completed: true },
        { id: 'fe-1-2', title: 'Complete JavaScript 30 challenge', completed: true },
      ],
      duration: '5 weeks', completed: true, progress: 100,
    },
    {
      id: 'fe-2', title: 'Phase 2: React & TypeScript', description: 'Build modern, type-safe UIs.',
      objectives: ['Component-driven architecture', 'State management', 'TypeScript basics'],
      skills: ['React', 'TypeScript', 'React Router'],
      tasks: [
        { id: 'fe-2-1', title: 'Build a React todo app with TypeScript', completed: true },
        { id: 'fe-2-2', title: 'Learn React hooks deeply', completed: false },
      ],
      duration: '5 weeks', completed: false, progress: 50,
    },
    {
      id: 'fe-3', title: 'Phase 3: Styling & Animation', description: 'Create polished, animated interfaces.',
      objectives: ['CSS-in-JS', 'Tailwind mastery', 'Framer Motion'],
      skills: ['Tailwind CSS', 'Framer Motion', 'Design systems'],
      tasks: [
        { id: 'fe-3-1', title: 'Rebuild an existing site with Tailwind', completed: false },
        { id: 'fe-3-2', title: 'Add animations to a project', completed: false },
      ],
      duration: '3 weeks', completed: false, progress: 0,
    },
    {
      id: 'fe-4', title: 'Phase 4: Performance & Best Practices', description: 'Ship fast, accessible, maintainable code.',
      objectives: ['Web vitals', 'Accessibility (a11y)', 'Testing basics'],
      skills: ['Lighthouse', 'ARIA', 'React Testing Library'],
      tasks: [
        { id: 'fe-4-1', title: 'Achieve 90+ Lighthouse score on a project', completed: false },
        { id: 'fe-4-2', title: 'Write tests for a React component', completed: false },
      ],
      duration: '4 weeks', completed: false, progress: 0,
    },
  ],
};

// Map remaining roles to Software Developer template
roadmapTemplates['AI/ML Engineer'] = roadmapTemplates['Software Developer'].map((p) => ({ ...p }));
roadmapTemplates['Backend Developer'] = roadmapTemplates['Software Developer'].map((p) => ({ ...p }));

export const skillsData = [
  { name: 'Data Structures', value: 72 },
  { name: 'Algorithms', value: 58 },
  { name: 'System Design', value: 35 },
  { name: 'DBMS / SQL', value: 65 },
  { name: 'OOP', value: 80 },
  { name: 'OS Concepts', value: 50 },
];

export const progressOverTime = [
  { month: 'Jul', readiness: 30, dsaSolved: 20, skills: 3 },
  { month: 'Aug', readiness: 38, dsaSolved: 35, skills: 5 },
  { month: 'Sep', readiness: 47, dsaSolved: 55, skills: 8 },
  { month: 'Oct', readiness: 62, dsaSolved: 87, skills: 14 },
];

export const assessmentHistory = [
  { subject: 'Data Structures & Algorithms', score: 8, total: 10, date: '2026-10-10' },
  { subject: 'OOP & C++', score: 7, total: 10, date: '2026-10-08' },
  { subject: 'DBMS', score: 6, total: 10, date: '2026-10-05' },
  { subject: 'Computer Networks', score: 5, total: 10, date: '2026-10-02' },
  { subject: 'Operating Systems', score: 7, total: 10, date: '2026-09-28' },
  { subject: 'JavaScript', score: 9, total: 10, date: '2026-09-25' },
];
