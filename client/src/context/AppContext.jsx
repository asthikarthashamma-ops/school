import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

export const useApp = () => useContext(AppContext);

// Initial Rich Mock Data
const INITIAL_STUDENTS = [
  { id: 'stud-104', name: 'Jane Doe', rollNumber: '104', admissionNumber: 'ADM2026104', classId: 'cls-10', section: 'A', parentId: 'parent-201', email: 'jane.doe@school.com', dob: '2011-04-12', gender: 'Female', admissionDate: '2024-06-01', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150' },
  { id: 'stud-105', name: 'John Smith', rollNumber: '105', admissionNumber: 'ADM2026105', classId: 'cls-10', section: 'A', parentId: 'parent-202', email: 'john.smith@school.com', dob: '2011-08-22', gender: 'Male', admissionDate: '2024-06-01', photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150' },
  { id: 'stud-201', name: 'Alice Johnson', rollNumber: '201', admissionNumber: 'ADM2026201', classId: 'cls-9', section: 'B', parentId: 'parent-203', email: 'alice.j@school.com', dob: '2012-01-15', gender: 'Female', admissionDate: '2025-06-01', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150' },
  { id: 'stud-202', name: 'Bob Brown', rollNumber: '202', admissionNumber: 'ADM2026202', classId: 'cls-9', section: 'B', parentId: 'parent-204', email: 'bob.b@school.com', dob: '2012-05-30', gender: 'Male', admissionDate: '2025-06-01', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150' },
  { id: 'stud-303', name: 'Charlie Green', rollNumber: '303', admissionNumber: 'ADM2026303', classId: 'cls-11', section: 'A', parentId: 'parent-205', email: 'charlie.g@school.com', dob: '2010-09-05', gender: 'Male', admissionDate: '2023-06-01', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150' }
];

const INITIAL_TEACHERS = [
  { id: 'teach-101', name: 'Robert Carter', employeeId: 'T101', email: 'r.carter@school.com', phone: '+1 (555) 019-2834', subjects: ['Mathematics', 'Physics'], classes: ['Grade 10-A', 'Grade 11-A'], status: 'Active', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
  { id: 'teach-102', name: 'Clara Oswald', employeeId: 'T102', email: 'c.oswald@school.com', phone: '+1 (555) 019-8833', subjects: ['English Literature', 'History'], classes: ['Grade 10-A', 'Grade 9-B'], status: 'Active', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
  { id: 'teach-103', name: 'Walter White', employeeId: 'T103', email: 'w.white@school.com', phone: '+1 (555) 019-9485', subjects: ['Chemistry'], classes: ['Grade 11-A'], status: 'Active', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' }
];

const INITIAL_PARENTS = [
  { id: 'parent-201', name: 'David Doe', email: 'parent@school.com', phone: '+1 (555) 014-9988', children: ['stud-104'] },
  { id: 'parent-202', name: 'Susan Smith', email: 's.smith@mail.com', phone: '+1 (555) 014-7744', children: ['stud-105'] },
  { id: 'parent-203', name: 'Linda Johnson', email: 'linda.j@mail.com', phone: '+1 (555) 014-2211', children: ['stud-201'] }
];

const INITIAL_CLASSES = [
  { id: 'cls-10', name: 'Grade 10', section: 'A', classTeacher: 'teach-101' },
  { id: 'cls-9', name: 'Grade 9', section: 'B', classTeacher: 'teach-102' },
  { id: 'cls-11', name: 'Grade 11', section: 'A', classTeacher: 'teach-103' }
];

const INITIAL_SUBJECTS = [
  { id: 'subj-math', name: 'Mathematics', code: 'MATH101', teacher: 'teach-101' },
  { id: 'subj-eng', name: 'English Literature', code: 'ENG101', teacher: 'teach-102' },
  { id: 'subj-chem', name: 'Chemistry', code: 'CHEM101', teacher: 'teach-103' },
  { id: 'subj-phys', name: 'Physics', code: 'PHYS101', teacher: 'teach-101' }
];

// Prepopulate 15 days of historical attendance for statistics
const generateHistoricalAttendance = () => {
  const list = [];
  const studentIds = INITIAL_STUDENTS.map(s => s.id);
  const teacherIds = INITIAL_TEACHERS.map(t => t.id);

  // Generate for past 10 weekdays
  for (let i = 15; i >= 1; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayOfWeek = d.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue; // Skip weekends

    const dateStr = d.toISOString().split('T')[0];

    // Students attendance
    studentIds.forEach(id => {
      const rand = Math.random();
      let status = 'Present';
      let checkInTime = new Date(d);
      checkInTime.setHours(8, Math.floor(Math.random() * 25), 0); // 8:00 - 8:25 AM

      if (rand > 0.95) {
        status = 'Absent';
        checkInTime = null;
      } else if (rand > 0.8) {
        status = 'Late';
        checkInTime.setHours(8, 30 + Math.floor(Math.random() * 15), 0); // 8:30 - 8:45 AM
      }

      list.push({
        id: `att-s-${id}-${dateStr}`,
        userType: 'Student',
        userId: id,
        date: dateStr,
        checkIn: checkInTime ? checkInTime.toISOString() : null,
        checkOut: checkInTime ? new Date(new Date(checkInTime).setHours(15, 0, 0)).toISOString() : null,
        status,
        biometricVerified: status !== 'Absent',
        method: status !== 'Absent' ? (Math.random() > 0.5 ? 'Face' : 'Fingerprint') : 'None'
      });
    });

    // Teachers attendance
    teacherIds.forEach(id => {
      const rand = Math.random();
      const status = rand > 0.97 ? 'Absent' : 'Present';
      const checkInTime = new Date(d);
      checkInTime.setHours(7, 45 + Math.floor(Math.random() * 20), 0);

      list.push({
        id: `att-t-${id}-${dateStr}`,
        userType: 'Teacher',
        userId: id,
        date: dateStr,
        checkIn: status === 'Present' ? checkInTime.toISOString() : null,
        checkOut: status === 'Present' ? new Date(new Date(checkInTime).setHours(16, 0, 0)).toISOString() : null,
        status,
        biometricVerified: status === 'Present',
        method: status === 'Present' ? 'Fingerprint' : 'None'
      });
    });
  }

  // Prepopulate today's attendance partially (some present, some late, some outstanding)
  const todayStr = new Date().toISOString().split('T')[0];
  
  // Jane Doe is Present today (checked in at 08:12 AM)
  list.push({
    id: `att-s-stud-104-${todayStr}`,
    userType: 'Student',
    userId: 'stud-104',
    date: todayStr,
    checkIn: new Date(new Date().setHours(8, 12, 0)).toISOString(),
    checkOut: null,
    status: 'Present',
    biometricVerified: true,
    method: 'Face'
  });

  // John Smith is Late today (checked in at 08:37 AM)
  list.push({
    id: `att-s-stud-105-${todayStr}`,
    userType: 'Student',
    userId: 'stud-105',
    date: todayStr,
    checkIn: new Date(new Date().setHours(8, 37, 0)).toISOString(),
    checkOut: null,
    status: 'Late',
    biometricVerified: true,
    method: 'Fingerprint'
  });

  // Teacher Robert Carter is Present
  list.push({
    id: `att-t-teach-101-${todayStr}`,
    userType: 'Teacher',
    userId: 'teach-101',
    date: todayStr,
    checkIn: new Date(new Date().setHours(7, 50, 0)).toISOString(),
    checkOut: null,
    status: 'Present',
    biometricVerified: true,
    method: 'Fingerprint'
  });

  return list;
};

const INITIAL_FEES = [
  { id: 'fee-101', studentId: 'stud-104', amount: 1500, description: 'Term 1 Tuition Fee', dueDate: '2026-06-15', status: 'Paid', paymentMethod: 'Online', paymentDate: '2026-06-10', receiptNumber: 'REC-554902' },
  { id: 'fee-102', studentId: 'stud-104', amount: 1500, description: 'Term 2 Tuition Fee', dueDate: '2026-10-15', status: 'Pending', paymentMethod: 'None', paymentDate: null, receiptNumber: null },
  { id: 'fee-103', studentId: 'stud-105', amount: 1500, description: 'Term 1 Tuition Fee', dueDate: '2026-06-15', status: 'Paid', paymentMethod: 'Cash', paymentDate: '2026-06-14', receiptNumber: 'REC-332901' },
  { id: 'fee-104', studentId: 'stud-201', amount: 1200, description: 'Term 1 Tuition Fee', dueDate: '2026-06-15', status: 'Paid', paymentMethod: 'Online', paymentDate: '2026-06-11', receiptNumber: 'REC-441203' },
  { id: 'fee-105', studentId: 'stud-202', amount: 1200, description: 'Term 1 Tuition Fee', dueDate: '2026-06-15', status: 'Pending', paymentMethod: 'None', paymentDate: null, receiptNumber: null }
];

const INITIAL_EXAMS = [
  {
    id: 'exam-midterm-10',
    name: 'Midterm Assessment 2026',
    classId: 'cls-10',
    startDate: '2026-05-10',
    endDate: '2026-05-15',
    schedule: [
      { subjectId: 'subj-math', date: '2026-05-10', maxMarks: 100, passMarks: 40 },
      { subjectId: 'subj-eng', date: '2026-05-12', maxMarks: 100, passMarks: 40 }
    ]
  },
  {
    id: 'exam-midterm-9',
    name: 'Midterm Assessment 2026',
    classId: 'cls-9',
    startDate: '2026-05-10',
    endDate: '2026-05-15',
    schedule: [
      { subjectId: 'subj-eng', date: '2026-05-11', maxMarks: 100, passMarks: 40 }
    ]
  }
];

const INITIAL_GRADES = [
  { id: 'grd-01', studentId: 'stud-104', examId: 'exam-midterm-10', subjectId: 'subj-math', marksObtained: 88, grade: 'A', remarks: 'Excellent logical skills.' },
  { id: 'grd-02', studentId: 'stud-104', examId: 'exam-midterm-10', subjectId: 'subj-eng', marksObtained: 92, grade: 'A+', remarks: 'Superior essay construction.' },
  { id: 'grd-03', studentId: 'stud-105', examId: 'exam-midterm-10', subjectId: 'subj-math', marksObtained: 74, grade: 'B', remarks: 'Perform additional math drills.' },
  { id: 'grd-04', studentId: 'stud-105', examId: 'exam-midterm-10', subjectId: 'subj-eng', marksObtained: 81, grade: 'A', remarks: 'Participates well in class.' },
  { id: 'grd-05', studentId: 'stud-201', examId: 'exam-midterm-9', subjectId: 'subj-eng', marksObtained: 95, grade: 'A+', remarks: 'Out-standing presentation.' }
];

const INITIAL_TIMETABLES = [
  {
    classId: 'cls-10',
    day: 'Monday',
    periods: [
      { periodNumber: 1, subjectId: 'subj-math', teacherId: 'teach-101', startTime: '08:30', endTime: '09:20', room: 'Room 201' },
      { periodNumber: 2, subjectId: 'subj-eng', teacherId: 'teach-102', startTime: '09:20', endTime: '10:10', room: 'Room 201' },
      { periodNumber: 3, subjectId: 'subj-phys', teacherId: 'teach-101', startTime: '10:30', endTime: '11:20', room: 'Physics Lab' }
    ]
  },
  {
    classId: 'cls-10',
    day: 'Wednesday',
    periods: [
      { periodNumber: 1, subjectId: 'subj-phys', teacherId: 'teach-101', startTime: '08:30', endTime: '09:20', room: 'Physics Lab' },
      { periodNumber: 2, subjectId: 'subj-math', teacherId: 'teach-101', startTime: '09:20', endTime: '10:10', room: 'Room 201' }
    ]
  },
  {
    classId: 'cls-9',
    day: 'Monday',
    periods: [
      { periodNumber: 1, subjectId: 'subj-eng', teacherId: 'teach-102', startTime: '08:30', endTime: '09:20', room: 'Room 104' }
    ]
  }
];

const INITIAL_NOTIFICATIONS = [
  { id: 'not-1', title: 'Summer Vacation Announcement', message: 'School will remain closed for summer holidays from August 1st to August 20th. Classes resume August 21st.', type: 'Holiday', recipientRole: 'all', createdAt: '2026-07-15T09:00:00.000Z' },
  { id: 'not-2', title: 'Term 2 Tuition Due Reminder', message: 'Parents are requested to settle Term 2 fees before October 15th to avoid late registration charges.', type: 'FeeAlert', recipientRole: 'parent', createdAt: '2026-07-16T10:30:00.000Z' },
  { id: 'not-3', title: 'Biometric Check-in Completed', message: 'Jane Doe successfully verified check-in at 08:12 AM.', type: 'AttendanceAlert', recipientRole: 'parent', recipientId: 'parent-201', createdAt: '2026-07-17T08:12:00.000Z' }
];

const INITIAL_BUS_ROUTES = [
  {
    id: 'route-1',
    routeName: 'North Route A',
    busNumber: 'BUS-09',
    driverName: 'James Miller',
    driverPhone: '+1 (555) 012-4432',
    status: 'Idle',
    coordinates: { x: 30, y: 15 },
    stops: [
      { name: 'Westgate Crossing', time: '07:45 AM', x: 40, y: 40 },
      { name: 'Oakridge Suburbs', time: '08:00 AM', x: 80, y: 70 },
      { name: 'Pine Hills Road', time: '08:15 AM', x: 130, y: 90 },
      { name: 'AuraAcademy Campus', time: '08:30 AM', x: 180, y: 120 }
    ],
    assignedStudents: ['stud-104', 'stud-105'],
    currentStopIndex: 0
  },
  {
    id: 'route-2',
    routeName: 'South Route B',
    busNumber: 'BUS-14',
    driverName: 'Elena Rostova',
    driverPhone: '+1 (555) 019-9944',
    status: 'Idle',
    coordinates: { x: 310, y: 220 },
    stops: [
      { name: 'Southbay Marina', time: '07:50 AM', x: 270, y: 190 },
      { name: 'Lakeside Terraces', time: '08:10 AM', x: 220, y: 160 },
      { name: 'AuraAcademy Campus', time: '08:30 AM', x: 180, y: 120 }
    ],
    assignedStudents: ['stud-201', 'stud-202'],
    currentStopIndex: 0
  }
];

export const AppProvider = ({ children }) => {
  // Theme Dark Mode
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Database States
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('db_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [teachers, setTeachers] = useState(() => {
    const saved = localStorage.getItem('db_teachers');
    return saved ? JSON.parse(saved) : INITIAL_TEACHERS;
  });

  const [parents, setParents] = useState(() => {
    const saved = localStorage.getItem('db_parents');
    return saved ? JSON.parse(saved) : INITIAL_PARENTS;
  });

  const [attendance, setAttendance] = useState(() => {
    const saved = localStorage.getItem('db_attendance');
    return saved ? JSON.parse(saved) : generateHistoricalAttendance();
  });

  const [classes, setClasses] = useState(INITIAL_CLASSES);
  const [subjects, setSubjects] = useState(INITIAL_SUBJECTS);

  const [fees, setFees] = useState(() => {
    const saved = localStorage.getItem('db_fees');
    return saved ? JSON.parse(saved) : INITIAL_FEES;
  });

  const [exams, setExams] = useState(INITIAL_EXAMS);
  
  const [grades, setGrades] = useState(() => {
    const saved = localStorage.getItem('db_grades');
    return saved ? JSON.parse(saved) : INITIAL_GRADES;
  });

  const [timetables, setTimetables] = useState(INITIAL_TIMETABLES);

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('db_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [busRoutes, setBusRoutes] = useState(() => {
    const saved = localStorage.getItem('db_bus_routes');
    return saved ? JSON.parse(saved) : INITIAL_BUS_ROUTES;
  });

  // Toast System
  const [toasts, setToasts] = useState([]);
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Sync to LocalStorage on modifications
  useEffect(() => {
    localStorage.setItem('db_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('db_teachers', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem('db_parents', JSON.stringify(parents));
  }, [parents]);

  useEffect(() => {
    localStorage.setItem('db_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('db_fees', JSON.stringify(fees));
  }, [fees]);

  useEffect(() => {
    localStorage.setItem('db_grades', JSON.stringify(grades));
  }, [grades]);

  useEffect(() => {
    localStorage.setItem('db_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('db_bus_routes', JSON.stringify(busRoutes));
  }, [busRoutes]);

  // ----------------------------------------------------
  // SIMULATED BIOMETRIC SCANNER DATABASE SYNC
  // ----------------------------------------------------
  const markBiometricAttendance = (deviceUserId, userType, method) => {
    const scanTime = new Date();
    const todayStr = scanTime.toISOString().split('T')[0];

    let userRef = null;
    if (userType === 'Student') {
      userRef = students.find(s => s.rollNumber === deviceUserId);
    } else {
      userRef = teachers.find(t => t.employeeId === deviceUserId);
    }

    if (!userRef) {
      showToast(`Biometric user matching ID ${deviceUserId} not found.`, 'error');
      return { success: false };
    }

    // Check existing
    const existingIdx = attendance.findIndex(a => a.userId === userRef.id && a.userType === userType && a.date === todayStr);

    const checkInCutoff = '08:30:00';
    const scanTimeString = scanTime.toTimeString().split(' ')[0];
    const isLate = scanTimeString > checkInCutoff;

    let updatedAttendance = [...attendance];
    let action = 'check-in';
    let finalStatus = isLate ? 'Late' : 'Present';

    if (existingIdx === -1) {
      // First scan: check-in
      const record = {
        id: `att-${userType.toLowerCase()}-${userRef.id}-${todayStr}-${Date.now()}`,
        userType,
        userId: userRef.id,
        date: todayStr,
        checkIn: scanTime.toISOString(),
        checkOut: null,
        status: finalStatus,
        biometricVerified: true,
        method
      };
      updatedAttendance.push(record);

      // Parent alert trigger
      if (userType === 'Student' && userRef.parentId) {
        const parentAlert = {
          id: `not-${Date.now()}`,
          title: 'Student Biometric Check-in',
          message: `${userRef.name} checked in via ${method} recognition at ${scanTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Status: ${finalStatus}.`,
          type: 'AttendanceAlert',
          recipientRole: 'parent',
          recipientId: userRef.parentId,
          createdAt: scanTime.toISOString()
        };
        setNotifications(prev => [parentAlert, ...prev]);
      }
    } else {
      // Second scan: check-out
      action = 'check-out';
      const record = updatedAttendance[existingIdx];
      record.checkOut = scanTime.toISOString();
      finalStatus = record.status; // remain same as check-in status
      updatedAttendance[existingIdx] = record;
    }

    setAttendance(updatedAttendance);
    
    // Play Audio (Web Audio API Chime simulation)
    playChime(action === 'check-in' ? 'success' : 'double');

    showToast(`${userRef.name} successfully registered ${action} via ${method}.`, 'success');
    return {
      success: true,
      user: userRef,
      action,
      time: scanTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: finalStatus
    };
  };

  // Helper sound generator
  const playChime = (type) => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      
      const playNote = (freq, duration, delay) => {
        setTimeout(() => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
          
          gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
          
          osc.start();
          osc.stop(audioCtx.currentTime + duration);
        }, delay);
      };

      if (type === 'success') {
        playNote(880, 0.3, 0); // High pitch A note
      } else {
        playNote(660, 0.2, 0); // E Note
        playNote(880, 0.4, 150); // E to A note
      }
    } catch (e) {
      console.log("Audio contexts blocked or not supported on this browser.");
    }
  };

  // GPS Transit Simulation Ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setBusRoutes(prevRoutes => {
        let changed = false;
        const nextRoutes = prevRoutes.map(route => {
          if (route.status !== 'En Route') return route;

          changed = true;
          const targetStop = route.stops[route.currentStopIndex];
          if (!targetStop) return route;

          const dx = targetStop.x - route.coordinates.x;
          const dy = targetStop.y - route.coordinates.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 4) {
            const nextIdx = route.currentStopIndex + 1;
            if (nextIdx >= route.stops.length) {
              showToast(`Bus ${route.busNumber} has arrived at AuraAcademy.`, 'success');
              
              route.assignedStudents.forEach(studentId => {
                const stud = students.find(s => s.id === studentId);
                if (stud && stud.parentId) {
                  const alert = {
                    id: `not-transit-arr-${Date.now()}-${studentId}`,
                    title: `Transit Alert: Arrived`,
                    message: `School bus ${route.busNumber} (${route.routeName}) has successfully arrived at the AuraAcademy campus.`,
                    type: 'Alert',
                    recipientRole: 'parent',
                    recipientId: stud.parentId,
                    createdAt: new Date().toISOString()
                  };
                  setNotifications(prev => [alert, ...prev]);
                }
              });

              return {
                ...route,
                status: 'Idle',
                currentStopIndex: 0,
                coordinates: { x: route.stops[route.stops.length - 1].x, y: route.stops[route.stops.length - 1].y }
              };
            } else {
              showToast(`Bus ${route.busNumber} reached: ${targetStop.name}.`, 'success');
              return {
                ...route,
                currentStopIndex: nextIdx,
                coordinates: { x: targetStop.x, y: targetStop.y }
              };
            }
          }

          const speed = 2.5;
          const nx = route.coordinates.x + (dx / distance) * speed;
          const ny = route.coordinates.y + (dy / distance) * speed;

          return {
            ...route,
            coordinates: { x: parseFloat(nx.toFixed(1)), y: parseFloat(ny.toFixed(1)) }
          };
        });

        return changed ? nextRoutes : prevRoutes;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [students]);

  const updateBusStatus = (routeId, newStatus) => {
    setBusRoutes(prev => prev.map(route => {
      if (route.id === routeId) {
        if (newStatus === 'Delayed' || newStatus === 'En Route') {
          const msg = newStatus === 'Delayed'
            ? `School bus ${route.busNumber} (${route.routeName}) is currently delayed by 15 minutes due to traffic.`
            : `School bus ${route.busNumber} (${route.routeName}) is now en route. Track live location in the portal.`;

          route.assignedStudents.forEach(studentId => {
            const stud = students.find(s => s.id === studentId);
            if (stud && stud.parentId) {
              const alert = {
                id: `not-transit-${Date.now()}-${studentId}`,
                title: `Transit Alert: ${route.routeName}`,
                message: msg,
                type: 'Alert',
                recipientRole: 'parent',
                recipientId: stud.parentId,
                createdAt: new Date().toISOString()
              };
              setNotifications(prev => [alert, ...prev]);
            }
          });
        }

        if (newStatus === 'En Route') {
          return {
            ...route,
            status: newStatus,
            currentStopIndex: 0,
            coordinates: { x: route.stops[0].x, y: route.stops[0].y }
          };
        }

        return { ...route, status: newStatus };
      }
      return route;
    }));
    showToast(`Bus route status set to ${newStatus}.`, 'success');
  };

  // Student CRUD operations
  const addStudent = (studentData) => {
    const newStudent = {
      id: `stud-${Date.now()}`,
      admissionNumber: `ADM2026${Math.floor(100 + Math.random() * 900)}`,
      rollNumber: studentData.rollNumber,
      name: studentData.name,
      classId: studentData.classId,
      section: studentData.section || 'A',
      parentId: studentData.parentId,
      email: studentData.email,
      dob: studentData.dob,
      gender: studentData.gender,
      admissionDate: new Date().toISOString().split('T')[0],
      photo: studentData.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
    };
    setStudents(prev => [...prev, newStudent]);
    showToast(`${newStudent.name} admitted successfully.`, 'success');
  };

  const updateStudent = (id, updatedData) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updatedData } : s));
    showToast(`Student details updated.`, 'success');
  };

  const deleteStudent = (id) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    showToast(`Student record removed.`, 'error');
  };

  // Teacher CRUD operations
  const addTeacher = (teacherData) => {
    const newTeacher = {
      id: `teach-${Date.now()}`,
      employeeId: `T${Math.floor(100 + Math.random() * 900)}`,
      name: teacherData.name,
      email: teacherData.email,
      phone: teacherData.phone,
      subjects: teacherData.subjects || [],
      classes: teacherData.classes || [],
      status: 'Active',
      photo: teacherData.photo || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
    };
    setTeachers(prev => [...prev, newTeacher]);
    showToast(`Teacher account created.`, 'success');
  };

  const updateTeacher = (id, updatedData) => {
    setTeachers(prev => prev.map(t => t.id === id ? { ...t, ...updatedData } : t));
    showToast(`Teacher profile updated.`, 'success');
  };

  const deleteTeacher = (id) => {
    setTeachers(prev => prev.filter(t => t.id !== id));
    showToast(`Teacher profile removed.`, 'error');
  };

  // Fee payments from parents
  const payFee = (feeId, method) => {
    setFees(prev => prev.map(f => {
      if (f.id === feeId) {
        return {
          ...f,
          status: 'Paid',
          paymentMethod: method,
          paymentDate: new Date().toISOString().split('T')[0],
          receiptNumber: 'REC-' + Math.floor(100000 + Math.random() * 900000)
        };
      }
      return f;
    }));
    showToast(`Fees paid successfully!`, 'success');
  };

  // Marks entry from teachers
  const saveMarks = (studentId, examId, subjectId, marksObtained, remarks) => {
    let letter = 'F';
    if (marksObtained >= 90) letter = 'A+';
    else if (marksObtained >= 80) letter = 'A';
    else if (marksObtained >= 70) letter = 'B';
    else if (marksObtained >= 60) letter = 'C';
    else if (marksObtained >= 50) letter = 'D';

    const index = grades.findIndex(g => g.studentId === studentId && g.examId === examId && g.subjectId === subjectId);
    let updatedGrades = [...grades];

    if (index > -1) {
      updatedGrades[index] = { ...updatedGrades[index], marksObtained, grade: letter, remarks };
    } else {
      updatedGrades.push({
        id: `grd-${Date.now()}`,
        studentId,
        examId,
        subjectId,
        marksObtained,
        grade: letter,
        remarks
      });
    }

    setGrades(updatedGrades);
    showToast(`Marks updated successfully.`, 'success');
  };

  // Manual Attendance Overwrite by Admin
  const manualAttendanceCorrection = (userId, userType, dateStr, status) => {
    const index = attendance.findIndex(a => a.userId === userId && a.userType === userType && a.date === dateStr);
    let updatedAttendance = [...attendance];

    if (index > -1) {
      if (status === 'Absent') {
        // Change to absent: delete times
        updatedAttendance[index] = {
          ...updatedAttendance[index],
          status: 'Absent',
          checkIn: null,
          checkOut: null,
          method: 'None'
        };
      } else {
        // Mark Present or Late
        const time = new Date();
        time.setHours(status === 'Present' ? 8 : 9, 0, 0);
        updatedAttendance[index] = {
          ...updatedAttendance[index],
          status,
          checkIn: time.toISOString(),
          method: 'Manual'
        };
      }
    } else {
      // Add new record
      const checkInTime = new Date();
      checkInTime.setHours(status === 'Present' ? 8 : 9, 0, 0);
      updatedAttendance.push({
        id: `att-manual-${userId}-${dateStr}-${Date.now()}`,
        userType,
        userId,
        date: dateStr,
        checkIn: status === 'Absent' ? null : checkInTime.toISOString(),
        checkOut: null,
        status,
        biometricVerified: false,
        method: 'Manual'
      });
    }

    setAttendance(updatedAttendance);
    showToast(`Attendance record corrected manually.`, 'success');
  };

  // Create notifications/announcements
  const createAnnouncement = (title, message, type, recipientRole) => {
    const note = {
      id: `not-${Date.now()}`,
      title,
      message,
      type,
      recipientRole,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [note, ...prev]);
    showToast(`Announcement published.`, 'success');
  };

  return (
    <AppContext.Provider value={{
      darkMode,
      toggleDarkMode,
      students,
      teachers,
      parents,
      classes,
      subjects,
      fees,
      exams,
      grades,
      timetables,
      notifications,
      attendance,
      toasts,
      showToast,
      busRoutes,
      updateBusStatus,
      markBiometricAttendance,
      addStudent,
      updateStudent,
      deleteStudent,
      addTeacher,
      updateTeacher,
      deleteTeacher,
      payFee,
      saveMarks,
      manualAttendanceCorrection,
      createAnnouncement
    }}>
      {children}
    </AppContext.Provider>
  );
};
