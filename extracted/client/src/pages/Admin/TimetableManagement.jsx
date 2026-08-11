import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Clock, MapPin, BookOpen, User } from 'lucide-react';

const TimetableManagement = () => {
  const { classes, timetables, subjects, teachers } = useApp();

  const [activeClass, setActiveClass] = useState(classes[0]?.id || '');
  const [activeDay, setActiveDay] = useState('Monday');

  const getSubjectName = (subId) => {
    const s = subjects.find(sub => sub.id === subId);
    return s ? s.name : 'Free Period';
  };

  const getTeacherName = (tId) => {
    const t = teachers.find(teach => teach.id === tId);
    return t ? t.name : 'N/A';
  };

  // Find matching timetable for class and day
  const schedule = timetables.find(t => t.classId === activeClass && t.day === activeDay);
  const periods = schedule ? schedule.periods : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Timetable Management</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Establish class hours, subject periods, classroom allocations, and teaching loads</p>
      </div>

      {/* Selectors and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between rounded-2xl bg-white p-4 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-455 mb-2">Class Section</label>
            <select
              value={activeClass}
              onChange={(e) => setActiveClass(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-700 outline-none dark:border-slate-800 dark:bg-slate-850 dark:text-slate-350"
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}-{c.section}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-455 mb-2">Day of Week</label>
            <div className="flex flex-wrap gap-1.5">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    activeDay === day
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-805 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Timetable Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {periods.length === 0 ? (
          <div className="col-span-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center text-slate-450">
            <Calendar className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-750 mb-3" />
            <p className="font-semibold text-sm">No periods scheduled for Grade on {activeDay}</p>
            <p className="text-xs mt-1 text-slate-400">Assign subjects, rooms, and teachers to build weekly schedules.</p>
          </div>
        ) : (
          periods.map(period => (
            <div
              key={period.periodNumber}
              className="rounded-2xl border border-slate-150 dark:border-slate-800 bg-white p-5 shadow-sm dark:bg-slate-900 hover:shadow-md hover:border-sky-300 transition-all duration-200 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 rounded-bl-xl bg-sky-50 dark:bg-sky-950/40 px-3.5 py-1 text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest">
                Period {period.periodNumber}
              </div>

              <div className="mt-2 space-y-4">
                {/* Subject Info */}
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-sky-50 dark:bg-sky-950/20 p-2 text-sky-600 dark:text-sky-400 shrink-0">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-850 dark:text-white text-sm">{getSubjectName(period.subjectId)}</h3>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Subject Core</span>
                  </div>
                </div>

                {/* Teacher Info */}
                <div className="flex items-center gap-3">
                  <User className="h-4.5 w-4.5 text-slate-400" />
                  <span className="text-xs text-slate-650 dark:text-slate-400 font-semibold">
                    {getTeacherName(period.teacherId)}
                  </span>
                </div>

                {/* Time Info */}
                <div className="flex items-center gap-3">
                  <Clock className="h-4.5 w-4.5 text-slate-400" />
                  <span className="text-xs text-slate-650 dark:text-slate-450 font-mono">
                    {period.startTime} AM - {period.endTime} AM
                  </span>
                </div>

                {/* Room Info */}
                <div className="flex items-center gap-3 border-t border-slate-50 dark:border-slate-850 pt-3">
                  <MapPin className="h-4.5 w-4.5 text-slate-400" />
                  <span className="text-xs text-sky-600 dark:text-sky-400 font-bold uppercase tracking-wider">
                    {period.room}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TimetableManagement;
