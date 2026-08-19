const path = require('path');
const fs = require('fs');
const Student = require('../models/Student');
const Prediction = require('../models/Prediction');
const Intervention = require('../models/Intervention');
const AuditLog = require('../models/AuditLog');
const { memoryStudents, memoryPredictions, memoryInterventions, memoryAuditLogs, isDbConnected } = require('../utils/dataStore');

const createAuditEntry = async (user, action, target, details, req) => {
  try {
    if (!user) return;
    const entry = {
      _id: `AUDIT-${Date.now()}`,
      user: {
        id: user.id || user._id,
        name: user.name || 'Unknown',
        email: user.email || 'unknown',
        role: user.role || 'User'
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

const getStudents = async (req, res) => {
  try {
    const { search, department, semester, riskLevel, sortBy, sortOrder, page = 1, limit = 15 } = req.query;

    if (isDbConnected()) {
      try {
        let query = {};
        if (search) {
          query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { studentId: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { department: { $regex: search, $options: 'i' } }
          ];
        }
        if (department && department !== 'All') query.department = department;
        if (semester && semester !== 'All') query.semester = Number(semester);
        if (riskLevel && riskLevel !== 'All') query.riskLevel = riskLevel;

        let sortObj = { updatedAt: -1 };
        if (sortBy) {
          sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;
        }

        const count = await Student.countDocuments(query);
        const students = await Student.find(query)
          .sort(sortObj)
          .skip((Number(page) - 1) * Number(limit))
          .limit(Number(limit));

        return res.json({
          total: count,
          page: Number(page),
          totalPages: Math.ceil(count / Number(limit)) || 1,
          students
        });
      } catch (dbErr) {}
    }

    // Memory Store filtering
    let list = [...memoryStudents];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.studentId.toLowerCase().includes(q) || 
        s.email.toLowerCase().includes(q)
      );
    }
    if (department && department !== 'All') list = list.filter(s => s.department === department);
    if (semester && semester !== 'All') list = list.filter(s => s.semester === Number(semester));
    if (riskLevel && riskLevel !== 'All') list = list.filter(s => s.riskLevel === riskLevel);

    const total = list.length;
    const startIndex = (page - 1) * limit;
    const paginated = list.slice(startIndex, startIndex + Number(limit));

    return res.json({
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)) || 1,
      students: paginated
    });
  } catch (error) {
    console.error('getStudents error:', error);
    return res.status(500).json({ message: 'Error retrieving student records.' });
  }
};

const getMeStudent = async (req, res) => {
  try {
    let student = null;

    if (isDbConnected()) {
      try {
        if (req.user.studentId) {
          student = await Student.findOne({ studentId: req.user.studentId });
        }
        if (!student && req.user.id) {
          student = await Student.findOne({ userId: req.user.id });
        }
      } catch (dbErr) {}
    }

    if (!student) {
      student = memoryStudents.find(s => 
        (req.user.studentId && s.studentId === req.user.studentId) || 
        s.userId === req.user.id || 
        s.email === req.user.email
      );
    }

    if (!student) {
      const fallbackSt = {
        _id: `STU-DOC-${Date.now()}`,
        userId: req.user.id,
        studentId: req.user.studentId || `STU-${Date.now().toString().slice(-6)}`,
        name: req.user.name || 'Student',
        email: req.user.email || '',
        phone: '',
        department: req.user.department || 'Computer Engineering',
        semester: 1,
        college: '',
        academicRecords: {
          currentSemester: 1,
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
          student = await Student.create(fallbackSt);
        } catch (dbErr) {
          student = fallbackSt;
          memoryStudents.push(fallbackSt);
        }
      } else {
        student = fallbackSt;
        memoryStudents.push(fallbackSt);
      }
    }


    let predictions = [];
    let interventions = [];

    if (isDbConnected()) {
      predictions = await Prediction.find({ studentId: student.studentId }).sort({ createdAt: -1 }).catch(() => []);
      interventions = await Intervention.find({ studentId: student.studentId }).sort({ createdAt: -1 }).catch(() => []);
    } else {
      predictions = memoryPredictions.filter(p => p.studentId === student.studentId);
      interventions = memoryInterventions.filter(i => i.studentId === student.studentId);
    }

    return res.json({
      student,
      predictions,
      interventions
    });
  } catch (error) {
    console.error('getMeStudent error:', error);
    return res.status(500).json({ message: 'Error retrieving student profile.' });
  }
};

const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    let student = null;

    if (isDbConnected()) {
      student = await Student.findOne({ studentId: id }).catch(() => null);
      if (!student) student = await Student.findById(id).catch(() => null);
    }

    if (!student) {
      student = memoryStudents.find(s => s.studentId === id || s._id === id);
    }

    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    if (req.user.role === 'Student' && req.user.studentId !== student.studentId) {
      return res.status(403).json({ message: 'Forbidden. You cannot view other student profiles.' });
    }

    let predictions = [];
    let interventions = [];

    if (isDbConnected()) {
      predictions = await Prediction.find({ studentId: student.studentId }).sort({ createdAt: -1 }).catch(() => []);
      interventions = await Intervention.find({ studentId: student.studentId }).sort({ createdAt: -1 }).catch(() => []);
    } else {
      predictions = memoryPredictions.filter(p => p.studentId === student.studentId);
      interventions = memoryInterventions.filter(i => i.studentId === student.studentId);
    }

    if (req.user.role === 'Faculty' || req.user.role === 'Admin') {
      await createAuditEntry(req.user, 'VIEW_STUDENT_REPORT', student.studentId, `Faculty viewed student report for ${student.name}`, req);
    }

    return res.json({
      student,
      predictions,
      interventions
    });
  } catch (error) {
    console.error('getStudentById error:', error);
    return res.status(500).json({ message: 'Error retrieving student details.' });
  }
};

