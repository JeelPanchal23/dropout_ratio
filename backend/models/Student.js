const mongoose = require('mongoose');

const subjectMarkSchema = new mongoose.Schema({
  subjectName: { type: String, required: true },
  marksObtained: { type: Number, required: true },
  totalMarks: { type: Number, default: 100 },
  grade: { type: String }
});

const semesterRecordSchema = new mongoose.Schema({
  semester: { type: Number, required: true },
  spi: { type: Number, default: null },
  cpi: { type: Number, default: null }
});

const documentSchema = new mongoose.Schema({
  type: { type: String, enum: ['resume', 'cv', 'document'], default: 'cv' },
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  mimeType: { type: String, required: true },
  fileSize: { type: Number, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

const certificateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  organization: { type: String, required: true },
  issueDate: { type: String },
  description: { type: String },
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  mimeType: { type: String, required: true },
  fileSize: { type: Number, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

const studentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  studentId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  department: { type: String, required: true },
  semester: { type: Number, default: 1, min: 1, max: 8 },
  college: { type: String, default: '' },
  profilePhoto: { type: String, default: '' },
  
  academicRecords: {
    currentSemester: { type: Number, default: 1 },
    currentCpi: { type: Number, default: null },
    currentSpi: { type: Number, default: null },
    overallCgpa: { type: Number, default: null },
    semesterRecords: [semesterRecordSchema],
    subjectMarks: [subjectMarkSchema],
    backlogCount: { type: Number, default: 0 },
    failedSubjects: { type: Number, default: 0 }
  },

  attendanceRecords: {
    overallAttendance: { type: Number, default: null },
    subjectAttendance: [{
      subjectName: { type: String },
      percentage: { type: Number }
    }],
    monthlyAttendance: [{
      month: { type: String },
      percentage: { type: Number }
    }],
    attendanceTrend: { type: Number, default: 0 }
  },

  learningBehavior: {
    lmsActivity: { type: Number, default: null },
    assignmentCompletion: { type: Number, default: null },
    quizScore: { type: Number, default: null },
    studyHours: { type: Number, default: null },
    engagementScore: { type: Number, default: null }
  },

  documents: [documentSchema],
  certificates: [certificateSchema],

  assignedMentor: { type: String, default: 'Unassigned' },
  riskScore: { type: Number, default: 0 },
  riskLevel: { type: String, enum: ['Low', 'Medium', 'High', 'Pending'], default: 'Pending' },
  lastUpdated: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', studentSchema);

