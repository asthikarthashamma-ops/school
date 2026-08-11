import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, BookOpen, Award, CheckCircle, Save } from 'lucide-react';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const { teachers, students, subjects, classes, exams, grades, saveMarks, timetables } = useApp();

  // Find active teacher profile
  const teacher = teachers.find(t => t.id === user.refId) || teachers[0];

  // Grade Entry State
  const [selectedClass, setSelectedClass] = useState(classes[0]?.id || '');
  const [selectedExam, setSelectedExam] = useState(exams[0]?.id || '');
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.id || '');

  // Marks inputs
  const [marksState, setMarksState] = useState({});
  const [remarksState, setRemarksState] = useState({});

  const getSubjectName = (subId) => {
    return subjects.find(s => s.id === subId)?.name || 'Subject';
  };

  const getClassName = (clsId) => {
    const c = classes.find(cls => cls.id === clsId);
    return c ? `${c.name}-${c.section}` : 'Class';
  };

  // Timetable schedule for this teacher
  const getTeacherSchedule = () => {
    const list = [];
    timetables.forEach(t => {
      t.periods.forEach(p => {
        if (p.teacherId === teacher.id) {
          list.push({
            day: t.day,
            class: getClassName(t.classId),
            ...p
          });
        }
      });
    });
    return list;
  };

  const teacherSchedule = getTeacherSchedule();

  // Students in selected class
  const classStudents = students.filter(s => s.classId === selectedClass);

  const handleMarkChange = (studId, val) => {
    setMarksState(prev => ({ ...prev, [studId]: val }));
  };

  const handleRemarkChange = (studId, val) => {
    setRemarksState(prev => ({ ...prev, [studId]: val }));
  };

  const handleSaveMarks = (studentId) => {
    const marks = parseFloat(marksState[studentId]);
    const remarks = remarksState[studentId] || 'Satisfactory';
    
    if (isNaN(marks)) {
      alert('Please enter a valid marks value.');
      return;
    }

    saveMarks(studentId, selectedExam, selectedSubject, marks, remarks);
  };

  // Get current entered grade for student
  const getStudentGradeRecord = (studId) => {
    return grades.find(g => g.studentId === studId && g.examId === selectedExam && g.subjectId === selectedSubject);
  };

  return (
    <div className="space-y-6">
      {/* Welcome details */}
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 overflow-hidden rounded-2xl border border-slate-200 shadow-sm dark:border-slate-800">
          <img src={teacher.photo} alt={teacher.name} className="h-full w-full object-cover" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Welcome Back, {teacher.name}</h1>
          <p className="text-sm text-slate-505 dark:text-slate-400">Employee ID: {teacher.employeeId} • Department: {teacher.subjects.join(', ')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Weekly Schedule */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-5">
          <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-sky-655" />
            My Class schedule
          </h3>
          <div className="space-y-3.5 max-h-[380px] overflow-y-auto">
            {teacherSchedule.length === 0 ? (
              <p className="text-sm text-slate-400 py-6 text-center">No class schedules assigned.</p>
            ) : (
              teacherSchedule.map((p, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-850 p-3.5 border border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="block text-sm font-bold text-slate-800 dark:text-white">{getSubjectName(p.subjectId)}</span>
                    <p className="text-[10px] text-slate-450 uppercase font-semibold mt-0.5">{p.day} • {p.class} • Room {p.room}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-655 font-mono">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>{p.startTime} - {p.endTime}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Grades and Marks Entry */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-7">
          <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
            <Award className="h-5 w-5 text-purple-600" />
            Academic marks Entry board
          </h3>

          {/* Configuration selections */}
          <div className="grid grid-cols-3 gap-3 mb-5 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-455 mb-1.5">Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 outline-none dark:border-slate-800 dark:bg-slate-850 dark:text-slate-350"
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}-{c.section}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-455 mb-1.5">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 outline-none dark:border-slate-800 dark:bg-slate-850 dark:text-slate-350"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-455 mb-1.5">Exam Term</label>
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 outline-none dark:border-slate-800 dark:bg-slate-850 dark:text-slate-350"
              >
                {exams.map(ex => (
                  <option key={ex.id} value={ex.id}>{ex.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Student roster grade sheet */}
          <div className="space-y-4 max-h-[350px] overflow-y-auto">
            {classStudents.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No students admitted to this class grade.</p>
            ) : (
              classStudents.map(student => {
                const record = getStudentGradeRecord(student.id);
                return (
                  <div key={student.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 border border-slate-100 dark:border-slate-800/80 rounded-xl bg-slate-50 dark:bg-slate-850/30">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 overflow-hidden rounded-lg">
                        <img src={student.photo} alt={student.name} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-800 dark:text-white">{student.name}</span>
                        <span className="block text-[9px] text-slate-400">Roll Number: {student.rollNumber}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Marks"
                        value={marksState[student.id] !== undefined ? marksState[student.id] : (record ? record.marksObtained : '')}
                        onChange={(e) => handleMarkChange(student.id, e.target.value)}
                        className="w-16 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-center dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="Remarks"
                        value={remarksState[student.id] !== undefined ? remarksState[student.id] : (record ? record.remarks : '')}
                        onChange={(e) => handleRemarkChange(student.id, e.target.value)}
                        className="w-32 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                      />
                      <button
                        onClick={() => handleSaveMarks(student.id)}
                        className="rounded-lg bg-sky-600 p-2 text-white hover:bg-sky-700"
                      >
                        <Save className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {record && (
                      <div className="text-right border-l border-slate-200 dark:border-slate-800 pl-3 hidden sm:block shrink-0">
                        <span className="block text-xs font-bold text-green-500 uppercase">Grade {record.grade}</span>
                        <span className="text-[9px] text-slate-400">Stored</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
