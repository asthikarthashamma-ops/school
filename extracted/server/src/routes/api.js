const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Import Schemas
const {
  User, Student, Teacher, Parent, Attendance, Class, Subject, Fee, Exam, Grade, Timetable, Notification
} = require('../models/Schemas');

// Secret for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'school_portal_secret_key_123';

// ----------------------------------------------------
// AUTHENTICATION MIDDLEWARE
// ----------------------------------------------------
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// ----------------------------------------------------
// AUTHENTICATION ROUTES
// ----------------------------------------------------
router.post('/auth/login', async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const user = await User.findOne({ username, role });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or role' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user._id, role: user.role, refId: user.refId }, JWT_SECRET, { expiresIn: '8h' });

    // Fetch corresponding profile details
    let profile = null;
    if (user.role === 'student') {
      profile = await Student.findById(user.refId).populate('parentId classId');
    } else if (user.role === 'teacher') {
      profile = await Teacher.findById(user.refId);
    } else if (user.role === 'parent') {
      profile = await Parent.findById(user.refId).populate('children');
    }

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        refId: user.refId,
        profile
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/auth/forgot-password', async (req, res) => {
  const { username, email } = req.body;
  // Demonstration / Mock response for password recovery
  res.json({ message: `Password reset link sent to registered email for user: ${username}` });
});

// ----------------------------------------------------
// BIOMETRIC ATTENDANCE ROUTE (Integration Endpoint)
// ----------------------------------------------------
/**
 * @route   POST /api/attendance/biometric-scan
 * @desc    Receive check-in/out trigger from biometric devices (fingerprint/face recognition)
 * @access  Public (Typically protected by IP whitelist or Device API Token in Headers)
 * 
 * INTEGRATION NOTE:
 * Hardware devices (e.g., ZKTeco, FaceMe SDK, or Raspberry Pi scanners) will run an agent
 * that calls this API when a user places their finger or scans their face.
 * The device transmits the 'deviceUserId' or 'biometricToken' matching the student/teacher.
 */
router.post('/attendance/biometric-scan', async (req, res) => {
  const { deviceUserId, userType, method, timestamp } = req.body;
  // deviceUserId will correspond to student's rollNumber or teacher's employeeId.

  try {
    const scanTime = timestamp ? new Date(timestamp) : new Date();
    const todayStr = scanTime.toISOString().split('T')[0];

    let userRef = null;
    if (userType === 'Student') {
      userRef = await Student.findOne({ rollNumber: deviceUserId });
    } else {
      userRef = await Teacher.findOne({ employeeId: deviceUserId });
    }

    if (!userRef) {
      return res.status(404).json({ message: `User matching biometric ID ${deviceUserId} not found.` });
    }

    // Check if attendance already exists for today
    let attendance = await Attendance.findOne({
      userId: userRef._id,
      userType: userType,
      date: todayStr
    });

    const checkInCutoff = '08:30:00'; // 8:30 AM Cutoff for late arrivals
    const scanTimeString = scanTime.toTimeString().split(' ')[0];
    const isLate = scanTimeString > checkInCutoff;

    if (!attendance) {
      // First scan of the day: Check-in
      attendance = new Attendance({
        userId: userRef._id,
        userType: userType,
        date: todayStr,
        checkIn: scanTime,
        status: isLate ? 'Late' : 'Present',
        biometricVerified: true,
        method: method || 'Face'
      });
      await attendance.save();

      // Trigger Parent Alert if it's a student
      if (userType === 'Student' && userRef.parentId) {
        const parentAlert = new Notification({
          title: 'Student Check-in Alert',
          message: `${userRef.name} checked in at ${scanTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Status: ${attendance.status}.`,
          type: 'AttendanceAlert',
          recipientRole: 'parent',
          recipientId: userRef.parentId
        });
        await parentAlert.save();
      }

      return res.json({
        success: true,
        action: 'check-in',
        status: attendance.status,
        time: scanTime,
        message: `${userRef.name} checked in successfully.`
      });
    } else {
      // Second scan of the day: Check-out
      attendance.checkOut = scanTime;
      await attendance.save();

      return res.json({
        success: true,
        action: 'check-out',
        status: attendance.status,
        time: scanTime,
        message: `${userRef.name} checked out successfully.`
      });
    }

  } catch (error) {
    res.status(500).json({ message: 'Biometric registration failed', error: error.message });
  }
});

