const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 1. User Schema (Credentials and Roles)
const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['admin', 'teacher', 'student', 'parent'] },
  refId: { type: Schema.Types.ObjectId, refPath: 'roleRefModel' }, // References specific profile
  roleRefModel: { type: String, required: true, enum: ['Student', 'Teacher', 'Parent', 'AdminProfile'] }
}, { timestamps: true });

// Admin profile helper for user refs
const AdminProfileSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String }
});

// 2. Student Schema
const StudentSchema = new Schema({
  name: { type: String, required: true },
  rollNumber: { type: String, required: true, unique: true },
  admissionNumber: { type: String, required: true, unique: true },
  classId: { type: Schema.Types.ObjectId, ref: 'Class' },
  section: { type: String, default: 'A' },
  parentId: { type: Schema.Types.ObjectId, ref: 'Parent' },
  photo: { type: String }, // Base64 or image URL
  dob: { type: Date },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  admissionDate: { type: Date, default: Date.now }
}, { timestamps: true });

// 3. Teacher Schema
const TeacherSchema = new Schema({
  name: { type: String, required: true },
  employeeId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  phone: { type: String },
  subjects: [{ type: Schema.Types.ObjectId, ref: 'Subject' }],
  classes: [{ type: Schema.Types.ObjectId, ref: 'Class' }],
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

// 4. Parent Schema
const ParentSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  children: [{ type: Schema.Types.ObjectId, ref: 'Student' }]
}, { timestamps: true });

// 5. Attendance Schema
const AttendanceSchema = new Schema({
  userType: { type: String, required: true, enum: ['Student', 'Teacher'] },
  userId: { type: Schema.Types.ObjectId, required: true, refPath: 'userType' },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  checkIn: { type: Date },
  checkOut: { type: Date },
  status: { type: String, required: true, enum: ['Present', 'Absent', 'Late'], default: 'Absent' },
  biometricVerified: { type: Boolean, default: false },
  method: { type: String, enum: ['Fingerprint', 'Face', 'Manual', 'None'], default: 'None' },
  lateReason: { type: String }
}, { timestamps: true });

// 6. Class Schema
const ClassSchema = new Schema({
  name: { type: String, required: true }, // e.g. "Grade 10"
  section: { type: String, required: true }, // e.g. "A"
  classTeacher: { type: Schema.Types.ObjectId, ref: 'Teacher' },
  subjects: [{ type: Schema.Types.ObjectId, ref: 'Subject' }]
}, { timestamps: true });

// 7. Subject Schema
const SubjectSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  teacher: { type: Schema.Types.ObjectId, ref: 'Teacher' }
}, { timestamps: true });

// 8. Fee Schema
const FeeSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, required: true, ref: 'Student' },
  amount: { type: Number, required: true },
  description: { type: String, default: 'Term Fee' },
  dueDate: { type: Date, required: true },
  status: { type: String, required: true, enum: ['Paid', 'Pending'], default: 'Pending' },
  paymentMethod: { type: String, enum: ['Cash', 'Card', 'Bank Transfer', 'Online', 'None'], default: 'None' },
  paymentDate: { type: Date },
  receiptNumber: { type: String }
}, { timestamps: true });

// 9. Exam Schema
const ExamSchema = new Schema({
  name: { type: String, required: true }, // e.g., "First Term Exam"
  classId: { type: Schema.Types.ObjectId, required: true, ref: 'Class' },
  startDate: { type: Date },
  endDate: { type: Date },
  schedule: [{
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject' },
    date: { type: Date },
    maxMarks: { type: Number, default: 100 },
    passMarks: { type: Number, default: 40 }
  }]
}, { timestamps: true });

// 10. Grade Schema (Marks sheet records)
const GradeSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, required: true, ref: 'Student' },
  examId: { type: Schema.Types.ObjectId, required: true, ref: 'Exam' },
  subjectId: { type: Schema.Types.ObjectId, required: true, ref: 'Subject' },
  marksObtained: { type: Number, required: true },
  grade: { type: String }, // Calculated dynamically (A, B, C, F)
  remarks: { type: String }
}, { timestamps: true });

// 11. Timetable Schema
const TimetableSchema = new Schema({
  classId: { type: Schema.Types.ObjectId, required: true, ref: 'Class' },
  day: { type: String, required: true, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] },
  periods: [{
    periodNumber: { type: Number, required: true },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject' },
    teacherId: { type: Schema.Types.ObjectId, ref: 'Teacher' },
    startTime: { type: String }, // e.g., "08:30"
    endTime: { type: String },   // e.g., "09:15"
    room: { type: String }
  }]
}, { timestamps: true });

// 12. Notification Schema
const NotificationSchema = new Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, required: true, enum: ['Announcement', 'Alert', 'Holiday', 'FeeAlert', 'AttendanceAlert'] },
  recipientRole: { type: String, required: true, enum: ['all', 'admin', 'teacher', 'student', 'parent'] },
  recipientId: { type: Schema.Types.ObjectId }, // optional specific user
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

// 13. Bus Route Schema (Transport GPS System)
const BusRouteSchema = new Schema({
  routeName: { type: String, required: true },
  busNumber: { type: String, required: true },
  driverName: { type: String, required: true },
  driverPhone: { type: String, required: true },
  status: { type: String, required: true, enum: ['Idle', 'En Route', 'Delayed'], default: 'Idle' },
  coordinates: {
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 }
  },
  stops: [{
    name: { type: String, required: true },
    time: { type: String },
    lat: { type: Number },
    lng: { type: Number }
  }],
  assignedStudents: [{ type: Schema.Types.ObjectId, ref: 'Student' }]
}, { timestamps: true });

// Export all models
module.exports = {
  User: mongoose.model('User', UserSchema),
  AdminProfile: mongoose.model('AdminProfile', AdminProfileSchema),
  Student: mongoose.model('Student', StudentSchema),
  Teacher: mongoose.model('Teacher', TeacherSchema),
  Parent: mongoose.model('Parent', ParentSchema),
  Attendance: mongoose.model('Attendance', AttendanceSchema),
  Class: mongoose.model('Class', ClassSchema),
  Subject: mongoose.model('Subject', SubjectSchema),
  Fee: mongoose.model('Fee', FeeSchema),
  Exam: mongoose.model('Exam', ExamSchema),
  Grade: mongoose.model('Grade', GradeSchema),
  Timetable: mongoose.model('Timetable', TimetableSchema),
  Notification: mongoose.model('Notification', NotificationSchema),
  BusRoute: mongoose.model('BusRoute', BusRouteSchema)
};
