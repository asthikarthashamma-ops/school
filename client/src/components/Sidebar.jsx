import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard, Users, GraduationCap, Cpu, CreditCard,
  Calendar, FileSpreadsheet, BarChart3, Bell, Award,
  FileText, CheckSquare, LogOut, Sun, Moon, X, Truck
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useApp();

  if (!user) return null;

  const adminLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/students', label: 'Student Manager', icon: Users },
    { to: '/teachers', label: 'Teacher Manager', icon: GraduationCap },
    { to: '/biometric-simulator', label: 'Biometric Scanner', icon: Cpu },
    { to: '/fees', label: 'Fee Management', icon: CreditCard },
    { to: '/timetable', label: 'Timetable Manager', icon: Calendar },
    { to: '/exams', label: 'Exams & Grades', icon: FileSpreadsheet },
    { to: '/reports', label: 'Reports Centre', icon: BarChart3 },
    { to: '/transport', label: 'Transport Live', icon: Truck },
  ];

  const teacherLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/teacher-marks', label: 'Grades & Entry', icon: Award },
    { to: '/teacher-schedule', label: 'My Timetable', icon: Calendar },
  ];

  const studentLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/student-grades', label: 'My Grades', icon: FileText },
    { to: '/student-timetable', label: 'My Schedule', icon: Calendar },
    { to: '/transport', label: 'Bus Schedule', icon: Truck },
  ];

  const parentLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/parent-fees', label: 'Fees & Payments', icon: CreditCard },
    { to: '/transport', label: 'Track School Bus', icon: Truck },
  ];

  const getLinks = () => {
    switch (user.role) {
      case 'admin': return adminLinks;
      case 'teacher': return teacherLinks;
      case 'student': return studentLinks;
      case 'parent': return parentLinks;
      default: return [];
    }
  };

  const navLinks = getLinks();

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white shadow-lg transition-transform duration-300 dark:border-slate-800 dark:bg-slate-900 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header Branding */}
        <div className="flex h-20 items-center justify-between px-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-600 text-white shadow-md shadow-sky-600/30">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <span className="text-lg font-bold text-slate-800 dark:text-white">AuraAcademy</span>
              <p className="text-[10px] text-sky-600 dark:text-sky-400 font-semibold tracking-wider uppercase">SMS Portal</p>
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            className="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-850 lg:hidden text-slate-500 dark:text-slate-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => {
                  if (window.innerWidth < 1024) toggleSidebar();
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-sky-50 text-sky-600 shadow-sm dark:bg-sky-950/40 dark:text-sky-400'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-850 dark:hover:text-white'
                  }`
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                {link.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Panel (Dark Mode & Logout) */}
        <div className="border-t border-slate-150 p-4 space-y-2 dark:border-slate-800">
          {/* Theme Switcher */}
          <button
            onClick={toggleDarkMode}
            className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-850"
          >
            <div className="flex items-center gap-3">
              {darkMode ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5 text-slate-600" />}
              <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </div>
            <div className="h-2 w-8 rounded-full bg-slate-200 dark:bg-slate-700 relative flex items-center px-0.5">
              <div className={`h-1.5 w-1.5 rounded-full bg-sky-600 dark:bg-sky-400 transition-transform duration-200 ${darkMode ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
          </button>

          {/* Logout */}
          <button
            onClick={logout}
            className="flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout Portal</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