// ----------------------------------------------------
// STUDENTS MANAGEMENT ROUTES
// ----------------------------------------------------
router.get('/students', authenticateJWT, async (req, res) => {
  try {
    const students = await Student.find().populate('parentId classId');
    res.json(students);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/students', authenticateJWT, async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.put('/students/:id', authenticateJWT, async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(student);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.delete('/students/:id', authenticateJWT, async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted successfully' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ----------------------------------------------------
// TEACHERS MANAGEMENT ROUTES
// ----------------------------------------------------
router.get('/teachers', authenticateJWT, async (req, res) => {
  try {
    const teachers = await Teacher.find().populate('subjects');
    res.json(teachers);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ----------------------------------------------------
// FEES ROUTING
// ----------------------------------------------------
router.get('/fees/student/:studentId', authenticateJWT, async (req, res) => {
  try {
    const fees = await Fee.find({ studentId: req.params.studentId });
    res.json(fees);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/fees/pay/:id', authenticateJWT, async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);
    if (!fee) return res.status(404).json({ message: 'Fee record not found' });
    
    fee.status = 'Paid';
    fee.paymentDate = new Date();
    fee.paymentMethod = req.body.paymentMethod || 'Online';
    fee.receiptNumber = 'REC-' + Math.floor(100000 + Math.random() * 900000);
    await fee.save();

    res.json({ message: 'Payment recorded successfully', fee });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ----------------------------------------------------
// EXAMS & GRADES ROUTING
// ----------------------------------------------------
router.post('/exams/grades', authenticateJWT, async (req, res) => {
  const { studentId, examId, subjectId, marksObtained, remarks } = req.body;
  try {
    // Calculate grade
    let gradeLetter = 'F';
    if (marksObtained >= 90) gradeLetter = 'A+';
    else if (marksObtained >= 80) gradeLetter = 'A';
    else if (marksObtained >= 70) gradeLetter = 'B';
    else if (marksObtained >= 60) gradeLetter = 'C';
    else if (marksObtained >= 50) gradeLetter = 'D';

    const grade = await Grade.findOneAndUpdate(
      { studentId, examId, subjectId },
      { marksObtained, grade: gradeLetter, remarks },
      { new: true, upsert: true }
    );
    res.json(grade);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ----------------------------------------------------
// NOTIFICATIONS ROUTING
// ----------------------------------------------------
router.get('/notifications', authenticateJWT, async (req, res) => {
  try {
    const notifications = await Notification.find({
      $or: [
        { recipientRole: 'all' },
        { recipientRole: req.user.role },
        { recipientId: req.user.id }
      ]
    }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ----------------------------------------------------
// TRANSPORT (GPS) ROUTING
// ----------------------------------------------------
router.get('/transport/routes', authenticateJWT, async (req, res) => {
  try {
    const { BusRoute } = require('../models/Schemas');
    const routes = await BusRoute.find().populate('assignedStudents');
    res.json(routes);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/transport/routes/:id/status', authenticateJWT, async (req, res) => {
  try {
    const { BusRoute } = require('../models/Schemas');
    const route = await BusRoute.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    
    // Broadcast notifications if status changes
    if (route && (req.body.status === 'Delayed' || req.body.status === 'En Route')) {
      const { Notification } = require('../models/Schemas');
      const msg = req.body.status === 'Delayed'
        ? `School bus ${route.busNumber} (${route.routeName}) is currently delayed by 15 minutes due to traffic.`
        : `School bus ${route.busNumber} (${route.routeName}) is now en route. Track live location in the portal.`;
        
      const notifications = route.assignedStudents.map(studentId => new Notification({
        title: `Bus Transit Alert: ${route.routeName}`,
        message: msg,
        type: 'Alert',
        recipientRole: 'parent',
        recipientId: studentId
      }));
      
      await Notification.insertMany(notifications);
    }

    res.json(route);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/transport/routes/:id/telemetry', async (req, res) => {
  try {
    const { BusRoute } = require('../models/Schemas');
    const { lat, lng } = req.body;
    const route = await BusRoute.findByIdAndUpdate(req.params.id, { coordinates: { lat, lng } }, { new: true });
    res.json({ success: true, route });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
