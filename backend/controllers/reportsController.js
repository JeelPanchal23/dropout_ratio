const Student = require('../models/Student');
const Intervention = require('../models/Intervention');
const { memoryStudents, memoryInterventions, isDbConnected } = require('../utils/dataStore');

const getOverviewReport = async (req, res) => {
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

    const total = students.length;
    const high = students.filter(s => s.riskLevel === 'High').length;
    const medium = students.filter(s => s.riskLevel === 'Medium').length;
    const low = students.filter(s => s.riskLevel === 'Low').length;

    const semMap = {};
    for (let s = 1; s <= 8; s++) {
      semMap[`Semester ${s}`] = { High: 0, Medium: 0, Low: 0, total: 0 };
    }
    students.forEach(st => {
      const semKey = `Semester ${st.semester || 1}`;
      if (semMap[semKey]) {
        if (st.riskLevel && semMap[semKey][st.riskLevel] !== undefined) {
          semMap[semKey][st.riskLevel] += 1;
        }
        semMap[semKey].total += 1;
      }
    });

    const deptMap = {};
    students.forEach(st => {
      const dept = st.department || 'General';
      if (!deptMap[dept]) {
        deptMap[dept] = { department: dept, High: 0, Medium: 0, Low: 0, total: 0, avgAttendance: 0, avgGpa: 0, sumAtt: 0, sumGpa: 0, countAtt: 0, countGpa: 0 };
      }
      if (st.riskLevel && deptMap[dept][st.riskLevel] !== undefined) {
        deptMap[dept][st.riskLevel] += 1;
      }
      deptMap[dept].total += 1;
      
      const att = st.attendanceRecords?.overallAttendance ?? st.attendance;
      if (att !== null && att !== undefined) {
        deptMap[dept].sumAtt += att;
        deptMap[dept].countAtt += 1;
      }

      const gpa = st.academicRecords?.currentCpi ?? st.academicRecords?.overallCgpa ?? st.currentGpa;
      if (gpa !== null && gpa !== undefined) {
        deptMap[dept].sumGpa += gpa;
        deptMap[dept].countGpa += 1;
      }
    });

    Object.values(deptMap).forEach(d => {
      d.avgAttendance = d.countAtt > 0 ? Number((d.sumAtt / d.countAtt).toFixed(1)) : 0;
      d.avgGpa = d.countGpa > 0 ? Number((d.sumGpa / d.countGpa).toFixed(2)) : 0;
      delete d.sumAtt;
      delete d.sumGpa;
      delete d.countAtt;
      delete d.countGpa;
    });

    return res.json({
      timestamp: new Date(),
      summary: {
        totalStudents: total,
        highRisk: high,
        highRiskPercentage: total > 0 ? Number(((high / total) * 100).toFixed(1)) : 0,
        mediumRisk: medium,
        mediumRiskPercentage: total > 0 ? Number(((medium / total) * 100).toFixed(1)) : 0,
        lowRisk: low,
        lowRiskPercentage: total > 0 ? Number(((low / total) * 100).toFixed(1)) : 0,
        activeInterventions: interventions.filter(i => ['Assigned', 'In Progress'].includes(i.status)).length,
        completedInterventions: interventions.filter(i => i.status === 'Completed').length
      },
      semesterAnalysis: semMap,
      departmentAnalysis: Object.values(deptMap)
    });
  } catch (error) {
    console.error('getOverviewReport error:', error);
    return res.status(500).json({ message: 'Error generating system report.' });
  }
};

module.exports = { getOverviewReport };