const createStudent = async (req, res) => {
  try {
    const body = req.body;
    if (!body.name || !body.studentId || !body.department) {
      return res.status(400).json({ message: 'Student ID, Name, and Department are required.' });
    }

    let student = null;
    body.lastUpdated = new Date();

    if (isDbConnected()) {
      try {
        student = await Student.create(body);
      } catch (dbErr) {
        student = { _id: `STU-${Date.now()}`, ...body };
        memoryStudents.unshift(student);
      }
    } else {
      student = { _id: `STU-${Date.now()}`, ...body };
      memoryStudents.unshift(student);
    }

    await createAuditEntry(req.user, 'CREATE_STUDENT', student.studentId, `Created student record for ${student.name}`, req);

    return res.status(201).json({ student });
  } catch (error) {
    console.error('createStudent error:', error);
    return res.status(500).json({ message: 'Error creating student record.' });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    let student = null;
    let idx = -1;

    if (isDbConnected()) {
      student = await Student.findOne({ studentId: id }).catch(() => null);
      if (!student) student = await Student.findById(id).catch(() => null);
    }

    if (!student) {
      idx = memoryStudents.findIndex(s => s.studentId === id || s._id === id);
      if (idx !== -1) student = memoryStudents[idx];
    }

    if (!student) {
      return res.status(404).json({ message: 'Student record not found.' });
    }

    if (req.user.role === 'Student' && req.user.studentId !== student.studentId) {
      return res.status(403).json({ message: 'Forbidden. You can only update your own student record.' });
    }

    updates.updatedAt = new Date();
    updates.lastUpdated = new Date();

    let updatedStudent = null;

    if (isDbConnected() && student.save) {
      try {
        updatedStudent = await Student.findByIdAndUpdate(student._id, { $set: updates }, { new: true, runValidators: true });
      } catch (dbErr) {}
    }

    if (!updatedStudent) {
      if (idx === -1) idx = memoryStudents.findIndex(s => s.studentId === id || s._id === id);
      if (idx !== -1) {
        memoryStudents[idx] = { ...memoryStudents[idx], ...updates };
        updatedStudent = memoryStudents[idx];
      } else {
        updatedStudent = { ...student, ...updates };
        memoryStudents.unshift(updatedStudent);
      }
    }

    await createAuditEntry(req.user, 'PROFILE_UPDATE', student.studentId, `Updated profile for ${student.name}`, req);

    return res.json({ student: updatedStudent });
  } catch (error) {
    console.error('updateStudent error:', error);
    return res.status(500).json({ message: 'Error updating student record.' });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    if (isDbConnected()) {
      await Student.findOneAndDelete({ studentId: id }).catch(() => null);
    }

    const idx = memoryStudents.findIndex(s => s.studentId === id || s._id === id);
    if (idx !== -1) memoryStudents.splice(idx, 1);

    await createAuditEntry(req.user, 'DELETE_STUDENT', id, `Deleted student record`, req);
    return res.json({ message: 'Student record successfully deleted.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting student record.' });
  }
};

// Document Upload
const uploadDocument = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });

    let student = null;
    let memIdx = -1;

    if (isDbConnected()) {
      student = await Student.findOne({ studentId: id }).catch(() => null);
    }
    if (!student) {
      memIdx = memoryStudents.findIndex(s => s.studentId === id || s._id === id);
      if (memIdx !== -1) student = memoryStudents[memIdx];
    }

    if (!student) return res.status(404).json({ message: 'Student record not found.' });

    if (req.user.role === 'Student' && req.user.studentId !== student.studentId) {
      return res.status(403).json({ message: 'Forbidden. You can only upload files to your own profile.' });
    }

    const docObj = {
      _id: `DOC-${Date.now()}`,
      type: req.body.type || 'cv',
      fileName: req.file.originalname,
      filePath: req.file.filename,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
      uploadedAt: new Date()
    };

    if (student.save) {
      student.documents.push(docObj);
      student.updatedAt = new Date();
      await student.save();
    } else {
      if (!student.documents) student.documents = [];
      student.documents.push(docObj);
      student.updatedAt = new Date();
    }

    await createAuditEntry(req.user, 'DOCUMENT_UPLOAD', student.studentId, `Uploaded document ${req.file.originalname}`, req);

    return res.status(201).json({ message: 'Document uploaded successfully.', document: docObj, student });
  } catch (error) {
    console.error('uploadDocument error:', error);
    return res.status(500).json({ message: 'Document upload failed: ' + error.message });
  }
};

