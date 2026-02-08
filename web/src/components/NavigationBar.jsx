import { useState } from "react";
import { NavLink } from "react-router-dom";
import { MessageSquare, Users, FolderRoot, HelpCircle, Gamepad2, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NavigationBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navItems = [
    { to: "/users", label: "Users", icon: Users },
    { to: "/groups", label: "Groups", icon: FolderRoot },
    { to: "/questions", label: "Questions", icon: HelpCircle },
    { to: "/games", label: "Games", icon: Gamepad2 },
  ];

  return (
    <nav className="glass-nav">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <NavLink
          to="/"
          className="flex items-center gap-2 text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-secondary"
        >
          <MessageSquare className="w-8 h-8 text-accent-primary" />
          DeepTalk.
        </NavLink>

        <div className="hidden lg:flex items-center gap-8">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `
                flex items-center gap-2 text-sm font-semibold transition-all duration-300
                ${isActive
                  ? "text-accent-primary"
                  : "text-slate-400 hover:text-slate-100"}
              `}
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-slate-900/95 backdrop-blur-xl border-t border-white/10 overflow-hidden"
          >
            <div className="container mx-auto px-6 py-6 space-y-4">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => `
                    flex items-center gap-4 p-4 rounded-xl transition-all
                    ${isActive
                      ? "bg-accent-primary/10 text-accent-primary font-bold"
                      : "text-slate-400 hover:bg-white/5 hover:text-white font-medium"}
                  `}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-lg">{label}</span>
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default NavigationBar;
