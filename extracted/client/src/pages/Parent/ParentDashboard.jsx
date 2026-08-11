import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Bell, CreditCard, Award, CheckCircle, Activity, ShieldAlert, Sparkles, X } from 'lucide-react';

const ParentDashboard = () => {
  const { user } = useAuth();
  const { parents, students, classes, subjects, grades, fees, payFee, attendance, notifications } = useApp();

  // Find parent details
  const parent = parents.find(p => p.id === user.refId) || parents[0];

  // Retrieve linked child profiles
  const children = students.filter(s => parent.children.includes(s.id));
  const [selectedChild, setSelectedChild] = useState(children[0] || null);

  const [showPayModal, setShowPayModal] = useState(false);
  const [activeFee, setActiveFee] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  if (!selectedChild) {
    return <div className="text-center py-10 text-slate-400">No children linked to this parent profile.</div>;
  }

  const getClassName = (clsId) => {
    const c = classes.find(cls => cls.id === clsId);
    return c ? `${c.name}-${selectedChild.section}` : 'N/A';
  };

  const getSubjectName = (subId) => {
    return subjects.find(s => s.id === subId)?.name || 'Subject';
  };

  // Compile child statistics
  const childGrades = grades.filter(g => g.studentId === selectedChild.id);
  const childFees = fees.filter(f => f.studentId === selectedChild.id);
  const childAttendance = attendance.filter(a => a.userId === selectedChild.id && a.userType === 'Student');

  // Attendance tallies
  const presentDays = childAttendance.filter(a => a.status === 'Present').length;
  const lateDays = childAttendance.filter(a => a.status === 'Late').length;
  const totalDays = childAttendance.length;
  const attendanceRate = totalDays ? Math.round(((presentDays + lateDays) / totalDays) * 100) : 100;

  // Recent notifications specific to attendance/fee alerts
  const parentAlerts = notifications.filter(n => 
    n.recipientRole === 'parent' && (n.recipientId === parent.id || n.recipientId === selectedChild.id)
  );

  const openPayModal = (fee) => {
    setActiveFee(fee);
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
    setShowPayModal(true);
  };

  const handlePayment = (e) => {
    e.preventDefault();
    if (!cardNumber || !cardExpiry || !cardCvv) {
      alert('Please fill out all payment details.');
      return;
    }
    payFee(activeFee.id, 'Online');
    setShowPayModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Parent Welcome Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Parent Portal</h1>
          <p className="text-sm text-slate-505 dark:text-slate-400">Logged in as parent: {parent.name} • Contact: {parent.phone}</p>
        </div>

        {/* Child Selector Tabs */}
        {children.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Select Child:</span>
            {children.map(child => (
              <button
                key={child.id}
                onClick={() => setSelectedChild(child)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  selectedChild.id === child.id
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-655'
                }`}
              >
                {child.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Child Summary Stats Row */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Child Attendance Rate */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{selectedChild.name}'s Attendance</span>
            <h3 className={`mt-1 text-2xl font-bold ${attendanceRate >= 85 ? 'text-green-500' : 'text-red-500'}`}>{attendanceRate}%</h3>
            <p className="text-[10px] text-slate-400 mt-1">Present: {presentDays} days • Late: {lateDays} days</p>
          </div>
          <div className="rounded-xl bg-blue-50 dark:bg-sky-950/20 p-3 text-blue-600">
            <Activity className="h-6 w-6" />
          </div>
        </div>

        {/* Outstanding Tuition Invoice */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tuition Fees Status</span>
            <h3 className="mt-1 text-2xl font-bold text-slate-800 dark:text-white">
              ${childFees.filter(f => f.status === 'Pending').reduce((sum, f) => sum + f.amount, 0)} Outstanding
            </h3>
            <p className="text-[10px] text-slate-400 mt-1">Outstanding items: {childFees.filter(f => f.status === 'Pending').length}</p>
          </div>
          <div className="rounded-xl bg-amber-50 dark:bg-amber-950/20 p-3 text-amber-600">
            <CreditCard className="h-6 w-6" />
          </div>
        </div>

        {/* Report Card Grades summary */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Academics</span>
            <h3 className="mt-1 text-2xl font-bold text-slate-800 dark:text-white">
              {childGrades.length} Subjects graded
            </h3>
            <p className="text-[10px] text-slate-405 mt-1">Midterm Assessment term</p>
          </div>
          <div className="rounded-xl bg-purple-50 dark:bg-purple-950/20 p-3 text-purple-600">
            <Award className="h-6 w-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Child Roster Grades */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-6">
          <h3 className="text-base font-bold text-slate-805 dark:text-white flex items-center gap-2 mb-4">
            <Award className="h-5 w-5 text-purple-600" />
            Report Card Progress
          </h3>
          <div className="space-y-3.5">
            {childGrades.length === 0 ? (
              <p className="text-xs text-slate-405 py-6 text-center">No grades published yet.</p>
            ) : (
              childGrades.map((g, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-850/40">
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-white">{getSubjectName(g.subjectId)}</span>
                    <p className="text-[9px] text-slate-400">Remarks: {g.remarks}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-800 dark:text-white">{g.marksObtained}/100</span>
                    <span className="rounded-lg bg-sky-50 dark:bg-sky-950/30 px-2 py-0.5 font-bold text-sky-600 text-xs">{g.grade}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Bill Statements and Invoice actions */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-6">
          <h3 className="text-base font-bold text-slate-805 dark:text-white flex items-center gap-2 mb-4">
            <CreditCard className="h-5 w-5 text-amber-500" />
            Tuition Ledger Billing
          </h3>
          <div className="space-y-3.5">
            {childFees.map(fee => {
              const isPaid = fee.status === 'Paid';
              return (
                <div key={fee.id} className="flex items-center justify-between p-3.5 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-850/40">
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-white">{fee.description}</span>
                    <p className="text-[9px] text-slate-400">Due Date: {new Date(fee.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-800 dark:text-white">${fee.amount}</span>
                    {isPaid ? (
                      <span className="rounded-lg bg-green-50 px-2.5 py-1 text-[10px] font-bold text-green-600 uppercase">Settled</span>
                    ) : (
                      <button
                        onClick={() => openPayModal(fee)}
                        className="rounded-lg bg-sky-600 px-3 py-1 text-[10px] font-bold text-white hover:bg-sky-700 shadow-sm"
                      >
                        Pay Online
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Parent Alert Feeds */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-base font-bold text-slate-805 dark:text-white flex items-center gap-2 mb-4">
          <Bell className="h-5 w-5 text-sky-600 animate-pulse" />
          Attendance & Fee Alerts
        </h3>
        <div className="space-y-3.5">
          {parentAlerts.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No active notifications logged.</p>
          ) : (
            parentAlerts.map(notif => (
              <div key={notif.id} className="p-3.5 rounded-xl border border-slate-150 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/10 flex items-start gap-3">
                <div className="rounded-lg bg-sky-100 p-1.5 text-sky-600 shrink-0">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-white">{notif.title}</span>
                    <span className="text-[9px] text-slate-400">{new Date(notif.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{notif.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ONLINE PAYMENT MODAL WITH MOCK CARD ENTRIES */}
      {showPayModal && activeFee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-5">
              <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-sky-600" />
                Online Payment Gateway
              </h3>
              <button onClick={() => setShowPayModal(false)} className="rounded-lg p-1 text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-850">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handlePayment} className="space-y-4">
              <div className="rounded-2xl bg-slate-50 dark:bg-slate-850 p-4 border border-slate-100 dark:border-slate-800 mb-4">
                <p className="text-xs text-slate-500">Statement: <span className="font-bold text-slate-700 dark:text-slate-350">{activeFee.description}</span></p>
                <p className="text-xs text-slate-500 mt-1">Student Ref: <span className="font-bold text-slate-700 dark:text-slate-350">{selectedChild.name}</span></p>
                <p className="text-sm font-bold text-slate-850 dark:text-white mt-3">Charge Total: ${activeFee.amount}.00</p>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-550">16-Digit Card Number</label>
                <input
                  type="text"
                  required
                  placeholder="4111 2222 3333 4444"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-550">Expiry Date</label>
                  <input
                    type="text"
                    required
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-550">CVV Code</label>
                  <input
                    type="password"
                    required
                    placeholder="•••"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
                <button type="button" onClick={() => setShowPayModal(false)} className="rounded-xl border border-slate-200 dark:border-slate-700 px-5 py-2.5 text-sm font-bold text-slate-655">
                  Cancel
                </button>
                <button type="submit" className="rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-sky-700 shadow-md shadow-sky-600/10">
                  Submit Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentDashboard;
