import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, UserPlus, Edit2, Trash2, X } from 'lucide-react';

const TeacherManagement = () => {
  const { teachers, addTeacher, updateTeacher, deleteTeacher } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTeacher, setActiveTeacher] = useState(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formSubjects, setFormSubjects] = useState('');

  const openAddModal = () => {
    setFormName('');
    setFormEmail('');
    setFormPhone('');
    setFormSubjects('');
    setShowAddModal(true);
  };

  const openEditModal = (teacher) => {
    setActiveTeacher(teacher);
    setFormName(teacher.name);
    setFormEmail(teacher.email);
    setFormPhone(teacher.phone);
    setFormSubjects(teacher.subjects.join(', '));
    setShowEditModal(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    addTeacher({
      name: formName,
      email: formEmail,
      phone: formPhone,
      subjects: formSubjects.split(',').map(s => s.trim()).filter(Boolean)
    });
    setShowAddModal(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateTeacher(activeTeacher.id, {
      name: formName,
      email: formEmail,
      phone: formPhone,
      subjects: formSubjects.split(',').map(s => s.trim()).filter(Boolean)
    });
    setShowEditModal(false);
  };

  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Teacher Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage employee directories, credentials, and subject assignments</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4.5 py-3 text-sm font-bold text-white shadow-md hover:bg-sky-700"
        >
          <UserPlus className="h-4.5 w-4.5" />
          Add Teacher
        </button>
      </div>

      <div className="rounded-2xl bg-white p-4 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
        <div className="relative max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Search className="h-4.5 w-4.5" />
          </span>
          <input
            type="text"
            placeholder="Search by teacher name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none focus:border-sky-500 dark:border-slate-850 dark:bg-slate-850 dark:text-white"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-slate-655 dark:text-slate-400">
            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-850 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4">Teacher</th>
                <th className="px-6 py-4">Employee ID</th>
                <th className="px-6 py-4">Phone Number</th>
                <th className="px-6 py-4">Subjects assigned</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredTeachers.map(t => (
                <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/40">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-xl border border-slate-100 dark:border-slate-850">
                      <img src={t.photo} alt={t.name} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <span className="block font-bold text-slate-800 dark:text-white">{t.name}</span>
                      <span className="text-[10px] text-slate-400">{t.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{t.employeeId}</td>
                  <td className="px-6 py-4">{t.phone}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {t.subjects.map((s, idx) => (
                        <span key={idx} className="rounded-md bg-sky-50 dark:bg-sky-950/20 px-2 py-0.5 text-xs text-sky-650 dark:text-sky-400">
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-green-50 dark:bg-emerald-950/40 px-2.5 py-0.5 text-xs text-green-600 font-bold uppercase">
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => openEditModal(t)} className="p-2 text-slate-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20 rounded-lg">
                      <Edit2 className="h-4.5 w-4.5" />
                    </button>
                    <button onClick={() => deleteTeacher(t.id)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg">
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD/EDIT MODAL */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-5">
              <h3 className="text-base font-bold text-slate-800 dark:text-white">
                {showAddModal ? 'Create Teacher Account' : 'Edit Teacher Profile'}
              </h3>
              <button onClick={() => { setShowAddModal(false); setShowEditModal(false); }} className="rounded-lg p-1 text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-850">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={showAddModal ? handleAddSubmit : handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Teacher Name</label>
                <input type="text" required value={formName} onChange={(e) => setFormName(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-850 dark:text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</label>
                <input type="email" required value={formEmail} onChange={(e) => setFormEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-850 dark:text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Phone number</label>
                <input type="text" required value={formPhone} onChange={(e) => setFormPhone(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-850 dark:text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Subjects assigned (comma-separated)</label>
                <input type="text" value={formSubjects} onChange={(e) => setFormSubjects(e.target.value)} placeholder="e.g. Mathematics, Chemistry, Calculus" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-850 dark:text-white" />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
                <button type="button" onClick={() => { setShowAddModal(false); setShowEditModal(false); }} className="rounded-xl border border-slate-200 dark:border-slate-700 px-5 py-2.5 text-sm font-bold text-slate-655">
                  Cancel
                </button>
                <button type="submit" className="rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-sky-700">
                  {showAddModal ? 'Save Account' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherManagement;
