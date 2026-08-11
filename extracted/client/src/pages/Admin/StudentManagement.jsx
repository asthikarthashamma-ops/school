import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, UserPlus, Edit2, Trash2, Eye, X, Image as ImageIcon, ArrowLeft, ArrowRight } from 'lucide-react';

const StudentManagement = () => {
  const { students, classes, parents, addStudent, updateStudent, deleteStudent } = useApp();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal Controllers
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [activeStudent, setActiveStudent] = useState(null);

  // Form Fields State
  const [formName, setFormName] = useState('');
  const [formRoll, setFormRoll] = useState('');
  const [formClassId, setFormClassId] = useState('');
  const [formSection, setFormSection] = useState('A');
  const [formParentId, setFormParentId] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formDob, setFormDob] = useState('');
  const [formGender, setFormGender] = useState('Female');
  const [formPhoto, setFormPhoto] = useState('');

  // Handle Photo upload base64 encoding
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getClassName = (clsId) => {
    const matched = classes.find(c => c.id === clsId);
    return matched ? `${matched.name}-${formSection}` : 'N/A';
  };

  const getParentName = (parId) => {
    const matched = parents.find(p => p.id === parId);
    return matched ? matched.name : 'Unassigned';
  };

  // Open modals & initialize fields
  const openAddModal = () => {
    setFormName('');
    setFormRoll('');
    setFormClassId(classes[0]?.id || '');
    setFormSection('A');
    setFormParentId(parents[0]?.id || '');
    setFormEmail('');
    setFormDob('2011-01-01');
    setFormGender('Female');
    setFormPhoto('');
    setShowAddModal(true);
  };

  const openEditModal = (student) => {
    setActiveStudent(student);
    setFormName(student.name);
    setFormRoll(student.rollNumber);
    setFormClassId(student.classId);
    setFormSection(student.section);
    setFormParentId(student.parentId);
    setFormEmail(student.email);
    setFormDob(student.dob);
    setFormGender(student.gender);
    setFormPhoto(student.photo);
    setShowEditModal(true);
  };

  const openViewModal = (student) => {
    setActiveStudent(student);
    setShowViewModal(true);
  };

  // Submit Operations
  const handleAddSubmit = (e) => {
    e.preventDefault();
    addStudent({
      name: formName,
      rollNumber: formRoll,
      classId: formClassId,
      section: formSection,
      parentId: formParentId,
      email: formEmail,
      dob: formDob,
      gender: formGender,
      photo: formPhoto
    });
    setShowAddModal(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateStudent(activeStudent.id, {
      name: formName,
      rollNumber: formRoll,
      classId: formClassId,
      section: formSection,
      parentId: formParentId,
      email: formEmail,
      dob: formDob,
      gender: formGender,
      photo: formPhoto
    });
    setShowEditModal(false);
  };

  // Filter and Sort Data
  const filteredStudents = students
    .filter(s => {
      const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.rollNumber.includes(searchQuery) ||
                          s.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase());
      const matchClass = selectedClass === 'All' || s.classId === selectedClass;
      return matchSearch && matchClass;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'roll') {
        comparison = a.rollNumber.localeCompare(b.rollNumber);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Pagination bounds
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Student Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Admit, modify, search, and manage student profile files</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4.5 py-3 text-sm font-bold text-white shadow-md shadow-sky-600/10 hover:bg-sky-700"
        >
          <UserPlus className="h-4.5 w-4.5" />
          Admit Student
        </button>
      </div>

      {/* Filter and Search Panels */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between rounded-2xl bg-white p-4 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Search className="h-4.5 w-4.5" />
          </span>
          <input
            type="text"
            placeholder="Search by name, roll, or admission ID..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none focus:border-sky-500 dark:border-slate-850 dark:bg-slate-850 dark:text-white"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Class Filter</span>
          <select
            value={selectedClass}
            onChange={(e) => { setSelectedClass(e.target.value); setCurrentPage(1); }}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none dark:border-slate-800 dark:bg-slate-850 dark:text-slate-350"
          >
            <option value="All">All Grades</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Students Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-850 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4 cursor-pointer" onClick={() => toggleSort('roll')}>
                  Roll Number {sortField === 'roll' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th className="px-6 py-4">Admission ID</th>
                <th className="px-6 py-4">Class Room</th>
                <th className="px-6 py-4">Linked Parent</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-slate-450">
                    No matching student profiles found.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/40 transition-colors duration-150">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded-xl border border-slate-100 dark:border-slate-800">
                        <img
                          src={student.photo}
                          alt={student.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <span className="block font-bold text-slate-800 dark:text-white">{student.name}</span>
                        <span className="text-[10px] text-slate-450">{student.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{student.rollNumber}</td>
                    <td className="px-6 py-4">{student.admissionNumber}</td>
                    <td className="px-6 py-4">
                      {classes.find(c => c.id === student.classId)?.name || 'N/A'}-{student.section}
                    </td>
                    <td className="px-6 py-4">{getParentName(student.parentId)}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => openViewModal(student)} className="p-2 text-slate-500 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-950/20 rounded-lg">
                        <Eye className="h-4.5 w-4.5" />
                      </button>
                      <button onClick={() => openEditModal(student)} className="p-2 text-slate-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20 rounded-lg">
                        <Edit2 className="h-4.5 w-4.5" />
                      </button>
                      <button onClick={() => deleteStudent(student.id)} className="p-2 text-slate-500 hover:text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg">
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 px-6 py-4">
            <span className="text-xs text-slate-400 font-semibold">
              Showing Page {currentPage} of {totalPages} ({filteredStudents.length} Students)
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="rounded-lg p-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="rounded-lg p-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 disabled:opacity-40"
              >
                <ArrowRight className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ==========================================
          ADD/EDIT STUDENT MODAL FORM
          ========================================== */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                {showAddModal ? 'Admit New Student' : 'Edit Student Details'}
              </h3>
              <button onClick={() => { setShowAddModal(false); setShowEditModal(false); }} className="rounded-lg p-1 text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-850">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={showAddModal ? handleAddSubmit : handleEditSubmit} className="space-y-4">
              
              {/* Photo Upload Section */}
              <div className="flex flex-col items-center justify-center p-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-850">
                <div className="relative h-24 w-24 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-center">
                  {formPhoto ? (
                    <img src={formPhoto} alt="Upload preview" className="h-full w-full object-cover" />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-slate-400" />
                  )}
                </div>
                <label className="mt-3 cursor-pointer rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-350 hover:bg-slate-50">
                  Choose Photo
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              </div>

              {/* Detail fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Student Name</label>
                  <input type="text" required value={formName} onChange={(e) => setFormName(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-850 dark:text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Roll Number</label>
                  <input type="text" required value={formRoll} onChange={(e) => setFormRoll(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-850 dark:text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Class assignment</label>
                  <select value={formClassId} onChange={(e) => setFormClassId(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-850 dark:text-white">
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Section</label>
                  <select value={formSection} onChange={(e) => setFormSection(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-850 dark:text-white">
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Linked Parent</label>
                  <select value={formParentId} onChange={(e) => setFormParentId(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-850 dark:text-white">
                    {parents.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Contact Email</label>
                  <input type="email" required value={formEmail} onChange={(e) => setFormEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-850 dark:text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Date of Birth</label>
                  <input type="date" required value={formDob} onChange={(e) => setFormDob(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-850 dark:text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Gender</label>
                  <select value={formGender} onChange={(e) => setFormGender(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-850 dark:text-white">
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
                <button type="button" onClick={() => { setShowAddModal(false); setShowEditModal(false); }} className="rounded-xl border border-slate-200 dark:border-slate-700 px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400">
                  Cancel
                </button>
                <button type="submit" className="rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-sky-700">
                  {showAddModal ? 'Admit Student' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          VIEW STUDENT PROFILE DETAILS MODAL
          ========================================== */}
      {showViewModal && activeStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-5">
              <h3 className="text-base font-bold text-slate-800 dark:text-white">Student Profile Card</h3>
              <button onClick={() => setShowViewModal(false)} className="rounded-lg p-1 text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-850">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="h-24 w-24 overflow-hidden rounded-2xl border-2 border-sky-100 dark:border-slate-800 shadow-md">
                <img src={activeStudent.photo} alt={activeStudent.name} className="h-full w-full object-cover" />
              </div>
              <h2 className="mt-4 text-xl font-bold text-slate-800 dark:text-white">{activeStudent.name}</h2>
              <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest mt-1">
                {getClassName(activeStudent.classId)}
              </span>

              <div className="mt-6 w-full space-y-3.5 text-left text-sm border-t border-slate-100 dark:border-slate-800 pt-4 text-slate-655 dark:text-slate-400">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-xs">Roll Number</span>
                  <span className="font-semibold text-slate-800 dark:text-white">{activeStudent.rollNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-xs">Admission Ref</span>
                  <span className="font-semibold text-slate-800 dark:text-white">{activeStudent.admissionNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-xs">Email Address</span>
                  <span className="font-semibold text-slate-800 dark:text-white">{activeStudent.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-xs">Date of Birth</span>
                  <span className="font-semibold text-slate-800 dark:text-white">{activeStudent.dob}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-xs">Gender</span>
                  <span className="font-semibold text-slate-800 dark:text-white">{activeStudent.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-xs">Linked Parent</span>
                  <span className="font-semibold text-slate-800 dark:text-white">{getParentName(activeStudent.parentId)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default StudentManagement;
