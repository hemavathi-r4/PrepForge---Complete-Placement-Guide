/**
 * Aptitude Question Data Module
 * Covers Quantitative Aptitude, Logical Reasoning, and Verbal Ability
 */

export const APTITUDE_CATEGORIES = [
  {
    id: "quantitative",
    title: "Quantitative Aptitude",
    description: "Master mathematical problem solving, numerical ability, speed math, and data calculation shortcuts.",
    icon: "calculator",
    topicsCount: 9,
    totalQuestions: 120,
    topics: [
      "Percentages",
      "Profit & Loss",
      "Ratio & Proportion",
      "Averages",
      "Time & Work",
      "Time, Speed & Distance",
      "Simple & Compound Interest",
      "Permutation & Combination",
      "Probability"
    ]
  },
  {
    id: "logical",
    title: "Logical Reasoning",
    description: "Develop analytical thinking, pattern recognition, spatial reasoning, and deduction skills.",
    icon: "brain",
    topicsCount: 7,
    totalQuestions: 100,
    topics: [
      "Number Series",
      "Coding-Decoding",
      "Blood Relations",
      "Direction Sense",
      "Syllogisms",
      "Seating Arrangement",
      "Logical Puzzles"
    ]
  },
  {
    id: "verbal",
    title: "Verbal Ability",
    description: "Improve reading comprehension, grammar accuracy, sentence structuring, and vocabulary.",
    icon: "book",
    topicsCount: 5,
    totalQuestions: 80,
    topics: [
      "Reading Comprehension",
      "Sentence Correction",
      "Para Jumbles",
      "Vocabulary",
      "Grammar"
    ]
  }
];

export const APTITUDE_QUESTIONS = [
  // ── Quantitative Aptitude ──────────────────────────────────────
  {
    id: "apt-quant-1",
    category: "quantitative",
    topic: "Time, Speed & Distance",
    question: "A train travels 360 km in 4 hours. What is its average speed?",
    options: [
      "A. 80 km/h",
      "B. 90 km/h",
      "C. 100 km/h",
      "D. 120 km/h"
    ],
    correctAnswer: 1, // B. 90 km/h
    explanation: "Average Speed = Total Distance / Total Time\nAverage Speed = 360 km / 4 hours = 90 km/h.",
    difficulty: "Easy"
  },
  {
    id: "apt-quant-2",
    category: "quantitative",
    topic: "Percentages",
    question: "If the price of sugar increases by 25%, by what percentage must a family reduce its consumption to keep expenditure constant?",
    options: [
      "A. 15%",
      "B. 20%",
      "C. 25%",
      "D. 30%"
    ],
    correctAnswer: 1, // B. 20%
    explanation: "Reduction Percentage = [R / (100 + R)] * 100\n= [25 / 125] * 100 = (1 / 5) * 100 = 20%.",
    difficulty: "Medium"
  },
  {
    id: "apt-quant-3",
    category: "quantitative",
    topic: "Profit & Loss",
    question: "An item purchased for ₹800 is sold for ₹1,000. What is the profit percentage?",
    options: [
      "A. 20%",
      "B. 25%",
      "C. 30%",
      "D. 15%"
    ],
    correctAnswer: 1, // B. 25%
    explanation: "Profit = Selling Price - Cost Price = 1000 - 800 = ₹200.\nProfit % = (Profit / Cost Price) * 100 = (200 / 800) * 100 = 25%.",
    difficulty: "Easy"
  },
  {
    id: "apt-quant-4",
    category: "quantitative",
    topic: "Time & Work",
    question: "A can complete a piece of work in 12 days and B can complete it in 24 days. How long will they take working together?",
    options: [
      "A. 6 days",
      "B. 8 days",
      "C. 10 days",
      "D. 7 days"
    ],
    correctAnswer: 1, // B. 8 days
    explanation: "Combined rate per day = (1/12) + (1/24) = 3/24 = 1/8.\nTotal days required = 8 days.",
    difficulty: "Medium"
  },
  {
    id: "apt-quant-5",
    category: "quantitative",
    topic: "Probability",
    question: "Two fair dice are rolled simultaneously. What is the probability of getting a sum of 7?",
    options: [
      "A. 1/6",
      "B. 1/12",
      "C. 5/36",
      "D. 1/4"
    ],
    correctAnswer: 0, // A. 1/6
    explanation: "Total outcomes = 36. Favorable outcomes for sum = 7 are (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) -> 6 outcomes.\nProbability = 6/36 = 1/6.",
    difficulty: "Medium"
  },

  // ── Logical Reasoning ──────────────────────────────────────────
  {
    id: "apt-logic-1",
    category: "logical",
    topic: "Number Series",
    question: "Find the next number in the series: 3, 7, 15, 31, 63, ?",
    options: [
      "A. 125",
      "B. 127",
      "C. 129",
      "D. 131"
    ],
    correctAnswer: 1, // B. 127
    explanation: "The pattern is (Previous × 2) + 1:\n3×2+1=7, 7×2+1=15, 15×2+1=31, 31×2+1=63, 63×2+1=127.",
    difficulty: "Easy"
  },
  {
    id: "apt-logic-2",
    category: "logical",
    topic: "Coding-Decoding",
    question: "If 'MONKEY' is coded as 'XDJMNL', how is 'TIGER' coded in that system?",
    options: [
      "A. QDFHS",
      "B. SDFHS",
      "C. SHFDQ",
      "D. QDHFS"
    ],
    correctAnswer: 0, // A. QDFHS
    explanation: "Reverse the word and subtract 1 from each letter:\nTIGER reversed is REGIT -> R-1=Q, E-1=D, G-1=F, I-1=H, T-1=S -> QDFHS.",
    difficulty: "Hard"
  },
  {
    id: "apt-logic-3",
    category: "logical",
    topic: "Blood Relations",
    question: "Pointing to a photograph, Rohit said, 'She is the daughter of my grandfather's only son.' How is Rohit related to the girl?",
    options: [
      "A. Cousin",
      "B. Brother",
      "C. Uncle",
      "D. Father"
    ],
    correctAnswer: 1, // B. Brother
    explanation: "Rohit's grandfather's only son is Rohit's father. The daughter of Rohit's father is Rohit's sister. Hence, Rohit is her brother.",
    difficulty: "Medium"
  },

  // ── Verbal Ability ────────────────────────────────────────────
  {
    id: "apt-verb-1",
    category: "verbal",
    topic: "Vocabulary",
    question: "Choose the word that is most nearly SYNONYMOUS to 'EPHEMERAL':",
    options: [
      "A. Permanent",
      "B. Transient",
      "C. Monumental",
      "D. Perpetual"
    ],
    correctAnswer: 1, // B. Transient
    explanation: "'Ephemeral' means lasting for a very short time. 'Transient' shares the exact meaning.",
    difficulty: "Medium"
  },
  {
    id: "apt-verb-2",
    category: "verbal",
    topic: "Grammar",
    question: "Choose the correct sentence:",
    options: [
      "A. Neither of the candidates are qualified.",
      "B. Neither of the candidates is qualified.",
      "C. Neither of the candidate is qualified.",
      "D. Neither of the candidate are qualified."
    ],
    correctAnswer: 1, // B. Neither of the candidates is qualified.
    explanation: "'Neither of' is followed by a plural noun ('candidates') and a singular verb ('is').",
    difficulty: "Easy"
  }
];
