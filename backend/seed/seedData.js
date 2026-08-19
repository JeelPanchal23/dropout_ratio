const bcrypt = require('bcryptjs');

const FIVE_STUDENTS = [
  {
    studentId: 'STU2024001',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@university.edu',
    department: 'Computer Engineering',
    semester: 5,
    attendance: 58,
    currentGpa: 5.2,
    previousGpa: 6.8,
    assignmentCompletion: 45,
    quizScore: 48,
    lmsActivity: 35,
    studyHours: 4,
    failedSubjects: 2,
    backlogCount: 2,
    engagementScore: 40,
    scholarshipStatus: false,
    financialSupportNeeded: true,
    attendanceTrend: -14.2,
    academicTrend: -1.6,
    assignedMentor: 'Prof. Marcus Vance',
    riskScore: 82,
    riskLevel: 'High',
    lastUpdated: new Date()
  },
  {
    studentId: 'STU2024002',
    name: 'Ananya Patel',
    email: 'ananya.patel@university.edu',
    department: 'Information Technology',
    semester: 4,
    attendance: 72,
    currentGpa: 6.4,
    previousGpa: 6.6,
    assignmentCompletion: 68,
    quizScore: 58,
    lmsActivity: 60,
    studyHours: 8,
    failedSubjects: 1,
    backlogCount: 1,
    engagementScore: 62,
    scholarshipStatus: false,
    financialSupportNeeded: false,
    attendanceTrend: -4.5,
    academicTrend: -0.2,
    assignedMentor: 'Dr. Sarah Jenkins',
    riskScore: 52,
    riskLevel: 'Medium',
    lastUpdated: new Date()
  },
  {
    studentId: 'STU2024003',
    name: 'Rohan Verma',
    email: 'rohan.verma@university.edu',
    department: 'Mechanical Engineering',
    semester: 6,
    attendance: 78,
    currentGpa: 6.8,
    previousGpa: 6.9,
    assignmentCompletion: 74,
    quizScore: 62,
    lmsActivity: 68,
    studyHours: 9,
    failedSubjects: 0,
    backlogCount: 0,
    engagementScore: 70,
    scholarshipStatus: true,
    financialSupportNeeded: false,
    attendanceTrend: 1.2,
    academicTrend: -0.1,
    assignedMentor: 'Prof. Rajesh Kumar',
    riskScore: 42,
    riskLevel: 'Medium',
    lastUpdated: new Date()
  },
  {
    studentId: 'STU2024004',
    name: 'Priya Gupta',
    email: 'priya.gupta@university.edu',
    department: 'Electrical Engineering',
    semester: 4,
    attendance: 92,
    currentGpa: 8.9,
    previousGpa: 8.7,
    assignmentCompletion: 95,
    quizScore: 84,
    lmsActivity: 90,
    studyHours: 14,
    failedSubjects: 0,
    backlogCount: 0,
    engagementScore: 92,
    scholarshipStatus: true,
    financialSupportNeeded: false,
    attendanceTrend: 3.5,
    academicTrend: 0.2,
    assignedMentor: 'Dr. Elena Rostova',
    riskScore: 14,
    riskLevel: 'Low',
    lastUpdated: new Date()
  },
  {
    studentId: 'STU2024005',
    name: 'Vikram Singh',
    email: 'vikram.singh@university.edu',
    department: 'Civil Engineering',
    semester: 3,
    attendance: 88,
    currentGpa: 8.2,
    previousGpa: 8.1,
    assignmentCompletion: 88,
    quizScore: 76,
    lmsActivity: 82,
    studyHours: 12,
    failedSubjects: 0,
    backlogCount: 0,
    engagementScore: 85,
    scholarshipStatus: false,
    financialSupportNeeded: false,
    attendanceTrend: 0.8,
    academicTrend: 0.1,
    assignedMentor: 'Dr. Ananya Sharma',
    riskScore: 22,
    riskLevel: 'Low',
    lastUpdated: new Date()
  }
];

function generateSeedStudents(count = 5) {
  return FIVE_STUDENTS.slice(0, count);
}

function generateSeedInterventions(students) {
  return [
    {
      _id: 'INT-1001',
      studentId: 'STU2024001',
      studentName: 'Aarav Sharma',
      department: 'Computer Engineering',
      type: 'Attendance Counseling',
      reason: 'Critical attendance level (58%) and declining GPA',
      assignedTo: 'Prof. Marcus Vance',
      priority: 'High',
      status: 'In Progress',
      notes: 'Initial counseling session scheduled with student and academic counselor.',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      outcome: 'Pending progress review',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      _id: 'INT-2001',
      studentId: 'STU2024002',
      studentName: 'Ananya Patel',
      department: 'Information Technology',
      type: 'LMS Activity & Study Plan',
      reason: 'Low assignment completion and reduced online activity',
      assignedTo: 'Dr. Sarah Jenkins',
      priority: 'Medium',
      status: 'Assigned',
      notes: 'Assigned study group mentor and time management workshop.',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      outcome: 'Awaiting student check-in',
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
    }
  ];
}

const SEED_USERS = [
  {
    name: 'Dr. Elizabeth Vance (Admin)',
    email: 'admin@edushield.ai',
    password: 'password123',
    role: 'Admin',
    department: 'Administration'
  },
  {
    name: 'Prof. Marcus Vance',
    email: 'faculty@edushield.ai',
    password: 'password123',
    role: 'Faculty',
    department: 'Computer Engineering'
  },
  {
    name: 'Aarav Sharma (Student)',
    email: 'student@edushield.ai',
    password: 'password123',
    role: 'Student',
    department: 'Computer Engineering'
  }
];

module.exports = {
  generateSeedStudents,
  generateSeedInterventions,
  SEED_USERS
};

