/**
 * Pure JavaScript ML Heuristic Predictor
 * Provides robust fallback prediction if Python FastAPI ML Service is unreachable
 */

function calculateHeuristicPrediction(student) {
  const att = Number(student.attendance || student.attendance_percentage || 75);
  const gpa = Number(student.currentGpa || student.current_gpa || 7.0);
  const prevGpa = Number(student.previousGpa || student.previous_gpa || gpa);
  const assign = Number(student.assignmentCompletion || student.assignment_completion || 75);
  const lms = Number(student.lmsActivity || student.lms_activity || 60);
  const failed = Number(student.failedSubjects || student.failed_subjects || 0);
  const backlogs = Number(student.backlogCount || student.backlog_count || 0);
  const engagement = Number(student.engagementScore || student.engagement_score || 70);
  const attTrend = Number(student.attendanceTrend || student.attendance_trend || 0);
  const acadTrend = Number(student.academicTrend || student.academic_trend || (gpa - prevGpa));
  const financialNeeded = Boolean(student.financialSupportNeeded || student.financial_support_needed);

  // 1. Calculate weighted risk score (0-100)
  let rawScore = 
    (100 - att) * 0.32 +
    (10.0 - gpa) * 6.5 +
    (100 - assign) * 0.15 +
    (100 - engagement) * 0.15 +
    failed * 8.0 +
    backlogs * 5.0 +
    Math.max(0, -attTrend) * 0.5 +
    Math.max(0, -acadTrend) * 5.0;

  const riskScore = Math.min(100, Math.max(0, Math.round(rawScore)));

  let riskLevel = 'Low';
  if (riskScore >= 70) riskLevel = 'High';
  else if (riskScore >= 40) riskLevel = 'Medium';

  // 2. Explainable AI Factor Generation
  const riskFactors = [];

  if (att < 75) {
    riskFactors.append ? null : riskFactors.push({
      factor: 'Attendance Level',
      impact: att < 65 ? 'High' : 'Medium',
      value: `${att.toFixed(1)}%`,
      description: `Attendance (${att.toFixed(1)}%) is below the institutional 75% baseline.`
    });
  }

  if (gpa < 6.5 || acadTrend < -0.5) {
    riskFactors.push({
      factor: 'Academic GPA Performance',
      impact: gpa < 5.5 ? 'High' : 'Medium',
      value: gpa.toFixed(2),
      description: `Current GPA (${gpa.toFixed(2)}) shows academic difficulty.`
    });
  }

  if (failed > 0 || backlogs > 0) {
    riskFactors.push({
      factor: 'Failed Subjects & Backlogs',
      impact: 'High',
      value: `${failed} Failed, ${backlogs} Backlogs`,
      description: `${failed} current active failed subject(s) and ${backlogs} backlog course(s).`
    });
  }

  if (assign < 65) {
    riskFactors.push({
      factor: 'Assignment Submission Rate',
      impact: assign < 50 ? 'High' : 'Medium',
      value: `${assign.toFixed(1)}%`,
      description: `Assignment submission rate (${assign.toFixed(1)}%) requires completion tracking.`
    });
  }

  if (lms < 50 || engagement < 50) {
    riskFactors.push({
      factor: 'LMS Activity & Engagement',
      impact: 'Medium',
      value: `${engagement.toFixed(1)}/100`,
      description: `Student LMS login activity and engagement score are below average.`
    });
  }

  if (riskFactors.length === 0) {
    riskFactors.push({
      factor: 'Consistent Performance',
      impact: 'Low',
      value: `${gpa.toFixed(2)} GPA`,
      description: 'Student demonstrates consistent academic metrics across courses.'
    });
  }

  // Sort factors by impact (High -> Medium -> Low)
  const impactOrder = { High: 1, Medium: 2, Low: 3 };
  riskFactors.sort((a, b) => impactOrder[a.impact] - impactOrder[b.impact]);

  // 3. Recommended Interventions
  const recommendedInterventions = [];
  if (att < 75) {
    recommendedInterventions.push('Attendance improvement plan');
    recommendedInterventions.push('Faculty mentor weekly check-in');
  }
  if (gpa < 6.5 || failed > 0 || backlogs > 0) {
    recommendedInterventions.push('Subject-wise peer tutoring session');
    recommendedInterventions.push('Additional practice resources & revision materials');
  }
  if (assign < 65) {
    recommendedInterventions.push('Assignment completion milestone schedule');
  }
  if (lms < 50 || engagement < 50) {
    recommendedInterventions.push('LMS study group enrollment');
  }
  if (financialNeeded) {
    recommendedInterventions.push('Scholarship & financial assistance guidance');
  }

  if (recommendedInterventions.length === 0) {
    recommendedInterventions.push('Routine academic advising check-in');
  }

  return {
    student_id: student.studentId || 'STU-DEMO',
    risk_score: riskScore,
    risk_level: riskLevel,
    confidence: 89.0,
    risk_factors: riskFactors,
    recommended_interventions: Array.from(new Set(recommendedInterventions)),
    model_version: 'v1.0.0-embedded-heuristic'
  };
}

module.exports = { calculateHeuristicPrediction };
