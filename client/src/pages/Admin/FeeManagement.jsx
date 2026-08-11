import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, CreditCard, Bell, Printer, CheckCircle, AlertCircle, X } from 'lucide-react';

const FeeManagement = () => {
  const { students, fees, payFee, createAnnouncement } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal for manual payment recording
  const [showPayModal, setShowPayModal] = useState(false);
  const [activeFee, setActiveFee] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  // Receipt Modal
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  const getStudentName = (studId) => {
    const s = students.find(stud => stud.id === studId);
    return s ? s.name : 'Unknown';
  };

  const getStudentDetails = (studId) => {
    return students.find(stud => stud.id === studId);
  };

  const openPayModal = (fee) => {
    setActiveFee(fee);
    setShowPayModal(true);
  };

  const handlePaySubmit = (e) => {
    e.preventDefault();
    payFee(activeFee.id, paymentMethod);
    setShowPayModal(false);
  };

  const openReceipt = (fee) => {
    const stud = getStudentDetails(fee.studentId);
    setReceiptData({
      fee,
      student: stud
    });
    setShowReceipt(true);
  };

  const sendFeeReminder = (fee) => {
    const stud = getStudentDetails(fee.studentId);
    if (!stud) return;
    createAnnouncement(
      'Outstanding Fee Alert',
      `Dear Parent, this is a reminder that a tuition invoice of $${fee.amount} for ${stud.name} was due on ${new Date(fee.dueDate).toLocaleDateString()}. Please settle outstanding balances as soon as possible.`,
      'FeeAlert',
      'parent'
    );
  };

  const filteredFees = fees.filter(f => {
    const studName = getStudentName(f.studentId);
    return studName.toLowerCase().includes(searchQuery.toLowerCase()) || f.description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Fee Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Track student tuition statements, record manual checks, and print receipts</p>
        </div>
      </div>

      {/* Control Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between rounded-2xl bg-white p-4 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Search className="h-4.5 w-4.5" />
          </span>
          <input
            type="text"
            placeholder="Search by student name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none focus:border-sky-500 dark:border-slate-850 dark:bg-slate-850 dark:text-white"
          />
        </div>
      </div>

      {/* Invoices grid */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-slate-655 dark:text-slate-400 font-medium">
            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-850 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Fee Details</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredFees.map(fee => {
                const isPaid = fee.status === 'Paid';
                return (
                  <tr key={fee.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/40">
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">
                      {getStudentName(fee.studentId)}
                    </td>
                    <td className="px-6 py-4">{fee.description}</td>
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">${fee.amount}</td>
                    <td className="px-6 py-4">{new Date(fee.dueDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      {isPaid ? (
                        <span className="flex items-center gap-1.5 text-xs text-green-600 font-bold uppercase">
                          <CheckCircle className="h-4 w-4" />
                          Settled
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs text-amber-600 font-bold uppercase">
                          <AlertCircle className="h-4 w-4" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {!isPaid ? (
                        <>
                          <button
                            onClick={() => openPayModal(fee)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-sky-700"
                          >
                            <CreditCard className="h-3.5 w-3.5" />
                            Record Pay
                          </button>
                          <button
                            onClick={() => sendFeeReminder(fee)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-350 hover:bg-slate-50"
                          >
                            <Bell className="h-3.5 w-3.5" />
                            Remind
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => openReceipt(fee)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 px-3 py-1.5 text-xs font-bold hover:opacity-80"
                        >
                          <Printer className="h-3.5 w-3.5" />
                          Receipt
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECORD PAYMENT MODAL */}
      {showPayModal && activeFee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-5">
              <h3 className="text-base font-bold text-slate-800 dark:text-white">Record Tuition Collection</h3>
              <button onClick={() => setShowPayModal(false)} className="rounded-lg p-1 text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-850">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handlePaySubmit} className="space-y-4">
              <div>
                <p className="text-sm text-slate-500">Student: <span className="font-bold text-slate-700 dark:text-slate-300">{getStudentName(activeFee.studentId)}</span></p>
                <p className="text-sm text-slate-500 mt-1">Invoice: <span className="font-bold text-slate-700 dark:text-slate-300">{activeFee.description}</span></p>
                <p className="text-sm text-slate-500 mt-1">Due Amount: <span className="font-bold text-slate-800 dark:text-white">${activeFee.amount}</span></p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-505 dark:text-slate-400">Payment Gateway/Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-850 dark:text-white"
                >
                  <option value="Cash">Physical Cash</option>
                  <option value="Card">Terminal POS Card</option>
                  <option value="Bank Transfer">Bank wire Transfer</option>
                  <option value="Online">Online Gateway Simulation</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
                <button type="button" onClick={() => setShowPayModal(false)} className="rounded-xl border border-slate-200 dark:border-slate-750 px-5 py-2.5 text-sm font-bold text-slate-655">
                  Cancel
                </button>
                <button type="submit" className="rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-sky-700">
                  Register Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROFESSIONAL PRINTABLE RECEIPT POPUP */}
      {showReceipt && receiptData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 relative">
            <button
              onClick={() => setShowReceipt(false)}
              className="absolute right-4 top-4 rounded-lg p-1 text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-850"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Receipt Content Wrapper */}
            <div id="receipt-print-area" className="p-4 bg-slate-50 dark:bg-slate-850/40 rounded-2xl border border-slate-150 dark:border-slate-800 mt-4 text-slate-700 dark:text-slate-300">
              <div className="text-center border-b border-slate-200 dark:border-slate-800 pb-4">
                <h2 className="text-lg font-extrabold text-slate-800 dark:text-white uppercase tracking-wide">AuraAcademy High School</h2>
                <p className="text-[10px] text-slate-400">100 Educational Pkwy, Science District • Phone: (555) 012-0099</p>
                <span className="mt-3 inline-block rounded-md bg-green-150 px-3.5 py-1 text-xs font-bold text-green-700 dark:bg-emerald-950/40 dark:text-green-400 uppercase tracking-widest">
                  OFFICIAL PAYMENT RECEIPT
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="block text-slate-400 font-bold">RECEIPT NUMBER</span>
                  <span className="font-semibold text-slate-800 dark:text-white font-mono">{receiptData.fee.receiptNumber}</span>
                </div>
                <div className="text-right">
                  <span className="block text-slate-400 font-bold">TRANSACTION DATE</span>
                  <span className="font-semibold text-slate-800 dark:text-white">{new Date(receiptData.fee.paymentDate).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="block text-slate-400 font-bold">STUDENT MEMBER</span>
                  <span className="font-semibold text-slate-800 dark:text-white">{receiptData.student.name}</span>
                </div>
                <div className="text-right">
                  <span className="block text-slate-400 font-bold">ROLL / ADMISSION ID</span>
                  <span className="font-semibold text-slate-800 dark:text-white font-mono">{receiptData.student.admissionNumber}</span>
                </div>
              </div>

              <div className="mt-6 border-t border-b border-slate-200 dark:border-slate-800 py-3.5 text-sm">
                <div className="flex justify-between font-semibold">
                  <span>Tuition Invoice description</span>
                  <span>Amount Settled</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>{receiptData.fee.description}</span>
                  <span className="font-bold text-slate-700 dark:text-slate-350">${receiptData.fee.amount}.00</span>
                </div>
              </div>

              <div className="mt-6 flex justify-between items-center text-xs">
                <div>
                  <span className="block text-slate-400 font-bold">PAYMENT TYPE</span>
                  <span className="font-semibold text-slate-800 dark:text-white">{receiptData.fee.paymentMethod}</span>
                </div>
                <div className="text-right">
                  <span className="block text-slate-400 font-bold">TOTAL BALANCES</span>
                  <span className="text-base font-extrabold text-green-600">$0.00 PAID</span>
                </div>
              </div>

              <div className="mt-8 border-t border-dashed border-slate-300 dark:border-slate-700 pt-6 text-center text-[10px] text-slate-400 font-medium">
                Thank you for supporting AuraAcademy operations. Keep this receipt copy for your files.
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 rounded-xl bg-sky-600 py-3 text-sm font-bold text-white shadow-md hover:bg-sky-700"
              >
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default FeeManagement;
