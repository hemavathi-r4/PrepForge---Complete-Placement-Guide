/**
 * Mock data representing PrepForge's training modules.
 * This structure will serve the Landing and Dashboard views.
 */
export const PREP_MODULES = [
  {
    id: "coding",
    title: "Coding & Algorithms",
    description: "Master Data Structures, Algorithms, and clean code principles with curated tracks.",
    icon: "code",
    difficulty: "Beginner to Advanced",
    topicsCount: 120,
    completedPercentage: 45,
    popular: true
  },
  {
    id: "aptitude",
    title: "Aptitude & Reasoning",
    description: "Crack Quantitative Aptitude, Logical Reasoning, and Verbal Ability tests with shortcuts.",
    icon: "trending-up",
    difficulty: "All Levels",
    topicsCount: 85,
    completedPercentage: 20,
    popular: false
  },
  {
    id: "system-design",
    title: "System Design",
    description: "Learn to design highly scalable, distributed architectures for top-tier product companies.",
    icon: "git-branch",
    difficulty: "Intermediate to Advanced",
    topicsCount: 30,
    completedPercentage: 0,
    popular: true
  },
  {
    id: "dbms-os",
    title: "Core CS Fundamentals",
    description: "Revise crucial concepts of Operating Systems, DBMS/SQL, and Computer Networks.",
    icon: "database",
    difficulty: "Medium",
    topicsCount: 50,
    completedPercentage: 10,
    popular: false
  },
  {
    id: "mock-interviews",
    title: "AI Mock Interviews",
    description: "Practice real-time behavioral and technical mock interviews with instant AI feedback.",
    icon: "users",
    difficulty: "Realistic simulation",
    topicsCount: 15,
    completedPercentage: 0,
    popular: true
  },
  {
    id: "resume-ats",
    title: "ATS Resume Builder",
    description: "Build a resume that beats ATS filters and matches role requirements.",
    icon: "document",
    difficulty: "All Levels",
    topicsCount: 8,
    completedPercentage: 80,
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
