const Student = require('../models/Student');
const Intervention = require('../models/Intervention');
const { memoryStudents, memoryInterventions, isDbConnected } = require('../utils/dataStore');

const getDashboardStats = async (req, res) => {
  try {
    let students = [];
    let interventions = [];

    if (isDbConnected()) {
      students = await Student.find({}).catch(() => []);
      interventions = await Intervention.find({}).catch(() => []);
    }

    if (!students || students.length === 0) {
      students = memoryStudents;
      interventions = memoryInterventions;
    }

    const totalStudents = students.length;
    const highRisk = students.filter(s => s.riskLevel === 'High').length;
    const mediumRisk = students.filter(s => s.riskLevel === 'Medium').length;
    const lowRisk = students.filter(s => s.riskLevel === 'Low').length;
    const pendingRisk = students.filter(s => !s.riskLevel || s.riskLevel === 'Pending').length;
    const activeInterventions = interventions.filter(i => ['Assigned', 'In Progress'].includes(i.status)).length;
    const completedInterventions = interventions.filter(i => i.status === 'Completed').length;

    const deptMap = {};
    students.forEach(s => {
      const dept = s.department || 'General';
      if (!deptMap[dept]) {
        deptMap[dept] = { department: dept, High: 0, Medium: 0, Low: 0, total: 0 };
      }
      if (s.riskLevel && deptMap[dept][s.riskLevel] !== undefined) {
        deptMap[dept][s.riskLevel] += 1;
      }
      deptMap[dept].total += 1;
    });

    const departmentAnalysis = Object.values(deptMap);

    const attendanceVsGpa = students.map(s => ({
      name: s.name,
      studentId: s.studentId,
      attendance: s.attendanceRecords?.overallAttendance ?? s.attendance ?? null,
      gpa: s.academicRecords?.currentCpi || s.academicRecords?.overallCgpa || s.currentGpa || null,
      riskLevel: s.riskLevel || 'Pending',
      riskScore: s.riskScore || 0
    })).filter(s => s.attendance !== null || s.gpa !== null);

    const topRiskFactors = totalStudents > 0 ? [
      {
        factor: 'Attendance Decline (<75%)',
        count: students.filter(s => (s.attendanceRecords?.overallAttendance ?? s.attendance ?? 100) < 75).length,
        percentage: Math.round((students.filter(s => (s.attendanceRecords?.overallAttendance ?? s.attendance ?? 100) < 75).length / totalStudents) * 100)
      },
      {
        factor: 'Academic Drop (CPI < 6.0)',
        count: students.filter(s => (s.academicRecords?.currentCpi ?? s.currentGpa ?? 10) < 6.0).length,
        percentage: Math.round((students.filter(s => (s.academicRecords?.currentCpi ?? s.currentGpa ?? 10) < 6.0).length / totalStudents) * 100)
      },
      {
        factor: 'Low LMS Activity (<50%)',
        count: students.filter(s => (s.learningBehavior?.lmsActivity ?? s.lmsActivity ?? 100) < 50).length,
        percentage: Math.round((students.filter(s => (s.learningBehavior?.lmsActivity ?? s.lmsActivity ?? 100) < 50).length / totalStudents) * 100)
      },
      {
        factor: 'Incomplete Assignments (<65%)',
        count: students.filter(s => (s.learningBehavior?.assignmentCompletion ?? s.assignmentCompletion ?? 100) < 65).length,
        percentage: Math.round((students.filter(s => (s.learningBehavior?.assignmentCompletion ?? s.assignmentCompletion ?? 100) < 65).length / totalStudents) * 100)
      },
      {
        factor: 'Active Subject Backlogs',
        count: students.filter(s => (s.academicRecords?.backlogCount ?? s.backlogCount ?? 0) > 0).length,
        percentage: Math.round((students.filter(s => (s.academicRecords?.backlogCount ?? s.backlogCount ?? 0) > 0).length / totalStudents) * 100)
      }
    ] : [];

    let aiInsights = [];
    if (totalStudents === 0) {
      aiInsights = ["No student data available yet. Register students to generate AI insights."];
    } else {
      const lowAttCount = students.filter(s => (s.attendanceRecords?.overallAttendance ?? s.attendance ?? 100) < 75).length;
      if (lowAttCount > 0) {
        aiInsights.push(`Attendance decline (<75%) is impacting ${lowAttCount} registered student(s).`);
      }
      if (highRisk > 0) {
        aiInsights.push(`${highRisk} student(s) currently flagged with high academic risk requiring faculty review.`);
      }
      if (activeInterventions > 0) {
        aiInsights.push(`${activeInterventions} active intervention(s) currently being monitored.`);
      }
      if (aiInsights.length === 0) {
        aiInsights.push("All registered students currently maintain satisfactory academic performance and attendance.");
      }
    }

    return res.json({
      stats: {
        totalStudents,
        highRisk,
        mediumRisk,
        lowRisk,
        pendingRisk,
        activeInterventions,
        completedInterventions
      },
      riskDistribution: [
        { name: 'Low Risk', value: lowRisk, color: '#10B981' },
        { name: 'Medium Risk', value: mediumRisk, color: '#F59E0B' },
        { name: 'High Risk', value: highRisk, color: '#EF4444' }
      ],
      departmentAnalysis,
      attendanceVsGpa,
      topRiskFactors,
      aiInsights
    });
  } catch (error) {
    console.error('getDashboardStats error:', error);
    return res.status(500).json({ message: 'Error compiling dashboard analytics.' });
  }
};

module.exports = { getDashboardStats };
