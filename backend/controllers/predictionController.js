const axios = require('axios');
const Prediction = require('../models/Prediction');
const Student = require('../models/Student');
const AuditLog = require('../models/AuditLog');
const { calculateHeuristicPrediction } = require('../utils/heuristicPredictor');
const { memoryStudents, memoryPredictions, memoryAuditLogs, isDbConnected } = require('../utils/dataStore');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

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

const calculateDataCompleteness = (student) => {
  if (!student) return { percentage: 0, academic: 0, attendance: 0, learning: 0, profile: 0 };
  let score = 0;

  const hasAcademic = (student.academicRecords?.currentCpi !== null && student.academicRecords?.currentCpi !== undefined) ||
                      (student.academicRecords?.currentSpi !== null && student.academicRecords?.currentSpi !== undefined) ||
                      (student.currentGpa !== undefined && student.currentGpa !== null);
  if (hasAcademic) score += 25;

  const hasAttendance = (student.attendanceRecords?.overallAttendance !== null && student.attendanceRecords?.overallAttendance !== undefined) ||
                        (student.attendance !== undefined && student.attendance !== null);
  if (hasAttendance) score += 25;

  const hasLearning = (student.learningBehavior?.lmsActivity !== null && student.learningBehavior?.lmsActivity !== undefined) ||
                      (student.learningBehavior?.assignmentCompletion !== null && student.learningBehavior?.assignmentCompletion !== undefined) ||
                      (student.assignmentCompletion !== undefined && student.assignmentCompletion !== null);
  if (hasLearning) score += 25;

  const hasProfile = Boolean(student.name && student.studentId && student.department && student.semester);
  if (hasProfile) score += 25;

  return {
    percentage: score,
    academic: hasAcademic ? 100 : 0,
    attendance: hasAttendance ? 100 : 0,
    learning: hasLearning ? 100 : 0,
    profile: hasProfile ? 100 : 0
  };
};