// Certificate Upload
const uploadCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) return res.status(400).json({ message: 'No certificate file uploaded.' });

    const { title, organization, issueDate, description } = req.body;
    if (!title || !organization) {
      return res.status(400).json({ message: 'Certificate title and issuing organization are required.' });
    }

    let student = null;
    let memIdx = -1;

    if (isDbConnected()) {
      student = await Student.findOne({ studentId: id }).catch(() => null);
    }
    if (!student) {
      memIdx = memoryStudents.findIndex(s => s.studentId === id || s._id === id);
      if (memIdx !== -1) student = memoryStudents[memIdx];
    }

    if (!student) return res.status(404).json({ message: 'Student record not found.' });

    if (req.user.role === 'Student' && req.user.studentId !== student.studentId) {
      return res.status(403).json({ message: 'Forbidden. You can only upload certificates to your own profile.' });
    }

    const certObj = {
      _id: `CERT-${Date.now()}`,
      title,
      organization,
      issueDate: issueDate || '',
      description: description || '',
      fileName: req.file.originalname,
      filePath: req.file.filename,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
      uploadedAt: new Date()
    };

    if (student.save) {
      student.certificates.push(certObj);
      student.updatedAt = new Date();
      await student.save();
    } else {
      if (!student.certificates) student.certificates = [];
      student.certificates.push(certObj);
      student.updatedAt = new Date();
    }

    await createAuditEntry(req.user, 'CERTIFICATE_UPLOAD', student.studentId, `Uploaded certificate ${title}`, req);

    return res.status(201).json({ message: 'Certificate uploaded successfully.', certificate: certObj, student });
  } catch (error) {
    console.error('uploadCertificate error:', error);
    return res.status(500).json({ message: 'Certificate upload failed: ' + error.message });
  }
};

// Download File
const downloadFile = async (req, res) => {
  try {
    const { id, fileId } = req.params;
    let student = null;

    if (isDbConnected()) {
      student = await Student.findOne({ studentId: id }).catch(() => null);
    }
    if (!student) {
      student = memoryStudents.find(s => s.studentId === id || s._id === id);
    }

    if (!student) return res.status(404).json({ message: 'Student record not found.' });

    if (req.user.role === 'Student' && req.user.studentId !== student.studentId) {
      return res.status(403).json({ message: 'Forbidden. You cannot access files belonging to other students.' });
    }

    const docs = student.documents || [];
    const certs = student.certificates || [];
    const targetFile = docs.find(d => d._id?.toString() === fileId || d.id === fileId) ||
                       certs.find(c => c._id?.toString() === fileId || c.id === fileId);

    if (!targetFile) {
      return res.status(404).json({ message: 'Requested file record not found.' });
    }

    const filePath = path.join(__dirname, '../uploads', targetFile.filePath);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File asset does not exist on storage server.' });
    }

    res.setHeader('Content-Type', targetFile.mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${targetFile.fileName}"`);
    return res.sendFile(filePath);
  } catch (error) {
    console.error('downloadFile error:', error);
    return res.status(500).json({ message: 'Error retrieving file asset.' });
  }
};

// Delete File
const deleteFile = async (req, res) => {
  try {
    const { id, fileId } = req.params;
    const { fileType } = req.query;

    let student = null;
    if (isDbConnected()) {
      student = await Student.findOne({ studentId: id }).catch(() => null);
    }
    if (!student) {
      student = memoryStudents.find(s => s.studentId === id || s._id === id);
    }

    if (!student) return res.status(404).json({ message: 'Student record not found.' });

    if (req.user.role === 'Student' && req.user.studentId !== student.studentId) {
      return res.status(403).json({ message: 'Forbidden. You can only delete your own documents.' });
    }

    let deletedItem = null;

    if (fileType === 'certificate') {
      if (student.certificates) {
        const idx = student.certificates.findIndex(c => c._id?.toString() === fileId || c.id === fileId);
        if (idx !== -1) {
          deletedItem = student.certificates[idx];
          student.certificates.splice(idx, 1);
        }
      }
    } else {
      if (student.documents) {
        const idx = student.documents.findIndex(d => d._id?.toString() === fileId || d.id === fileId);
        if (idx !== -1) {
          deletedItem = student.documents[idx];
          student.documents.splice(idx, 1);
        }
      }
    }

    if (!deletedItem) return res.status(404).json({ message: 'File record not found.' });

    student.updatedAt = new Date();
    if (student.save) await student.save();

    const diskPath = path.join(__dirname, '../uploads', deletedItem.filePath);
    if (fs.existsSync(diskPath)) fs.unlinkSync(diskPath);

    await createAuditEntry(req.user, 'DELETE_FILE', student.studentId, `Deleted file ${deletedItem.fileName}`, req);

    return res.json({ message: 'File successfully deleted.', student });
  } catch (error) {
    console.error('deleteFile error:', error);
    return res.status(500).json({ message: 'Error deleting file.' });
  }
};

module.exports = {
  getStudents,
  getMeStudent,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  uploadDocument,
  uploadCertificate,
  downloadFile,
  deleteFile
};
