import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion";

const MainLayout = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-gray-900 selection:bg-indigo-500 selection:text-white">
      {/* Navigation bar */}
      <Navbar />

      {/* Main page content area with route transitions */}
      <main className="flex-grow flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="flex-grow flex flex-col"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
