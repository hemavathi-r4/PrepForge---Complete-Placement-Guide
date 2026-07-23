import React from "react";
import { Link } from "react-router-dom";
import { PREP_MODULES } from "../data/mockQuestions";
import { useAuth } from "../context/AuthContext";
import { 
  FaCode, 
  FaChartLine, 
  FaNetworkWired, 
  FaDatabase, 
  FaUsers, 
  FaFileAlt,
  FaArrowRight,
  FaCheckCircle
} from "react-icons/fa";
import { motion } from "framer-motion";

// Helper to resolve icon key to react-icon component
const getIcon = (iconName) => {
  switch (iconName) {
    case "code": return <FaCode className="h-6 w-6 text-indigo-650" />;
    case "trending-up": return <FaChartLine className="h-6 w-6 text-indigo-650" />;
    case "git-branch": return <FaNetworkWired className="h-6 w-6 text-indigo-650" />;
    case "database": return <FaDatabase className="h-6 w-6 text-indigo-650" />;
    case "users": return <FaUsers className="h-6 w-6 text-indigo-650" />;
    case "document": return <FaFileAlt className="h-6 w-6 text-indigo-650" />;
    default: return <FaCode className="h-6 w-6 text-indigo-650" />;
  }
};

const LandingPage = () => {
  const { user } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 lg:pt-28 lg:pb-32 bg-gradient-to-b from-indigo-50/40 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column Text */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full text-xs font-semibold text-indigo-700"
              >
                <span>🔥 Your Complete Placement Ecosystem</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-none"
              >
                Forge Your Path to <br className="hidden sm:inline" />
                <span className="text-indigo-600">Dream Companies</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-base sm:text-lg text-gray-500 max-w-xl mx-auto lg:mx-0 leading-relaxed"
              >
                PrepForge helps you master coding assessments, polish core Computer Science topics, practice aptitude, and ace interviews with structured learning paths.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              >
                <Link
                  to={user ? "/dashboard" : "/signup"}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3.5 border border-transparent text-base font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <span>{user ? "Go to Dashboard" : "Start Preparing Free"}</span>
                  <FaArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#modules"
                  className="w-full sm:w-auto flex items-center justify-center px-8 py-3.5 border border-gray-200 text-base font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                >
                  Explore Curriculum
                </a>
              </motion.div>

              {/* Stats Highlights */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100 max-w-md mx-auto lg:mx-0"
              >
                <div>
                  <h4 className="text-2xl font-bold text-gray-900">50K+</h4>
                  <p className="text-xs text-gray-500 font-medium">Active Students</p>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-900">95%</h4>
                  <p className="text-xs text-gray-500 font-medium">Placement Rate</p>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-900">180+</h4>
                  <p className="text-xs text-gray-500 font-medium">Hiring Partners</p>
                </div>
              </motion.div>
            </div>

            {/* Right Column Visual Mockup */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5 hidden lg:block"
            >
              <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl shadow-xl relative">
                {/* Floating card 1 */}
                <div className="absolute -top-6 -left-6 bg-white p-4 rounded-xl shadow-md border border-gray-50 flex items-center space-x-3">
                  <span className="p-2 bg-green-50 rounded-lg text-green-600"><FaCheckCircle className="h-5 w-5" /></span>
                  <div>
                    <h5 className="text-xs font-bold text-gray-900">Coding Test Passed</h5>
                    <p className="text-[10px] text-gray-400">Google SDE-1 Assessment</p>
                  </div>
                </div>
                
                {/* Mock Card Content */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-250">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Upcoming Mock Test</span>
                    <span className="px-2 py-0.5 bg-indigo-50 text-[10px] font-bold text-indigo-700 rounded">Live</span>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">Meta Product Engineer Assessment</h4>
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-indigo-650 rounded-full" />
                  </div>
                  <div className="flex justify-between text-xs font-medium text-gray-500">
                    <span>Progress: 66% Completed</span>
                    <span>45 mins left</span>
                  </div>

                  <div className="bg-white border border-gray-100 p-4 rounded-xl space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-gray-700">Q1. Dynamic Programming</span>
                      <span className="text-indigo-600 font-bold">Hard</span>
                    </div>
                    <div className="p-2.5 bg-gray-50 rounded font-mono text-[10px] text-gray-600">
                      <code>{`def maxProductSubarray(nums):
    res = max(nums)
    curMin, curMax = 1, 1
    ...`}</code>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Modules/Curriculum Section */}
      <section id="modules" className="py-20 bg-slate-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Curated Preparation Modules
            </h2>
            <p className="text-base sm:text-lg text-gray-500 leading-relaxed">
              Every topic is structured precisely to help you build foundation skills, practice mock assessments, and verify your learnings.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {PREP_MODULES.map((module) => (
              <motion.div
                key={module.id}
                variants={itemVariants}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                      {getIcon(module.icon)}
                    </div>
                    {module.popular && (
                      <span className="px-2.5 py-1 bg-amber-50 text-[10px] font-bold text-amber-700 border border-amber-100 rounded-full uppercase tracking-wider">
                        Popular
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-gray-900">{module.title}</h3>
                    <p className="text-xs text-indigo-600 font-semibold uppercase">{module.difficulty}</p>
                  </div>
                  
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {module.description}
                  </p>
                </div>
                
                <div className="pt-6 mt-6 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
                  <span className="font-semibold">{module.topicsCount} lessons</span>
                  <Link 
                    to={module.path || "/dsa-sheet"}
                    className="flex items-center space-x-1 text-indigo-600 font-bold hover:text-indigo-700 transition-colors"
                  >
                    <span>Start learning</span>
                    <FaArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* CTA section */}
      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-indigo-600 rounded-3xl p-8 sm:p-12 shadow-lg text-center space-y-6 relative overflow-hidden">
            {/* Background design accents */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-indigo-900 to-indigo-950 pointer-events-none" />
            
            <h2 className="text-3xl font-extrabold text-white tracking-tight relative z-10">
              Ready to land your dream offer?
            </h2>
            <p className="text-indigo-100 max-w-lg mx-auto text-sm sm:text-base relative z-10">
              Get access to curated questions, complete company sheets, Mock assessment metrics, and a lot more.
            </p>
            <div className="pt-4 relative z-10">
              <Link
                to={user ? "/dashboard" : "/signup"}
                className="inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-semibold rounded-xl text-indigo-700 bg-white hover:bg-indigo-50 shadow-md hover:shadow-lg transition-all duration-200"
              >
                <span>Get Started Now</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
