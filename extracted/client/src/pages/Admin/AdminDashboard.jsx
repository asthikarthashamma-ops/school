import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users, GraduationCap, Clock, CheckCircle2, AlertTriangle, XCircle, CreditCard, Bell, Activity
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, Cell
} from 'recharts';

const AdminDashboard = () => {
  const { students, teachers, attendance, fees, notifications } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];

  // Dynamic calculations for today's logs
  const todayLogs = attendance.filter(a => a.date === todayStr && a.userType === 'Student');
  const presentCount = todayLogs.filter(a => a.status === 'Present').length;
  const lateCount = todayLogs.filter(a => a.status === 'Late').length;
  const totalCheckedIn = presentCount + lateCount;
  const absentCount = students.length - totalCheckedIn;
  const todayAttendanceRate = students.length ? Math.round((totalCheckedIn / students.length) * 100) : 0;

  // Fee collection stats
  const totalFees = fees.reduce((sum, f) => sum + f.amount, 0);
  const collectedFees = fees.filter(f => f.status === 'Paid').reduce((sum, f) => sum + f.amount, 0);
  const pendingFees = totalFees - collectedFees;

  // Compile monthly attendance dataset (past 7 days)
  const getWeeklyAttendanceData = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayOfWeek = d.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) continue; // skip weekends
      dates.push(d.toISOString().split('T')[0]);
    }

    return dates.map(dStr => {
      const daily = attendance.filter(a => a.date === dStr && a.userType === 'Student');
      const present = daily.filter(a => a.status === 'Present').length;
      const late = daily.filter(a => a.status === 'Late').length;
      const total = present + late;
      const rate = students.length ? Math.round((total / students.length) * 100) : 0;

      return {
        date: new Date(dStr).toLocaleDateString('en-US', { weekday: 'short' }),
        'Attendance Rate %': rate,
        Present: present,
        Late: late
      };
    });
  };

  const attendanceData = getWeeklyAttendanceData();

  // Compile fee dataset
  const feeData = [
    { name: 'Paid Collections', Amount: collectedFees, color: '#10b981' },
    { name: 'Outstanding', Amount: pendingFees, color: '#f59e0b' }
  ];

  // Get live biometric stream
  const liveBiometricStream = [...attendance]
    .filter(a => a.biometricVerified === true)
    .sort((a, b) => new Date(b.checkIn) - new Date(a.checkIn))
    .slice(0, 5);

  const getProfileName = (id, type) => {
    if (type === 'Student') {
      const s = students.find(stud => stud.id === id);
      return s ? s.name : 'Unknown Student';
    } else {
      const t = teachers.find(teach => teach.id === id);
      return t ? t.name : 'Unknown Teacher';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Heading */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Admin Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">School operations, biometric attendance, and financial overview</p>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Total Students */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Students</span>
            <h3 className="mt-1 text-2xl font-bold text-slate-800 dark:text-white">{students.length}</h3>
          </div>
          <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
            <Users className="h-6 w-6" />
          </div>
        </div>

        {/* Total Teachers */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Teachers</span>
            <h3 className="mt-1 text-2xl font-bold text-slate-800 dark:text-white">{teachers.length}</h3>
          </div>
          <div className="rounded-xl bg-purple-50 p-3 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
            <GraduationCap className="h-6 w-6" />
          </div>
        </div>

        {/* Today's Attendance Rate */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Today's Attendance</span>
            <h3 className="mt-1 text-2xl font-bold text-slate-800 dark:text-white">{todayAttendanceRate}%</h3>
          </div>
          <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
            <Activity className="h-6 w-6" />
          </div>
        </div>

        {/* Total Collections */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Fees Collected</span>
            <h3 className="mt-1 text-2xl font-bold text-slate-800 dark:text-white">${collectedFees}</h3>
          </div>
          <div className="rounded-xl bg-amber-50 p-3 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
            <CreditCard className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Attendance Stats Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl bg-sky-50 dark:bg-slate-850 p-4 text-center">
          <CheckCircle2 className="mx-auto h-5 w-5 text-sky-600 dark:text-sky-400" />
          <span className="mt-2 block text-xs font-medium text-slate-500 dark:text-slate-400">Present</span>
          <span className="text-lg font-bold text-slate-800 dark:text-white">{presentCount}</span>
        </div>
        <div className="rounded-xl bg-amber-50 dark:bg-slate-850 p-4 text-center">
          <Clock className="mx-auto h-5 w-5 text-amber-600 dark:text-amber-400" />
          <span className="mt-2 block text-xs font-medium text-slate-500 dark:text-slate-400">Late Arrivals</span>
          <span className="text-lg font-bold text-slate-800 dark:text-white">{lateCount}</span>
        </div>
        <div className="rounded-xl bg-red-50 dark:bg-slate-850 p-4 text-center">
          <XCircle className="mx-auto h-5 w-5 text-red-600 dark:text-red-400" />
          <span className="mt-2 block text-xs font-medium text-slate-500 dark:text-slate-400">Absent</span>
          <span className="text-lg font-bold text-slate-800 dark:text-white">{absentCount}</span>
        </div>
        <div className="rounded-xl bg-purple-50 dark:bg-slate-850 p-4 text-center">
          <Activity className="mx-auto h-5 w-5 text-purple-600 dark:text-purple-400" />
          <span className="mt-2 block text-xs font-medium text-slate-500 dark:text-slate-400">Total Scans</span>
          <span className="text-lg font-bold text-slate-800 dark:text-white">{todayLogs.length}</span>
        </div>
      </div>

      {/* Graphs / Analytics Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Attendance Area Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-8">
          <h3 className="text-base font-bold text-slate-800 dark:text-white">Attendance Analytics</h3>
          <p className="text-xs text-slate-550 dark:text-slate-400 mb-4">Daily student presence percentage rate</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="Attendance Rate %" stroke="#0ea5e9" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRate)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fees Collections Bar Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-4">
          <h3 className="text-base font-bold text-slate-800 dark:text-white">Fee Status</h3>
          <p className="text-xs text-slate-550 dark:text-slate-400 mb-4">Total collections vs pending bills</p>
          <div className="h-64 w-full flex flex-col justify-between">
            <ResponsiveContainer width="100%" height="80%">
              <BarChart data={feeData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip formatter={(value) => `$${value}`} />
                <Bar dataKey="Amount" radius={[10, 10, 0, 0]}>
                  {feeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-around text-xs mt-2 border-t border-slate-100 dark:border-slate-800 pt-3">
              <div className="text-center">
                <span className="block text-slate-400">Total Invoiced</span>
                <span className="font-bold text-slate-800 dark:text-white">${totalFees}</span>
              </div>
              <div className="text-center">
                <span className="block text-slate-400">Collected</span>
                <span className="font-bold text-green-500">${collectedFees}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Row: Biometric Streams and Notifications */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        
        {/* Live Biometric Scanner Activity */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between mb-4 border-b border-slate-50 dark:border-slate-850 pb-3">
            <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-sky-600 animate-pulse" />
              Live Biometric Feed
            </h3>
            <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 text-[10px] font-bold text-green-600 uppercase">Simulated</span>
          </div>
          <div className="space-y-4">
            {liveBiometricStream.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm">
                No biometric events logged today.
              </div>
            ) : (
              liveBiometricStream.map((log) => (
                <div key={log.id} className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-850 p-3.5 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-sky-100 p-2 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400 font-mono text-[10px] uppercase font-bold shrink-0">
                      {log.method}
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-slate-800 dark:text-white">
                        {getProfileName(log.userId, log.userType)}
                      </span>
                      <p className="text-[10px] text-slate-450 uppercase font-bold tracking-wider">{log.userType} • Checked {log.checkOut ? 'Out' : 'In'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-350">
                      {new Date(log.checkOut || log.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className={`block text-[9px] font-extrabold uppercase mt-1 ${
                      log.status === 'Late' ? 'text-amber-500' : 'text-green-500'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* School Announcements */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between mb-4 border-b border-slate-50 dark:border-slate-850 pb-3">
            <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Bell className="h-5 w-5 text-purple-600" />
              Recent Announcements
            </h3>
          </div>
          <div className="space-y-4">
            {notifications.slice(0, 3).map((notif) => (
              <div key={notif.id} className="p-3.5 rounded-xl border border-purple-100 dark:border-purple-950/40 bg-purple-50/20 dark:bg-purple-950/5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-800 dark:text-white">{notif.title}</span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(notif.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{notif.message}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
