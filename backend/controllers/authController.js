const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Student = require('../models/Student');
const AuditLog = require('../models/AuditLog');
const { JWT_SECRET } = require('../middleware/authMiddleware');
const { memoryUsers, memoryStudents, memoryAuditLogs, isDbConnected } = require('../utils/dataStore');

const createAuditEntry = async (user, action, target, details, req) => {
  try {
    const entry = {
      _id: `AUDIT-${Date.now()}`,
      user: {
        id: user.id || user._id,
        name: user.name || 'User',
        email: user.email || 'email',
        role: user.role || 'Role'
      },
      action,
      target: target || '',
      details: details || '',
      ipAddress: req ? (req.ip || req.headers['x-forwarded-for'] || '') : '',
      timestamp: new Date()
    };

    if (isDbConnected()) {
      await AuditLog.create(entry).catch(() => memoryAuditLogs.unshift(entry));
    } else {
      memoryAuditLogs.unshift(entry);
    }
  } catch (err) {}
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }

    let user = null;
    let isMatch = false;

    // 1. Try MongoDB if connected
    if (isDbConnected()) {
      try {
        user = await User.findOne({ email: email.toLowerCase() });
        if (user) {
          isMatch = await bcrypt.compare(password, user.password);
        }
      } catch (dbErr) {
        user = null;
      }
    }

    // 2. Memory store fallback if DB user not found or DB offline
    if (!user) {
      const memUser = memoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (memUser) {
        isMatch = await bcrypt.compare(password, memUser.password);
        if (isMatch) user = memUser;
      }
    }

    // 3. Default Institutional Admin & Faculty Accounts
    if (!user && (email.toLowerCase() === 'admin@edushield.ai' || email.toLowerCase() === 'admin@edushield.edu') && (password === 'password123' || password === 'admin123')) {
      user = {
        _id: 'ADMIN-DEFAULT-001',
        name: 'Dr. Elizabeth Vance (Admin)',
        email: email.toLowerCase(),
        role: 'Admin',
        department: 'Administration'
      };
      isMatch = true;
    }

    if (!user && (email.toLowerCase() === 'faculty@edushield.ai' || email.toLowerCase() === 'faculty@edushield.edu') && (password === 'password123' || password === 'faculty123')) {
      user = {
        _id: 'FACULTY-DEFAULT-001',
        name: 'Prof. Marcus Vance',
        email: email.toLowerCase(),
        role: 'Faculty',
        department: 'Computer Engineering'
      };
      isMatch = true;
    }


    if (!user || !isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    let studentId = user.studentId;
    if (user.role === 'Student' && !studentId) {
      if (isDbConnected()) {
        const studentDoc = await Student.findOne({ userId: user._id }).catch(() => null);
        if (studentDoc) studentId = studentDoc.studentId;
      }
      if (!studentId) {
        const memSt = memoryStudents.find(s => s.userId === user._id || s.email === user.email);
        if (memSt) studentId = memSt.studentId;
      }
    }

    const payload = {
      id: user._id || user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      studentId
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
    await createAuditEntry(payload, 'LOGIN', user.email, `User ${user.name} logged in`, req);

    return res.json({ token, user: payload });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server authentication error.' });
  }
};

const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      studentId,
      phone,
      department,
      semester,
      college,
      dateOfBirth
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const lowerEmail = email.toLowerCase();
    const assignedRole = (role === 'Admin' || role === 'Faculty') ? role : 'Student';

    if (assignedRole === 'Student' && !studentId) {
      return res.status(400).json({ message: 'Student ID is required for student registration.' });
    }

    // Check duplicate in DB or Memory
    let existingUser = null;
    if (isDbConnected()) {
      existingUser = await User.findOne({ email: lowerEmail }).catch(() => null);
    }
    if (!existingUser) {
      existingUser = memoryUsers.find(u => u.email === lowerEmail);
    }

    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = `USER-${Date.now()}`;

    const newUserObj = {
      _id: userId,
      name,
      email: lowerEmail,
      password: hashedPassword,
      role: assignedRole,
      studentId: assignedRole === 'Student' ? studentId : undefined,
      department: department || 'Computer Engineering',
      createdAt: new Date()
    };

    let createdUser = null;
    let createdStudent = null;

    if (isDbConnected()) {
      try {
        createdUser = await User.create(newUserObj);
      } catch (err) {
        createdUser = newUserObj;
        memoryUsers.push(newUserObj);
      }
    } else {
      createdUser = newUserObj;
      memoryUsers.push(newUserObj);
    }

    if (assignedRole === 'Student') {
      const newStudentObj = {
        _id: `STU-DOC-${Date.now()}`,
        userId: createdUser._id || createdUser.id,
        studentId,
        name,
        email: lowerEmail,
        phone: phone || '',
        department: department || 'Computer Engineering',
        semester: Number(semester) || 1,
        college: college || '',
        academicRecords: {
          currentSemester: Number(semester) || 1,
          currentCpi: null,
          currentSpi: null,
          overallCgpa: null,
          semesterRecords: [],
          subjectMarks: [],
          backlogCount: 0,
          failedSubjects: 0
        },
        attendanceRecords: {
          overallAttendance: null,
          subjectAttendance: [],
          monthlyAttendance: [],
          attendanceTrend: 0
        },
        learningBehavior: {
          lmsActivity: null,
          assignmentCompletion: null,
          quizScore: null,
          studyHours: null,
          engagementScore: null
        },
        documents: [],
        certificates: [],
        riskScore: 0,
        riskLevel: 'Pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      if (isDbConnected()) {
        try {
          createdStudent = await Student.create(newStudentObj);
        } catch (err) {
          createdStudent = newStudentObj;
          memoryStudents.push(newStudentObj);
        }
      } else {
        createdStudent = newStudentObj;
        memoryStudents.push(newStudentObj);
      }
    }

    const payload = {
      id: createdUser._id || createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      role: createdUser.role,
      department: createdUser.department,
      studentId: assignedRole === 'Student' ? studentId : undefined
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
    await createAuditEntry(payload, 'REGISTER', createdUser.email, `Registered new ${assignedRole} account`, req);

    return res.status(201).json({
      token,
      user: payload,
      student: createdStudent
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'User registration error: ' + error.message });
  }
};

const getMe = async (req, res) => {
  return res.json({ user: req.user });
};

module.exports = { login, register, getMe };
