/**
 * AI Mock Interview Questions & Evaluation Engine
 */

export const INTERVIEW_MODES = [
  {
    id: "technical",
    title: "Technical Interview",
    description: "In-depth technical screening on Data Structures, OOP, DBMS, OS, and Computer Networks.",
    duration: "~20 minutes",
    icon: "code",
    topics: ["DSA", "OOP", "DBMS", "OS", "Computer Networks"],
    badge: "Core Placement"
  },
  {
    id: "hr",
    title: "HR / Behavioral Interview",
    description: "Evaluate soft skills, situation handling, teamwork, career goals, and cultural fit.",
    duration: "~15 minutes",
    icon: "user-check",
    topics: ["Introduction", "Strengths & Weaknesses", "Teamwork", "Leadership", "Conflict Handling"],
    badge: "Behavioral"
  },
  {
    id: "full",
    title: "Full Mock Interview",
    description: "Complete placement round simulation combining technical depth and HR assessment.",
    duration: "~30 minutes",
    icon: "award",
    topics: ["Technical + HR Comprehensive Assessment"],
    badge: "Full Simulation"
  }
];

export const INTERVIEW_QUESTIONS = {
  technical: [
    {
      id: "tq-1",
      topic: "OS & Process Management",
      question: "Explain the difference between a process and a thread. When would you prefer one over the other in software design?"
    },
    {
      id: "tq-2",
      topic: "DBMS & Indexing",
      question: "What is database indexing and how do B+ Trees optimize query execution time? Mention any drawback of over-indexing."
    },
    {
      id: "tq-3",
      topic: "OOP Principles",
      question: "Define Encapsulation and Abstraction. How do they differ in practice when building modular object-oriented software?"
    },
    {
      id: "tq-4",
      topic: "Data Structures & Algorithms",
      question: "Walk me through how a Hash Table handles collisions using Chaining versus Open Addressing (Linear Probing)."
    },
    {
      id: "tq-5",
      topic: "Computer Networks",
      question: "Explain the TCP 3-Way Handshake mechanism. How does TCP guarantee reliability compared to UDP?"
    }
  ],
  hr: [
    {
      id: "hrq-1",
      topic: "Self Introduction",
      question: "Tell me about yourself, your technical background, and what motivated you to pursue a career in software development."
    },
    {
      id: "hrq-2",
      topic: "Conflict Handling & Teamwork",
      question: "Describe a situation where you had a conflict or disagreement with a team member during a project. How did you resolve it?"
    },
    {
      id: "hrq-3",
      topic: "Strengths & Weaknesses",
      question: "What is your biggest professional weakness, and what specific steps are you taking to overcome it?"
    },
    {
      id: "hrq-4",
      topic: "Leadership & Responsibility",
      question: "Can you share an instance where you took initiative or led a difficult project task under tight deadlines?"
    },
    {
      id: "hrq-5",
      topic: "Career Goals & Culture Fit",
      question: "Where do you see yourself in 3 years, and why do you want to join our organization specifically?"
    }
  ],
  full: [
    {
      id: "fq-1",
      topic: "Self Introduction",
      question: "Introduce yourself highlighting your technical skill set, key projects, and career aspirations."
    },
    {
      id: "fq-2",
      topic: "DSA & System Optimization",
      question: "Explain the Time and Space complexity of QuickSort versus MergeSort. Under what conditions would you prefer MergeSort?"
    },
    {
      id: "fq-3",
      topic: "DBMS Transactions",
      question: "What are ACID properties in relational databases? Briefly explain Atomicity and Concurrency Isolation levels."
    },
    {
      id: "fq-4",
      topic: "Behavioral / Problem Solving",
      question: "Tell me about a complex bug or unexpected technical failure you encountered. How did you debug and fix it?"
    },
    {
      id: "fq-5",
      topic: "Team Work & Adaptability",
      question: "How do you handle constructive criticism or feedback from senior engineers when your code requires major refactoring?"
    }
  ]
};

/**
 * AI Feedback Generator
 * Synthesizes mock evaluation report from answers
 */
export const evaluateInterview = ({ mode, role, answers }) => {
  const answeredCount = Object.keys(answers).length;
  const avgAnswerLength = Object.values(answers).reduce((acc, text) => acc + (text?.length || 0), 0) / (answeredCount || 1);

  // Score calculations (simulated realistic bounds 65-92%)
  const lengthBonus = Math.min(Math.floor(avgAnswerLength / 15), 18);
  
  const techScore = Math.min(Math.max(68 + lengthBonus, 65), 94);
  const commScore = Math.min(Math.max(64 + Math.floor(lengthBonus * 1.1), 60), 92);
  const clarityScore = Math.min(Math.max(70 + Math.floor(lengthBonus * 0.9), 65), 90);
  const confScore = Math.min(Math.max(66 + Math.floor(lengthBonus * 0.8), 62), 88);

  const overallScore = Math.round((techScore + commScore + clarityScore + confScore) / 4);

  const strengths = [
    "Good understanding of fundamental computer science concepts",
    "Effective usage of technical terminology and key parameters",
    "Clear explanation of real-world application scenarios",
    "Logical flow and structured approach in verbal formulation"
  ];

  const improvements = [
    "Provide more concrete real-world code snippets or numerical examples",
    "Improve answer conciseness to keep response duration optimal",
    "Use STAR method (Situation, Task, Action, Result) for behavioral questions",
    "Elaborate on edge cases and trade-offs explicitly"
  ];

  const aiFeedback = `Your response profile for the ${role || "Software Engineer"} position shows strong core competence (${overallScore}% overall). Your technical terminology is well-aligned with recruiter expectations. Focus on structuring responses concisely using key trade-offs and practical architecture examples.`;

  return {
    overallScore,
    techScore,
    commScore,
    clarityScore,
    confScore,
    strengths,
    improvements,
    aiFeedback,
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  };
};
