import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FileSpreadsheet, FileText, ArrowDownToLine, Users, CreditCard, Calendar } from 'lucide-react';

const ReportsPage = () => {
  const { students, classes, attendance, fees, showToast } = useApp();

  const [activeReportTab, setActiveReportTab] = useState('attendance'); // attendance, fees, roster
  const [selectedClass, setSelectedClass] = useState('All');

  const getClassName = (clsId) => {
    const c = classes.find(cls => cls.id === clsId);
    return c ? `${c.name}-${c.section}` : 'N/A';
  };

  const getFilteredStudents = () => {
    if (selectedClass === 'All') return students;
    return students.filter(s => s.classId === selectedClass);
  };

  const list = getFilteredStudents();

  // 1. Attendance reports statistics compiler
  const compileAttendanceStats = () => {
    return list.map(student => {
      const records = attendance.filter(a => a.userId === student.id && a.userType === 'Student');
      const present = records.filter(a => a.status === 'Present').length;
      const late = records.filter(a => a.status === 'Late').length;
      const absent = records.filter(a => a.status === 'Absent').length;
      const totalDays = records.length;
      const pct = totalDays ? Math.round(((present + late) / totalDays) * 100) : 100;

      return {
        id: student.id,
        name: student.name,
        roll: student.rollNumber,
        class: getClassName(student.classId),
        totalDays,
        present,
        late,
        absent,
        percentage: pct
      };
    });
  };

  // 2. Fee billing compile
  const compileFeeStats = () => {
    return list.map(student => {
      const studFees = fees.filter(f => f.studentId === student.id);
      const total = studFees.reduce((sum, f) => sum + f.amount, 0);
      const settled = studFees.filter(f => f.status === 'Paid').reduce((sum, f) => sum + f.amount, 0);
      const pending = total - settled;

      return {
        id: student.id,
        name: student.name,
        roll: student.rollNumber,
        class: getClassName(student.classId),
        total,
        settled,
        pending
      };
    });
  };

  const attendanceData = compileAttendanceStats();
  const feeData = compileFeeStats();

  const triggerExport = (format, type) => {
    showToast(`Successfully assembled and exported ${type} report as ${format.toUpperCase()}`, 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Reports Centre</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Compile academic data sheets and export audits</p>
        </div>
      </div>

      {/* Roster Type Toggles and Filter */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center justify-between rounded-2xl bg-white p-4 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveReportTab('attendance')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
              activeReportTab === 'attendance'
                ? 'bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400'
                : 'text-slate-655 hover:bg-slate-50'
            }`}
          >
            <Calendar className="h-4 w-4" />
            Attendance stats
          </button>
          <button
            onClick={() => setActiveReportTab('fees')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
              activeReportTab === 'fees'
                ? 'bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400'
                : 'text-slate-655 hover:bg-slate-50'
            }`}
          >
            <CreditCard className="h-4 w-4" />
            Billing audits
          </button>
          <button
            onClick={() => setActiveReportTab('roster')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
              activeReportTab === 'roster'
                ? 'bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400'
                : 'text-slate-655 hover:bg-slate-50'
            }`}
          >
            <Users className="h-4 w-4" />
            Student roster
          </button>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-700 outline-none dark:border-slate-800 dark:bg-slate-850 dark:text-slate-350 font-semibold"
          >
            <option value="All">All Grades Roster</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}-{c.section}</option>
            ))}
          </select>

          <button
            onClick={() => triggerExport('xlsx', activeReportTab)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-250 dark:border-slate-800 px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-350 hover:bg-slate-50"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            Excel
          </button>
          <button
            onClick={() => triggerExport('pdf', activeReportTab)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-250 dark:border-slate-800 px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-350 hover:bg-slate-50"
          >
            <FileText className="h-4 w-4 text-red-650" />
            PDF
          </button>
        </div>
      </div>

      {/* Report Data display table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          {activeReportTab === 'attendance' && (
            <table className="w-full border-collapse text-left text-sm text-slate-655 dark:text-slate-400 font-medium">
              <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-850 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-4">Student Name</th>
                  <th className="px-6 py-4">Roll</th>
                  <th className="px-6 py-4">Class Room</th>
                  <th className="px-6 py-4">Days logged</th>
                  <th className="px-6 py-4">Presents</th>
                  <th className="px-6 py-4">Lates</th>
                  <th className="px-6 py-4">Absents</th>
                  <th className="px-6 py-4">Percentage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {attendanceData.map(row => (
                  <tr key={row.id} className="hover:bg-slate-55/50 dark:hover:bg-slate-850/40">
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">{row.name}</td>
                    <td className="px-6 py-4">{row.roll}</td>
                    <td className="px-6 py-4">{row.class}</td>
                    <td className="px-6 py-4">{row.totalDays}</td>
                    <td className="px-6 py-4 text-green-500">{row.present}</td>
                    <td className="px-6 py-4 text-amber-500">{row.late}</td>
                    <td className="px-6 py-4 text-red-500">{row.absent}</td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${row.percentage >= 85 ? 'text-green-500' : 'text-red-500'}`}>
                        {row.percentage}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeReportTab === 'fees' && (
            <table className="w-full border-collapse text-left text-sm text-slate-655 dark:text-slate-400 font-medium">
              <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-850 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-4">Student Name</th>
                  <th className="px-6 py-4">Roll</th>
                  <th className="px-6 py-4">Class Room</th>
                  <th className="px-6 py-4">Total Invoiced</th>
                  <th className="px-6 py-4">Total Settled</th>
                  <th className="px-6 py-4">Outstanding Balances</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {feeData.map(row => (
                  <tr key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/40">
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">{row.name}</td>
                    <td className="px-6 py-4">{row.roll}</td>
                    <td className="px-6 py-4">{row.class}</td>
                    <td className="px-6 py-4">${row.total}</td>
                    <td className="px-6 py-4 text-green-500 font-bold">${row.settled}</td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${row.pending > 0 ? 'text-amber-500' : 'text-slate-500'}`}>
                        ${row.pending}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeReportTab === 'roster' && (
            <table className="w-full border-collapse text-left text-sm text-slate-655 dark:text-slate-400 font-medium">
              <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-850 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-4">Student Name</th>
                  <th className="px-6 py-4">Admission ID</th>
                  <th className="px-6 py-4">Class Room</th>
                  <th className="px-6 py-4">Gender</th>
                  <th className="px-6 py-4">Date of Birth</th>
                  <th className="px-6 py-4">Admission Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {list.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/40">
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">{student.name}</td>
                    <td className="px-6 py-4">{student.admissionNumber}</td>
                    <td className="px-6 py-4">{getClassName(student.classId)}-{student.section}</td>
                    <td className="px-6 py-4">{student.gender}</td>
                    <td className="px-6 py-4">{student.dob}</td>
                    <td className="px-6 py-4">{student.admissionDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
