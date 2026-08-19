const Student = require('../models/Student');
const { calculateHeuristicPrediction } = require('../utils/heuristicPredictor');
const { memoryStudents } = require('./studentController');

const importCSV = async (req, res) => {
  try {
    const { students: rawList } = req.body;

    if (!rawList || !Array.isArray(rawList) || rawList.length === 0) {
      return res.status(400).json({ message: 'No student records provided for CSV import.' });
    }

    let successCount = 0;
    let failedCount = 0;
    let highRiskDetected = 0;
    const errors = [];
    const processedStudents = [];

    rawList.forEach((row, index) => {
      const lineNum = index + 1;
      const studentId = row.studentId || row['Student ID'] || row['student_id'] || `STU-CSV-${1000 + index}`;
      const name = row.name || row['Name'] || row['student_name'];
      const department = row.department || row['Department'] || 'Computer Engineering';
      const semester = Number(row.semester || row['Semester'] || 1);
      const attendance = Number(row.attendance || row['Attendance'] || row['attendance_percentage'] || 75);
      const currentGpa = Number(row.currentGpa || row['GPA'] || row['current_gpa'] || 7.0);
      const previousGpa = Number(row.previousGpa || row['Previous GPA'] || row['previous_gpa'] || currentGpa);
      const assignmentCompletion = Number(row.assignmentCompletion || row['Assignment %'] || 75);

      // Validations
      if (!name) {
        errors.push(`Row ${lineNum}: Student Name missing.`);
        failedCount++;
        return;
      }
      if (isNaN(attendance) || attendance < 0 || attendance > 100) {
        errors.push(`Row ${lineNum}: Attendance (${attendance}) outside valid 0-100% range.`);
        failedCount++;
        return;
      }
      if (isNaN(currentGpa) || currentGpa < 0 || currentGpa > 10) {
        errors.push(`Row ${lineNum}: GPA (${currentGpa}) outside valid 0.0-10.0 scale.`);
        failedCount++;
        return;
      }

      // Calculate ML Risk
      const pred = calculateHeuristicPrediction({
        studentId, name, department, semester, attendance, currentGpa, previousGpa, assignmentCompletion
      });

      if (pred.risk_level === 'High') highRiskDetected++;

      const stDoc = {
        studentId,
        name,
        email: row.email || `${name.toLowerCase().replace(/\s+/g, '.')}@university.edu`,
        department,
        semester,
        attendance,
        currentGpa,
        previousGpa,
        assignmentCompletion,
        lmsActivity: Number(row.lmsActivity || 65),
        failedSubjects: Number(row.failedSubjects || 0),
        backlogCount: Number(row.backlogCount || 0),
        engagementScore: Number(row.engagementScore || 70),
        scholarshipStatus: Boolean(row.scholarshipStatus),
        financialSupportNeeded: Boolean(row.financialSupportNeeded),
        riskScore: pred.risk_score,
        riskLevel: pred.risk_level,
        lastUpdated: new Date()
      };

      processedStudents.push(stDoc);
      successCount++;
    });

    // Save to DB / Memory
    for (const st of processedStudents) {
      try {
        await Student.findOneAndUpdate({ studentId: st.studentId }, st, { upsert: true, new: true });
      } catch (err) {
        const existingIdx = memoryStudents.findIndex(m => m.studentId === st.studentId);
        if (existingIdx !== -1) {
          memoryStudents[existingIdx] = { ...memoryStudents[existingIdx], ...st };
        } else {
          memoryStudents.unshift(st);
        }
      }
    }

    return res.json({
      summary: {
        totalRecords: rawList.length,
        successfullyImported: successCount,
        failedRecords: failedCount,
        highRiskDetected,
        errors
      },
      sampleImported: processedStudents.slice(0, 10)
    });
  } catch (error) {
    console.error('importCSV error:', error);
    return res.status(500).json({ message: 'Error processing bulk CSV import.' });
  }
};

module.exports = { importCSV };
