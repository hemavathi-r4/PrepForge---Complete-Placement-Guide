import React from "react";
import { Link } from "react-router-dom";
import { FaGraduationCap, FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand section */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 text-indigo-600">
              <FaGraduationCap className="h-7 w-7" />
              <span className="text-lg font-bold tracking-tight text-gray-900">
                Prep<span className="text-indigo-600">Forge</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              Empowering students to crack placement interviews and forge successful careers through custom learning paths.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                <FaLinkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                <FaTwitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                <FaGithub className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Features</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <span className="text-sm text-gray-500 hover:text-indigo-600 cursor-not-allowed">Coding Tests</span>
              </li>
              <li>
                <span className="text-sm text-gray-500 hover:text-indigo-600 cursor-not-allowed">Aptitude Practice</span>
              </li>
              <li>
                <span className="text-sm text-gray-500 hover:text-indigo-600 cursor-not-allowed">Mock Interviews</span>
              </li>
              <li>
                <span className="text-sm text-gray-500 hover:text-indigo-600 cursor-not-allowed">Resume Builder</span>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <span className="text-sm text-gray-500 hover:text-indigo-600 cursor-not-allowed">About Us</span>
              </li>
              <li>
                <span className="text-sm text-gray-500 hover:text-indigo-600 cursor-not-allowed">Careers</span>
              </li>
              <li>
                <span className="text-sm text-gray-500 hover:text-indigo-600 cursor-not-allowed">Contact Support</span>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <span className="text-sm text-gray-500 hover:text-indigo-600 cursor-not-allowed">Privacy Policy</span>
              </li>
              <li>
                <span className="text-sm text-gray-500 hover:text-indigo-600 cursor-not-allowed">Terms of Service</span>
              </li>
              <li>
                <span className="text-sm text-gray-500 hover:text-indigo-600 cursor-not-allowed">Cookie Policy</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            &copy; {currentYear} PrepForge. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 mt-2 md:mt-0">
            Made with ❤️ for students worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
