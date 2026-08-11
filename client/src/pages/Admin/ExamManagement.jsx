import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Award, BookOpen, AlertCircle } from 'lucide-react';

const ExamManagement = () => {
  const { exams, classes, subjects } = useApp();

  const [selectedClass, setSelectedClass] = useState(classes[0]?.id || '');

  const getSubjectName = (subId) => {
    const s = subjects.find(sub => sub.id === subId);
    return s ? s.name : 'Unknown';
  };

  const getClassName = (clsId) => {
    const c = classes.find(cls => cls.id === clsId);
    return c ? `${c.name}-${c.section}` : 'N/A';
  };

  // Filter exams by class
  const classExams = exams.filter(e => e.classId === selectedClass);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Examination & Grades Module</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Establish term schedules, define maximum marks/grading policies, and monitor report cards</p>
      </div>

      {/* Class Selector Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between rounded-2xl bg-white p-4 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Class Grade</span>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none dark:border-slate-800 dark:bg-slate-850 dark:text-slate-350"
          >
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}-{c.section}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Exam schedules listings */}
      <div className="space-y-6">
        {classExams.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center text-slate-450">
            <AlertCircle className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-750 mb-3" />
            <p className="font-semibold text-sm">No Active Examination schedules mapped for this Class</p>
          </div>
        ) : (
          classExams.map(exam => (
            <div key={exam.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-extrabold text-slate-855 dark:text-white">{exam.name}</h3>
                  <p className="text-xs text-slate-400">Class: {getClassName(exam.classId)} • Starts: {new Date(exam.startDate).toLocaleDateString()}</p>
                </div>
                <span className="rounded-full bg-purple-50 dark:bg-purple-950/40 px-3 py-1 text-xs font-bold text-purple-600 uppercase">
                  Active Exam
                </span>
              </div>

              {/* Subject schedules list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {exam.schedule.map((sch, idx) => (
                  <div key={idx} className="rounded-2xl border border-slate-100 dark:border-slate-800/80 p-4 bg-slate-50 dark:bg-slate-850/30 flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-sky-50 dark:bg-sky-950/20 p-2 text-sky-600 shrink-0">
                        <BookOpen className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-800 dark:text-white">{getSubjectName(sch.subjectId)}</h4>
                        <div className="flex items-center gap-1 text-[10px] text-slate-405 font-mono mt-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(sch.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="block text-xs font-bold text-slate-700 dark:text-slate-350">Max: {sch.maxMarks}</span>
                      <span className="block text-[10px] font-bold text-red-500 mt-1 uppercase">Pass: {sch.passMarks}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExamManagement;
