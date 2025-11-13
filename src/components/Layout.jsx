import { Outlet, Link, useLocation } from "react-router-dom";
import { Users, Plus, Home, Github, Linkedin, Twitter, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";

const Layout = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 transition-colors duration-300">
      {/* Navigation */}
      <nav className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 shadow-lg dark:shadow-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-linear-to-br from-blue-600 to-indigo-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                {/* Logo container */}
                <div className="relative bg-linear-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 p-2.5 rounded-lg group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  TalentHub
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Manage Your Talents
                </span>
              </div>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center space-x-2">
              <Link to="/">
                <Button
                  variant={isActive("/") ? "default" : "ghost"}
                  className={`flex items-center space-x-2 transition-all ${
                    isActive("/")
                      ? "bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 shadow-lg"
                      : "dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                  }`}
                >
                  <Home className="h-4 w-4 text-white" />
                  <span className="hidden sm:inline text-white">Dashboard</span>
                </Button>
              </Link>
              <Link to="/add-talent">
                <Button
                  variant={isActive("/add-talent") ? "default" : "ghost"}
                  className={`flex items-center space-x-2 transition-all ${
                    isActive("/add-talent")
                      ? "bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 shadow-lg"
                      : "dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                  }`}
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Add Talent</span>
                </Button>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 mt-auto transition-colors shadow-lg dark:shadow-slate-900/50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            {/* Brand Section */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="bg-linear-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 p-2 rounded-lg shadow-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  TalentHub
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                A modern talent management system built with cutting-edge technologies to help you organize and track your team efficiently.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/"
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center space-x-2"
                  >
                    <span>→</span>
                    <span>Dashboard</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/add-talent"
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center space-x-2"
                  >
                    <span>→</span>
                    <span>Add New Talent</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Tech Stack */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                Built With
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full border border-blue-200 dark:border-blue-800">
                  React
                </span>
                <span className="px-3 py-1 text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full border border-purple-200 dark:border-purple-800">
                  Redux
                </span>
                <span className="px-3 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full border border-green-200 dark:border-green-800">
                  MongoDB
                </span>
                <span className="px-3 py-1 text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full border border-yellow-200 dark:border-yellow-800">
                  Node.js
                </span>
                <span className="px-3 py-1 text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full border border-indigo-200 dark:border-indigo-800">
                  Express
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              {/* Copyright */}
              <p className="text-slate-600 dark:text-slate-400 text-sm flex items-center space-x-1">
                <span>© 2025 TalentHub. Made with</span>
                <Heart className="h-4 w-4 text-red-500 fill-red-500 animate-pulse" />
                <span>by passionate developers</span>
              </p>

              {/* Social Links */}
              <div className="flex items-center space-x-4">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative"
                  aria-label="GitHub"
                >
                  <div className="absolute inset-0 bg-slate-800 dark:bg-slate-700 rounded-full blur opacity-0 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all transform group-hover:scale-110">
                    <Github className="h-5 w-5 text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200" />
                  </div>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative"
                  aria-label="LinkedIn"
                >
                  <div className="absolute inset-0 bg-blue-600 rounded-full blur opacity-0 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all transform group-hover:scale-110">
                    <Linkedin className="h-5 w-5 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                  </div>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative"
                  aria-label="Twitter"
                >
                  <div className="absolute inset-0 bg-sky-500 rounded-full blur opacity-0 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700 transition-all transform group-hover:scale-110">
                    <Twitter className="h-5 w-5 text-slate-600 dark:text-slate-400 group-hover:text-sky-500 dark:group-hover:text-sky-400" />
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;