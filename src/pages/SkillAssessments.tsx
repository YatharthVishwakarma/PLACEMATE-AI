import { useState } from 'react';
import { ClipboardCheck, CheckCircle2, XCircle, RotateCcw, Award, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { storage } from '../lib/localStorage';
import { assessmentHistory } from '../lib/demoData';

interface MCQ {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: MCQ[];
  color: string;
}

const quizzes: Quiz[] = [
  {
    id: 'dsa', title: 'Data Structures & Algorithms', description: 'Arrays, trees, graphs, sorting, and complexity analysis',
    color: 'violet', questions: [
      { question: 'What is the time complexity of binary search?', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], correct: 1, explanation: 'Binary search halves the search space at each step, making it O(log n).' },
      { question: 'Which data structure uses LIFO principle?', options: ['Queue', 'Stack', 'Linked List', 'Tree'], correct: 1, explanation: 'A Stack follows Last-In-First-Out. The last element pushed is the first to be popped.' },
      { question: 'What is the worst-case time complexity of QuickSort?', options: ['O(n log n)', 'O(n)', 'O(n²)', 'O(log n)'], correct: 2, explanation: 'QuickSort worst case is O(n²) when the pivot is always the smallest or largest element (sorted array with naive pivot).' },
      { question: 'A complete binary tree with n nodes has how many leaf nodes approximately?', options: ['n/4', 'n/2', 'n/3', 'n'], correct: 1, explanation: 'In a complete binary tree, approximately half the nodes (n/2) are leaf nodes.' },
      { question: 'Which algorithm is best for finding the shortest path in an unweighted graph?', options: ['DFS', 'Dijkstra', 'BFS', 'Bellman-Ford'], correct: 2, explanation: 'BFS explores nodes level by level, guaranteeing shortest path in an unweighted graph.' },
    ],
  },
  {
    id: 'oop', title: 'OOP & C++', description: 'Classes, inheritance, polymorphism, templates, and STL',
    color: 'cyan', questions: [
      { question: 'Which OOP concept allows one class to inherit properties from another?', options: ['Encapsulation', 'Polymorphism', 'Inheritance', 'Abstraction'], correct: 2, explanation: 'Inheritance allows a child class to inherit attributes and methods from a parent class.' },
      { question: 'What does the virtual keyword do in C++?', options: ['Makes a function inline', 'Enables runtime polymorphism', 'Prevents class instantiation', 'Creates a static method'], correct: 1, explanation: 'virtual enables dynamic dispatch — the correct overridden function is called at runtime based on object type.' },
      { question: 'What is encapsulation?', options: ['Hiding implementation details', 'Having multiple forms', 'Deriving from parent class', 'Using templates'], correct: 0, explanation: 'Encapsulation bundles data (attributes) and methods into a class and restricts direct access using access modifiers.' },
      { question: 'Which access specifier allows access only within the class?', options: ['public', 'protected', 'private', 'internal'], correct: 2, explanation: 'private members are accessible only within the class definition, not from outside or derived classes.' },
      { question: 'What is a pure virtual function in C++?', options: ['A function with no body declared as = 0', 'A static function', 'A const function', 'A template function'], correct: 0, explanation: 'A pure virtual function (= 0) has no implementation in the base class, making the class abstract.' },
    ],
  },
  {
    id: 'dbms', title: 'DBMS', description: 'SQL, normalization, transactions, and indexing',
    color: 'emerald', questions: [
      { question: 'What does ACID stand for in database transactions?', options: ['Array, Class, Interface, Data', 'Atomicity, Consistency, Isolation, Durability', 'Access, Control, Index, Delete', 'Aggregation, Column, Insert, Drop'], correct: 1, explanation: 'ACID properties ensure reliable database transactions: Atomicity (all-or-nothing), Consistency, Isolation, Durability.' },
      { question: 'Which normal form eliminates transitive dependencies?', options: ['1NF', '2NF', '3NF', 'BCNF'], correct: 2, explanation: '3NF (Third Normal Form) eliminates transitive dependencies — non-key columns depending on other non-key columns.' },
      { question: 'What is a foreign key?', options: ['Primary key of another table referenced in current table', 'Unique identifier in a table', 'An encrypted column', 'Index on a column'], correct: 0, explanation: 'A foreign key is a column referencing the primary key of another table, establishing a relationship.' },
      { question: 'What type of JOIN returns all records from both tables?', options: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN'], correct: 3, explanation: 'FULL OUTER JOIN returns all records from both tables, with NULL for non-matching rows from either side.' },
      { question: 'What is a deadlock?', options: ['A slow query', 'Two transactions waiting for each other to release locks', 'A corrupted database', 'Failed transaction'], correct: 1, explanation: 'Deadlock occurs when two transactions each hold a lock the other needs, creating a circular wait.' },
    ],
  },
  {
    id: 'os', title: 'Operating Systems', description: 'Process management, memory, scheduling, and synchronization',
    color: 'orange', questions: [
      { question: 'What is a process?', options: ['A program stored on disk', 'A program in execution', 'An algorithm', 'A data structure'], correct: 1, explanation: 'A process is a program in execution — it includes the code, data, stack, heap, and OS resources.' },
      { question: 'Which scheduling algorithm gives minimum average waiting time?', options: ['FCFS', 'Round Robin', 'Shortest Job First (non-preemptive)', 'Priority Scheduling'], correct: 2, explanation: 'SJF (non-preemptive) minimizes average waiting time but requires knowing burst times in advance.' },
      { question: 'What is a semaphore used for?', options: ['Memory allocation', 'Synchronization between processes', 'Disk scheduling', 'File management'], correct: 1, explanation: 'Semaphores are synchronization tools used to control access to shared resources and avoid race conditions.' },
      { question: 'What is thrashing?', options: ['High CPU utilization', 'Excessive page swapping causing low CPU utilization', 'Fast context switching', 'Disk fragmentation'], correct: 1, explanation: 'Thrashing occurs when a process spends more time paging than executing, due to insufficient physical memory.' },
      { question: 'LRU stands for:', options: ['Last Recently Used', 'Least Recently Used', 'Least Recently Utilized', 'Last Run Unit'], correct: 1, explanation: 'LRU (Least Recently Used) is a page replacement policy that evicts the page not used for the longest time.' },
    ],
  },
  {
    id: 'cn', title: 'Computer Networks', description: 'OSI model, TCP/IP, HTTP, DNS, and security',
    color: 'blue', questions: [
      { question: 'How many layers does the OSI model have?', options: ['4', '5', '6', '7'], correct: 3, explanation: 'The OSI model has 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, Application.' },
      { question: 'What protocol is used to translate domain names to IP addresses?', options: ['HTTP', 'DNS', 'FTP', 'SMTP'], correct: 1, explanation: 'DNS (Domain Name System) resolves human-readable domain names (google.com) to IP addresses.' },
      { question: 'What does TCP guarantee that UDP does not?', options: ['Speed', 'Reliability and ordered delivery', 'Lower overhead', 'Multicast support'], correct: 1, explanation: 'TCP provides reliable, ordered, error-checked delivery. UDP is faster but doesn\'t guarantee delivery or order.' },
      { question: 'What is a subnet mask?', options: ['A firewall rule', 'Used to divide an IP address into network and host portions', 'MAC address format', 'Routing protocol'], correct: 1, explanation: 'A subnet mask (e.g., 255.255.255.0) defines which part of an IP address is the network vs. host portion.' },
      { question: 'HTTPS is HTTP with:', options: ['Faster speed', 'SSL/TLS encryption', 'UDP transport', 'IPv6 support'], correct: 1, explanation: 'HTTPS adds SSL/TLS encryption to HTTP, securing data in transit between client and server.' },
    ],
  },
  {
    id: 'js', title: 'JavaScript', description: 'ES6+, closures, async/await, and web APIs',
    color: 'yellow', questions: [
      { question: 'What does "use strict" do in JavaScript?', options: ['Enables strict typing', 'Prevents use of undeclared variables and unsafe features', 'Makes code run faster', 'Enables ES6 modules'], correct: 1, explanation: '"use strict" enforces stricter parsing: prevents global variable creation, silent errors become exceptions.' },
      { question: 'What is a closure?', options: ['A function that closes a file', 'A function with access to outer scope even after it has returned', 'An IIFE', 'A class constructor'], correct: 1, explanation: 'A closure is a function that remembers the scope where it was created, even when called from a different scope.' },
      { question: 'What does Promise.all() do?', options: ['Runs promises sequentially', 'Resolves when all promises resolve, rejects if any rejects', 'Returns the first resolved promise', 'Ignores rejections'], correct: 1, explanation: 'Promise.all() takes an array of promises and resolves with all results, or rejects immediately if any one fails.' },
      { question: 'What is the output of typeof null?', options: ['"null"', '"undefined"', '"object"', '"boolean"'], correct: 2, explanation: 'typeof null returns "object" — this is a historic bug in JavaScript that exists for backwards compatibility.' },
      { question: 'Arrow functions differ from regular functions because they:', options: ['Cannot take parameters', 'Do not have their own "this"', 'Cannot return values', 'Are always async'], correct: 1, explanation: 'Arrow functions inherit "this" from the enclosing lexical scope. Regular functions have their own "this" binding.' },
    ],
  },
  {
    id: 'python', title: 'Python', description: 'Core Python, data structures, OOP, and common libraries',
    color: 'green', questions: [
      { question: 'What is a list comprehension in Python?', options: ['A way to sort lists', 'A concise syntax to create lists', 'A method to flatten nested lists', 'A built-in function'], correct: 1, explanation: 'List comprehension: [expr for item in iterable if condition] — a concise way to create lists.' },
      { question: 'What does the GIL (Global Interpreter Lock) prevent?', options: ['Memory leaks', 'True multi-threading in CPython', 'Import of modules', 'Exception handling'], correct: 1, explanation: 'The GIL prevents multiple native threads from executing Python bytecode simultaneously, limiting CPU parallelism.' },
      { question: 'What is the difference between list and tuple?', options: ['Lists are faster', 'Tuples are mutable, lists are not', 'Lists are mutable, tuples are immutable', 'No difference'], correct: 2, explanation: 'Lists are mutable (can change elements), tuples are immutable. Tuples are used for fixed data.' },
      { question: 'What does *args do in a function?', options: ['Creates keyword arguments', 'Passes a variable number of positional arguments', 'Makes arguments optional', 'Unpacks a dictionary'], correct: 1, explanation: '*args collects extra positional arguments into a tuple, allowing functions to accept any number of arguments.' },
      { question: 'Which of these is NOT a Python built-in data type?', options: ['dict', 'set', 'array', 'frozenset'], correct: 2, explanation: 'array is not a built-in type — it\'s in the array module. dict, set, and frozenset are built-in.' },
    ],
  },
  {
    id: 'ml', title: 'AI & Machine Learning', description: 'ML algorithms, training, evaluation, and deep learning basics',
    color: 'pink', questions: [
      { question: 'What is overfitting in machine learning?', options: ['Model performs well on training, poorly on test data', 'Model has too few parameters', 'Training data is too large', 'Model trains too slowly'], correct: 0, explanation: 'Overfitting: model memorizes training data but fails to generalize. Fix: more data, regularization, dropout, cross-validation.' },
      { question: 'Which algorithm is used for classification?', options: ['Linear Regression', 'Logistic Regression', 'K-Means', 'PCA'], correct: 1, explanation: 'Logistic Regression predicts probabilities for classification tasks. Linear Regression predicts continuous values.' },
      { question: 'What does gradient descent do?', options: ['Increases loss function', 'Minimizes loss by adjusting parameters in the direction of negative gradient', 'Selects features', 'Reduces overfitting'], correct: 1, explanation: 'Gradient descent iteratively updates parameters by moving against the gradient of the loss function to find the minimum.' },
      { question: 'What is precision in a classification model?', options: ['TP / (TP + FN)', 'TP / (TP + FP)', 'TN / (TN + FP)', 'Accuracy on test set'], correct: 1, explanation: 'Precision = TP/(TP+FP) — of all predicted positives, how many are actually positive. Important when false positives are costly.' },
      { question: 'What is the purpose of the activation function in a neural network?', options: ['Normalize inputs', 'Add non-linearity to model complex patterns', 'Reduce learning rate', 'Initialize weights'], correct: 1, explanation: 'Activation functions (ReLU, sigmoid, tanh) introduce non-linearity, allowing neural networks to learn complex patterns.' },
    ],
  },
];

const colorClasses: Record<string, string> = {
  violet: 'bg-violet-600/15 text-violet-400 border-violet-500/20',
  cyan: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
  emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  orange: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
  blue: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  yellow: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  green: 'bg-green-500/15 text-green-400 border-green-500/20',
  pink: 'bg-pink-500/15 text-pink-400 border-pink-500/20',
};

export default function SkillAssessments() {
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const savedHistory = storage.getAssessments();
  const history = savedHistory.length > 0 ? savedHistory : assessmentHistory.map((h, i) => ({
    id: String(i), subject: h.subject, score: h.score, total: h.total, date: h.date, timeSpent: 10
  }));

  const startQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQ(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setFinished(false);
  };

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === selectedQuiz!.questions[currentQ].correct) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (currentQ < selectedQuiz!.questions.length - 1) {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setFinished(true);
      storage.addAssessment({
        id: Date.now().toString(),
        subject: selectedQuiz!.title,
        score: answered && selected === selectedQuiz!.questions[currentQ].correct ? score : score,
        total: selectedQuiz!.questions.length,
        date: new Date().toISOString().split('T')[0],
        timeSpent: 8,
      });
      storage.addActivity({
        id: Date.now().toString(),
        type: 'assessment',
        description: `Completed ${selectedQuiz!.title} quiz`,
        timestamp: new Date().toISOString(),
        xp: 25,
      });
    }
  };

  if (finished && selectedQuiz) {
    const finalScore = score;
    const total = selectedQuiz.questions.length;
    const pct = Math.round((finalScore / total) * 100);
    return (
      <div className="space-y-5 fade-in max-w-lg">
        <div className="bg-[#141B31] border border-white/5 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-violet-600/15 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-violet-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-1">Quiz Complete!</h2>
          <p className="text-slate-400 text-sm mb-5">{selectedQuiz.title}</p>
          <div className="text-5xl font-bold mb-1 gradient-text">{finalScore}/{total}</div>
          <p className={cn('text-sm font-medium mb-5', pct >= 70 ? 'text-emerald-400' : pct >= 50 ? 'text-yellow-400' : 'text-red-400')}>
            {pct}% — {pct >= 80 ? 'Excellent!' : pct >= 60 ? 'Good job!' : 'Keep practicing!'}
          </p>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-6">
            <div className={cn('h-full rounded-full', pct >= 70 ? 'bg-emerald-500' : 'bg-yellow-500')} style={{ width: `${pct}%` }} />
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setSelectedQuiz(null); setFinished(false); }}
              className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white text-sm transition-colors flex items-center justify-center gap-2">
              <RotateCcw className="w-4 h-4" /> All Quizzes
            </button>
            <button onClick={() => startQuiz(selectedQuiz)}
              className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-colors">
              Retry Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedQuiz) {
    const q = selectedQuiz.questions[currentQ];
    return (
      <div className="space-y-5 fade-in max-w-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold">{selectedQuiz.title}</h3>
          <span className="text-xs text-slate-500">{currentQ + 1} / {selectedQuiz.questions.length}</span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-violet-500 rounded-full transition-all" style={{ width: `${((currentQ + 1) / selectedQuiz.questions.length) * 100}%` }} />
        </div>

        <div className="bg-[#141B31] border border-white/5 rounded-2xl p-6">
          <p className="text-white font-medium mb-5 leading-relaxed">{q.question}</p>
          <div className="space-y-2.5">
            {q.options.map((opt, idx) => {
              let variant = 'border-white/8 text-slate-400 hover:border-white/20 hover:text-slate-200';
              if (answered) {
                if (idx === q.correct) variant = 'border-emerald-500 bg-emerald-500/10 text-emerald-300';
                else if (idx === selected && idx !== q.correct) variant = 'border-red-500 bg-red-500/10 text-red-300';
                else variant = 'border-white/5 text-slate-600 opacity-50';
              } else if (selected === idx) {
                variant = 'border-violet-500 bg-violet-600/15 text-violet-200';
              }
              return (
                <button key={idx} onClick={() => handleSelect(idx)}
                  className={cn('w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm text-left transition-all', variant)}>
                  <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {['A', 'B', 'C', 'D'][idx]}
                  </span>
                  {opt}
                  {answered && idx === q.correct && <CheckCircle2 className="ml-auto w-4 h-4 text-emerald-400 flex-shrink-0" />}
                  {answered && idx === selected && idx !== q.correct && <XCircle className="ml-auto w-4 h-4 text-red-400 flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          {answered && (
            <div className="mt-4 p-4 bg-white/3 border border-white/8 rounded-xl fade-in">
              <p className="text-xs font-medium text-violet-400 mb-1">Explanation</p>
              <p className="text-xs text-slate-400 leading-relaxed">{q.explanation}</p>
            </div>
          )}

          {answered && (
            <button onClick={handleNext}
              className="mt-4 w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2">
              {currentQ < selectedQuiz.questions.length - 1 ? (<>Next Question <ChevronRight className="w-4 h-4" /></>) : 'See Results'}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <ClipboardCheck className="w-5 h-5 text-violet-400" />
          <h1 className="text-xl font-bold text-white">Skill Assessments</h1>
        </div>
        <p className="text-slate-400 text-sm">Test your knowledge across core CS subjects with short, focused quizzes.</p>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="bg-[#141B31] border border-white/5 rounded-2xl p-5">
          <h3 className="text-white font-semibold text-sm mb-3">Recent Results</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {history.slice(-6).map((h, i) => {
              const pct = Math.round((h.score / h.total) * 100);
              return (
                <div key={i} className="flex items-center justify-between p-3 bg-white/3 rounded-xl border border-white/5">
                  <div>
                    <p className="text-xs font-medium text-slate-300 truncate max-w-32">{h.subject}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{typeof h.date === 'string' ? h.date.split('T')[0] : h.date}</p>
                  </div>
                  <span className={cn('text-sm font-bold', pct >= 70 ? 'text-emerald-400' : 'text-yellow-400')}>{h.score}/{h.total}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quiz cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="bg-[#141B31] border border-white/5 rounded-2xl p-5 card-hover group cursor-pointer" onClick={() => startQuiz(quiz)}>
            <div className={cn('w-10 h-10 rounded-xl border flex items-center justify-center mb-4', colorClasses[quiz.color])}>
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <h3 className="text-white font-semibold text-sm mb-1">{quiz.title}</h3>
            <p className="text-slate-500 text-xs mb-4 leading-relaxed">{quiz.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600">{quiz.questions.length} questions</span>
              <button className="text-xs font-medium text-violet-400 group-hover:text-violet-300 flex items-center gap-1 transition-colors">
                Start <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
