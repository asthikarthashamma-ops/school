import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Shield, User, Users, HelpCircle, Lock, Mail, ArrowLeft, RefreshCw } from 'lucide-react';

const Login = () => {
  const { login, requestPasswordReset } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('admin'); // admin, teacher, student, parent
  const [username, setUsername] = useState('admin@school.com');
  const [password, setPassword] = useState('admin123');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Password reset workflow
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetUsername, setResetUsername] = useState('');

  const handleTabChange = (role) => {
    setActiveTab(role);
    setErrorMessage('');
    setSuccessMessage('');
    // Prefill credentials for ease of demo evaluation
    if (role === 'admin') {
      setUsername('admin@school.com');
      setPassword('admin123');
    } else if (role === 'teacher') {
      setUsername('teacher@school.com');
      setPassword('teacher123');
    } else if (role === 'student') {
      setUsername('student@school.com');
      setPassword('student123');
    } else if (role === 'parent') {
      setUsername('parent@school.com');
      setPassword('parent123');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    
    // Slight simulated network lag for premium feels
    setTimeout(async () => {
      const res = await login(username, password, activeTab);
      setIsLoading(false);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setErrorMessage(res.message || 'Authentication failed. Please verify credentials.');
      }
    }, 800);
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      const msg = requestPasswordReset(resetUsername, resetEmail);
      setSuccessMessage(msg);
      setShowForgot(false);
      setResetEmail('');
      setResetUsername('');
    }, 1000);
  };

  const tabs = [
    { id: 'admin', label: 'Admin', icon: Shield, color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 ring-purple-100 dark:ring-purple-950' },
    { id: 'teacher', label: 'Teacher', icon: GraduationCap, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 ring-emerald-100 dark:ring-emerald-950' },
    { id: 'student', label: 'Student', icon: User, color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 ring-blue-100 dark:ring-blue-950' },
    { id: 'parent', label: 'Parent', icon: Users, color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 ring-amber-100 dark:ring-amber-950' }
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-sky-100 dark:from-slate-950 dark:to-slate-900 p-4 font-sans">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900 transition-all duration-300">
        
        {/* Logo and Headings */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-lg shadow-sky-600/30">
            <GraduationCap className="h-9 w-9" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-slate-800 dark:text-white">AuraAcademy</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {showForgot ? 'Reset your portal password' : 'Select role and log in to your dashboard'}
          </p>
        </div>

        {successMessage && (
          <div className="mt-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-150 p-4 text-sm text-emerald-700 dark:text-emerald-400">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mt-6 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-150 p-4 text-sm text-red-700 dark:text-red-400">
            {errorMessage}
          </div>
        )}

        {!showForgot ? (
          <>
            {/* Role Tab Switcher */}
            <div className="mt-8 grid grid-cols-4 gap-2.5">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex flex-col items-center gap-2 rounded-2xl py-3.5 text-xs font-semibold transition-all duration-200 border ${
                      isSelected
                        ? `border-sky-500 dark:border-sky-400 bg-sky-50/50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-400 ring-2 ring-sky-100 dark:ring-sky-950`
                        : 'border-slate-100 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-850'
                    }`}
                  >
                    <div className={`rounded-xl p-2 shrink-0 ${isSelected ? tab.color : 'bg-slate-100 text-slate-505 dark:bg-slate-800 dark:text-slate-400'}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400">
                  Email Address
                </label>
                <div className="relative mt-2">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                    <Mail className="h-5 w-5" />
                  </span>
                  <input
                    type="email"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm text-slate-800 outline-none transition-all focus:border-sky-500 dark:border-slate-800 dark:bg-slate-850 dark:text-white dark:focus:border-sky-500"
                    placeholder="name@school.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage('');
                      setSuccessMessage('');
                      setShowForgot(true);
                    }}
                    className="text-xs font-bold text-sky-600 hover:underline dark:text-sky-400"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative mt-2">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                    <Lock className="h-5 w-5" />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm text-slate-800 outline-none transition-all focus:border-sky-500 dark:border-slate-800 dark:bg-slate-850 dark:text-white dark:focus:border-sky-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-600 py-3.5 text-sm font-semibold text-white shadow-md shadow-sky-600/20 transition-all hover:bg-sky-700 active:scale-98 disabled:opacity-50 dark:bg-sky-600 dark:hover:bg-sky-500"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Access Dashboard</span>
                )}
              </button>
            </form>
          </>
        ) : (
          /* Forgot Password Interface */
          <form onSubmit={handleResetSubmit} className="mt-8 space-y-5 animate-radar-pulse">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400">
                Portal Username / ID
              </label>
              <div className="relative mt-2">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                  <User className="h-5 w-5" />
                </span>
                <input
                  type="text"
                  required
                  value={resetUsername}
                  onChange={(e) => setResetUsername(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm text-slate-800 outline-none transition-all focus:border-sky-500 dark:border-slate-800 dark:bg-slate-850 dark:text-white"
                  placeholder="e.g. admin@school.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400">
                Registered Recovery Email
              </label>
              <div className="relative mt-2">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                  <Mail className="h-5 w-5" />
                </span>
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm text-slate-800 outline-none transition-all focus:border-sky-500 dark:border-slate-800 dark:bg-slate-850 dark:text-white"
                  placeholder="email@recovery.com"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowForgot(false)}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 py-3.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-450 dark:hover:bg-slate-850"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-sky-600 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-sky-700 disabled:opacity-50"
              >
                {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Send Reset Link'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
