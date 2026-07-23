/**
 * Mock data representing PrepForge's training modules.
 * This structure will serve the Landing and Dashboard views.
 */
export const PREP_MODULES = [
  {
    id: "dsa-sheet",
    title: "DSA Master Roadmap",
    description: "Master 13 core Data Structures & Algorithms topics with curated problems, optimal code, and GFG links.",
    icon: "code",
    path: "/dsa-sheet",
    difficulty: "Beginner to Advanced",
    topicsCount: 120,
    completedPercentage: 45,
    popular: true
  },
  {
    id: "cs-fundamentals",
    title: "CS Fundamentals (DBMS, CN, OOPs)",
    description: "Revise crucial concepts of DBMS, Computer Networks, OOPs, and System Design with embedded GFG references.",
    icon: "database",
    path: "/cs-fundamentals",
    difficulty: "Core Placement",
    topicsCount: 50,
    completedPercentage: 25,
    popular: true
  },
  {
    id: "company-sheets",
    title: "Company-Wise DSA Sheets",
    description: "Practice questions tagged by top recruiters (Google, Amazon, Microsoft, TCS, Infosys, Meta).",
    icon: "git-branch",
    path: "/company-sheets",
    difficulty: "Targeted Tracks",
    topicsCount: 85,
    completedPercentage: 30,
    popular: true
  },
  {
    id: "sql-sheet",
    title: "SQL Master Sheet",
    description: "Crack SQL interviews with 10 topics covering Joins, Aggregations, CTEs, Window Functions & Normalization.",
    icon: "document",
    path: "/sql-sheet",
    difficulty: "All Levels",
    topicsCount: 40,
    completedPercentage: 60,
    popular: false
  },
  {
    id: "aptitude",
    title: "Aptitude & Reasoning",
    description: "Crack Quantitative Aptitude, Logical Reasoning, and Verbal Ability tests with shortcuts.",
    icon: "trending-up",
    path: "/dsa-sheet",
    difficulty: "All Levels",
    topicsCount: 85,
    completedPercentage: 20,
    popular: false
  },
  {
    id: "mock-interviews",
    title: "AI Mock Interviews",
    description: "Practice real-time behavioral and technical mock interviews with instant feedback.",
    icon: "users",
    path: "/dsa-sheet",
    difficulty: "Realistic simulation",
    topicsCount: 15,
    completedPercentage: 0,
    popular: false
  }
];

export const MOCK_TESTS = [
  {
    id: "test_1",
    title: "TCS Ninja / Digital Mock Assessment",
    duration: "90 mins",
    questionsCount: 45,
    status: "Available"
  },
  {
    id: "test_2",
    title: "Amazon SDE-1 Technical Practice",
    duration: "120 mins",
    questionsCount: 3,
    status: "In Progress"
  },
  {
    id: "test_3",
    title: "Infosys DSE Coding Challenge",
    duration: "180 mins",
    questionsCount: 4,
    status: "Completed"
  }
];
