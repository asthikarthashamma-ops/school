import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Bell, Menu, Calendar, Sparkles } from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const { notifications } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  if (!user) return null;

  // Filter notifications relevant to the logged-in user
  const userNotifications = notifications.filter(n => {
    if (n.recipientRole === 'all') return true;
    if (n.recipientRole === user.role) {
      if (n.recipientId) return n.recipientId === user.refId;
      return true;
    }
    return false;
  });

  const unreadCount = userNotifications.length; // Simplified unread state

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400';
      case 'teacher':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400';
      case 'student':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400';
      case 'parent':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/85 px-6 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/85">
      {/* Left controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden text-slate-600 dark:text-slate-400"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Calendar className="h-4 w-4 text-sky-600 dark:text-sky-400" />
          <span className="font-medium">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-6">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-xl p-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-all duration-200"
          >
            <Bell className="h-5.5 w-5.5" />
            {unreadCount > 0 && (
              <span className="absolute right-2 top-2 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900 animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3.5 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden ring-1 ring-black/5 animate-radar-pulse">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 p-4">
                <span className="font-semibold text-slate-800 dark:text-white">Recent Notifications</span>
                <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-semibold text-sky-600 dark:bg-sky-950/40 dark:text-sky-400">
                  {unreadCount} Alerts
                </span>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-50 dark:divide-slate-850">
                {userNotifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-450 text-sm">
                    No active notifications.
                  </div>
                ) : (
                  userNotifications.map((notif) => (
                    <div key={notif.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-850/60 transition-colors duration-150">
                      <div className="flex items-start justify-between">
                        <span className="font-medium text-sm text-slate-800 dark:text-white flex items-center gap-1.5">
                          {notif.type === 'AttendanceAlert' && <Sparkles className="h-3.5 w-3.5 text-sky-600" />}
                          {notif.title}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-650 dark:text-slate-400 leading-relaxed">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="block text-sm font-semibold text-slate-800 dark:text-white">{user.name}</span>
            <span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getRoleBadge(user.role)}`}>
              {user.role}
            </span>
          </div>
          <div className="h-10 w-10 overflow-hidden rounded-xl border border-slate-200 shadow-sm dark:border-slate-700">
            <img
              src={user.photo}
              alt={user.name}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