const createPrediction = async (req, res) => {
  try {
    const { studentId } = req.body;
    let studentData = req.body;

    let studentDoc = null;
    if (studentId) {
      if (isDbConnected()) {
        studentDoc = await Student.findOne({ studentId }).catch(() => null);
        if (!studentDoc) studentDoc = await Student.findById(studentId).catch(() => null);
      }
      if (!studentDoc) {
        studentDoc = memoryStudents.find(s => s.studentId === studentId || s._id === studentId);
      }
    }

    if (studentDoc) {
      studentData = {
        studentId: studentDoc.studentId,
        name: studentDoc.name,
        attendance: studentDoc.attendanceRecords?.overallAttendance ?? studentDoc.attendance ?? null,
        currentGpa: studentDoc.academicRecords?.currentCpi ?? studentDoc.academicRecords?.overallCgpa ?? studentDoc.currentGpa ?? null,
        previousGpa: studentDoc.academicRecords?.currentSpi ?? studentDoc.previousGpa ?? null,
        assignmentCompletion: studentDoc.learningBehavior?.assignmentCompletion ?? studentDoc.assignmentCompletion ?? null,
        quizScore: studentDoc.learningBehavior?.quizScore ?? studentDoc.quizScore ?? null,
        lmsActivity: studentDoc.learningBehavior?.lmsActivity ?? studentDoc.lmsActivity ?? null,
        studyHours: studentDoc.learningBehavior?.studyHours ?? studentDoc.studyHours ?? null,
        failedSubjects: studentDoc.academicRecords?.failedSubjects ?? studentDoc.failedSubjects ?? 0,
        backlogCount: studentDoc.academicRecords?.backlogCount ?? studentDoc.backlogCount ?? 0,
        engagementScore: studentDoc.learningBehavior?.engagementScore ?? studentDoc.engagementScore ?? null,
        attendanceTrend: studentDoc.attendanceRecords?.attendanceTrend ?? 0,
        academicTrend: 0
      };
    }

    const completeness = calculateDataCompleteness(studentDoc || studentData);
    if (completeness.percentage < 40) {
      return res.status(400).json({
        message: 'More student data is required for a reliable analysis.',
        completeness,
        requiredFields: ['Attendance Data', 'Academic CPI/SPI', 'Learning Engagement']
      });
    }

    let predictionResult = null;

    try {
      const mlPayload = {
        student_id: studentData.studentId || 'STU000',
        attendance_percentage: Number(studentData.attendance ?? 75),
        current_gpa: Number(studentData.currentGpa ?? 7.0),
        previous_gpa: Number(studentData.previousGpa ?? 7.0),
        assignment_completion: Number(studentData.assignmentCompletion ?? 75),
        quiz_score: Number(studentData.quizScore ?? 75),
        lms_activity: Number(studentData.lmsActivity ?? 60),
        study_hours: Number(studentData.studyHours ?? 10),
        failed_subjects: Number(studentData.failedSubjects ?? 0),
        backlog_count: Number(studentData.backlogCount ?? 0),
        engagement_score: Number(studentData.engagementScore ?? 70),
        scholarship_status: false,
        financial_support_needed: false,
        attendance_trend: Number(studentData.attendanceTrend ?? 0),
        academic_trend: Number(studentData.academicTrend ?? 0)
      };

      const mlRes = await axios.post(`${ML_SERVICE_URL}/predict`, mlPayload, { timeout: 3500 });
      predictionResult = mlRes.data;
    } catch (mlErr) {
      predictionResult = calculateHeuristicPrediction(studentData);
    }

    const positiveIndicators = [];
    if ((studentData.attendance ?? 0) >= 80) {
      positiveIndicators.push("High regular attendance (≥80%)");
    }
    if ((studentData.currentGpa ?? 0) >= 7.5) {
      positiveIndicators.push("Strong cumulative academic CPI (≥7.5)");
    }
    if ((studentData.assignmentCompletion ?? 0) >= 80) {
      positiveIndicators.push("Consistent and timely assignment submissions");
    }
    if ((studentData.failedSubjects ?? 0) === 0 && (studentData.backlogCount ?? 0) === 0) {
      positiveIndicators.push("Zero active backlogs or failed subjects");
    }
    if (positiveIndicators.length === 0) {
      positiveIndicators.push("Active participation in institutional curriculum");
    }

    const responseData = {
      _id: `PRED-${Date.now()}`,
      studentId: studentData.studentId || 'STU000',
      riskScore: predictionResult.risk_score,
      riskLevel: predictionResult.risk_level,
      confidence: predictionResult.confidence || 88.0,
      completeness,
      riskFactors: (predictionResult.risk_factors || []).map(rf => ({
        factor: rf.factor,
        impact: rf.impact,
        value: rf.value !== undefined ? String(rf.value) : '',
        description: rf.description || ''
      })),
      positiveIndicators,
      recommendations: predictionResult.recommended_interventions || [],
      disclaimer: "AI-generated risk assessments are intended to support educators in identifying students who may benefit from additional support. They are not definitive predictions of a student's future and should not be used as the sole basis for academic decisions.",
      modelVersion: predictionResult.model_version || 'v1.0.0',
      createdAt: new Date()
    };

    if (isDbConnected()) {
      await Prediction.create(responseData).catch(() => memoryPredictions.unshift(responseData));
    } else {
      memoryPredictions.unshift(responseData);
    }

    if (studentDoc) {
      studentDoc.riskScore = responseData.riskScore;
      studentDoc.riskLevel = responseData.riskLevel;
      studentDoc.lastUpdated = new Date();
      if (studentDoc.save) await studentDoc.save();
    }

    await createAuditEntry(req.user, 'AI_PREDICTION_GENERATED', studentData.studentId, `Generated AI Risk Analysis for ${studentData.studentId}`, req);

    return res.json(responseData);
  } catch (error) {
    console.error('Prediction controller error:', error);
    return res.status(500).json({ message: 'Error processing student prediction.' });
  }
};

const getStudentPredictions = async (req, res) => {
  try {
    const { studentId } = req.params;
    let predictions = [];
    if (isDbConnected()) {
      predictions = await Prediction.find({ studentId }).sort({ createdAt: -1 }).catch(() => []);
    }
    if (!predictions || predictions.length === 0) {
      predictions = memoryPredictions.filter(p => p.studentId === studentId);
    }
    return res.json(predictions || []);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching predictions.' });
  }
};

module.exports = { createPrediction, getStudentPredictions };
