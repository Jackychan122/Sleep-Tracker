// Sidebar navigation component

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Moon,
  Dumbbell,
  Smile,
  BarChart3,
  Lightbulb,
  Target,
  FileText,
  Settings,
  X,
  Menu,
} from "lucide-react";

export interface SidebarProps {
  activeView?: string;
  onNavigate?: (view: string) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: typeof Home;
}

const navItems: NavItem[] = [
  { label: "Dashboard", path: "/", icon: Home },
  { label: "Sleep Records", path: "/sleep", icon: Moon },
  { label: "Workout Log", path: "/workout", icon: Dumbbell },
  { label: "Mood & Energy", path: "/mood", icon: Smile },
  { label: "Analytics", path: "/analytics", icon: BarChart3 },
  { label: "Insights", path: "/insights", icon: Lightbulb },
  { label: "Goals", path: "/goals", icon: Target },
  { label: "Reports", path: "/reports", icon: FileText },
  { label: "Settings", path: "/settings", icon: Settings },
];

export function Sidebar({ isOpen = true, onToggle }: SidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onToggle} />}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50 h-full border-r border-gray-200 bg-white
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          flex w-64 flex-col
          lg:static lg:z-auto lg:translate-x-0
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <Link to="/" className="flex items-center gap-2">
            <Moon className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Sleep Tracker</span>
          </Link>
          <button
            onClick={onToggle}
            className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => {
                      // Close sidebar on mobile after navigation
                      if (window.innerWidth < 1024 && onToggle) {
                        onToggle();
                      }
                    }}
                    className={`
                      flex items-center gap-3 rounded-lg px-4 py-3 transition-colors
                      ${
                        isActive
                          ? "bg-blue-50 font-medium text-blue-700"
                          : "text-gray-600 hover:bg-gray-100"
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4">
          <p className="text-center text-xs text-gray-500">© 2024 Sleep Tracker</p>
        </div>
      </aside>
    </>
  );
}

export function MobileHeader({ onToggle }: { onToggle: () => void }) {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white lg:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <Moon className="h-5 w-5 text-blue-600" />
          <span className="text-lg font-bold text-gray-900">Sleep Tracker</span>
        </Link>
        <button
          onClick={onToggle}
          className="rounded-lg p-2 hover:bg-gray-100"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
