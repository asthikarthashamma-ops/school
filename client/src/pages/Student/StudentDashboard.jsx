import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, Award, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { students, classes, subjects, grades, timetables, attendance, notifications } = useApp();

  // Find corresponding student profile
  const student = students.find(s => s.id === user.refId) || students[0];

  const getClassName = (clsId) => {
    const c = classes.find(cls => cls.id === clsId);
    return c ? `${c.name}-${student.section}` : 'N/A';
  };

  const getSubjectName = (subId) => {
    return subjects.find(s => s.id === subId)?.name || 'Subject';
  };

  // Compile student's specific grades
  const studentGrades = grades.filter(g => g.studentId === student.id);

  // Compile student's attendance stats
  const studentAttendance = attendance.filter(a => a.userId === student.id && a.userType === 'Student');
  const presentDays = studentAttendance.filter(a => a.status === 'Present').length;
  const lateDays = studentAttendance.filter(a => a.status === 'Late').length;
  const totalDays = studentAttendance.length;
  const attendanceRate = totalDays ? Math.round(((presentDays + lateDays) / totalDays) * 100) : 100;

  // Retrieve today's checkin log
  const todayStr = new Date().toISOString().split('T')[0];
  const todayRecord = studentAttendance.find(a => a.date === todayStr);

  // Retrieve student's timetable schedule
  const studentSchedule = timetables.find(t => t.classId === student.classId && t.day === 'Monday')?.periods || [];

  return (
    <div className="space-y-6">
      {/* Welcome & Profile */}
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 overflow-hidden rounded-2xl border border-slate-200 shadow-sm dark:border-slate-800">
          <img src={student.photo} alt={student.name} className="h-full w-full object-cover" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Hello, {student.name}</h1>
          <p className="text-sm text-slate-505 dark:text-slate-400">Class Grade: {getClassName(student.classId)} • Roll Number: {student.rollNumber}</p>
        </div>
      </div>

      {/* Attendance & Todays Log Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Attendance Rate */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Attendance Percentage</span>
            <h3 className={`mt-1 text-2xl font-bold ${attendanceRate >= 85 ? 'text-green-500' : 'text-red-500'}`}>{attendanceRate}%</h3>
            <p className="text-[10px] text-slate-400 mt-1">Present: {presentDays} • Late: {lateDays} • Logged: {totalDays} days</p>
          </div>
          <div className="rounded-xl bg-blue-50 dark:bg-sky-950/20 p-3 text-blue-600">
            <CheckCircle className="h-6 w-6" />
          </div>
        </div>

        {/* Today's Log */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Today's Attendance</span>
            <h3 className="mt-1 text-base font-bold text-slate-800 dark:text-white">
              {todayRecord ? (
                <span>Checked In: {new Date(todayRecord.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              ) : (
                <span className="text-slate-400">Not Logged Yet</span>
              )}
            </h3>
            <p className="text-[10px] text-slate-405 mt-1">Verification method: {todayRecord?.method || 'None'}</p>
          </div>
          <div className={`rounded-xl p-3 ${todayRecord ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-650'}`}>
            <Clock className="h-6 w-6" />
          </div>
        </div>

        {/* Timetable Indicator */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Daily Period Load</span>
            <h3 className="mt-1 text-2xl font-bold text-slate-800 dark:text-white">{studentSchedule.length} Periods</h3>
            <p className="text-[10px] text-slate-400 mt-1">Classes mapped for today</p>
          </div>
          <div className="rounded-xl bg-purple-50 dark:bg-purple-950/20 p-3 text-purple-600">
            <BookOpen className="h-6 w-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Report Card Grades */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-7">
          <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
            <Award className="h-5 w-5 text-purple-650" />
            Academic Report card
          </h3>
          <div className="space-y-3.5">
            {studentGrades.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No grades published for this student.</p>
            ) : (
              studentGrades.map((g, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-850/40">
                  <div>
                    <span className="text-sm font-bold text-slate-800 dark:text-white">{getSubjectName(g.subjectId)}</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Remarks: {g.remarks}</p>
                  </div>
                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <span className="text-sm font-bold text-slate-800 dark:text-white">{g.marksObtained}/100</span>
                      <span className="block text-[10px] text-slate-400">Score</span>
                    </div>
                    <div className="rounded-lg bg-sky-50 dark:bg-sky-950/30 px-3 py-1 font-bold text-sky-600 dark:text-sky-400 text-xs">
                      {g.grade}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Timetable Schedule */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-5">
          <h3 className="text-base font-bold text-slate-855 dark:text-white flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-sky-655" />
            Class Timetable Schedule
          </h3>
          <div className="space-y-3">
            {studentSchedule.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No classes mapped for Monday.</p>
            ) : (
              studentSchedule.map((p, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-850 p-3 border border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-white">{getSubjectName(p.subjectId)}</span>
                    <p className="text-[9px] text-slate-405 mt-0.5">Room {p.room} • Period {p.periodNumber}</p>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-500">
                    {p.startTime} - {p.endTime}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
