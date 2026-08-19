import os
import json
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import joblib

app = FastAPI(
    title="EduShield AI - Student Dropout Risk & Intervention ML API",
    description="Machine Learning Service for Academic Risk Scoring, Explainable AI Factor Breakdown, and Personalized Interventions",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model', 'dropout_model.joblib')
model_data = None

def load_ml_model():
    global model_data
    if os.path.exists(MODEL_PATH):
        try:
            model_data = joblib.load(MODEL_PATH)
            print("Loaded trained ML model successfully.")
        except Exception as e:
            print(f"Failed to load ML model: {e}")
    else:
        print("ML model file not found. Run train_model.py first.")

@app.on_event("startup")
def startup_event():
    load_ml_model()

class StudentData(BaseModel):
    student_id: Optional[str] = "STU000"
    attendance_percentage: float = Field(..., ge=0, le=100)
    current_gpa: float = Field(..., ge=0, le=10)
    previous_gpa: float = Field(..., ge=0, le=10)
    assignment_completion: float = Field(..., ge=0, le=100)
    quiz_score: float = Field(..., ge=0, le=100)
    lms_activity: float = Field(..., ge=0, le=100)
    study_hours: float = Field(..., ge=0, le=50)
    failed_subjects: int = Field(..., ge=0)
    backlog_count: int = Field(..., ge=0)
    engagement_score: float = Field(..., ge=0, le=100)
    scholarship_status: bool = False
    financial_support_needed: bool = False
    attendance_trend: float = Field(..., ge=-100, le=100)
    academic_trend: float = Field(..., ge=-10, le=10)

def compute_risk_details(data: StudentData):
    # 1. Base Score calculation combining ML probabilities (if model available) and domain heuristics
    att = data.attendance_percentage
    gpa = data.current_gpa
    prev_gpa = data.previous_gpa
    assign = data.assignment_completion
    lms = data.lms_activity
    failed = data.failed_subjects
    backlogs = data.backlog_count
    engagement = data.engagement_score
    att_trend = data.attendance_trend
    acad_trend = data.academic_trend

    # Calculate heuristic continuous risk (0 to 100)
    heuristic_score = (
        (100 - att) * 0.30 +
        (10.0 - gpa) * 6.0 +
        (100 - assign) * 0.15 +
        (100 - engagement) * 0.15 +
        failed * 7.5 +
        backlogs * 4.5 +
        max(0.0, -att_trend) * 0.4 +
        max(0.0, -acad_trend) * 4.5
    )
    
    heuristic_score = float(np.clip(heuristic_score, 0, 100))

    ml_prob_high = None
    confidence = 88.0

    if model_data is not None:
        try:
            clf = model_data['model']
            scaler = model_data['scaler']
            feature_cols = model_data['feature_cols']
            
            raw_features = np.array([[
                att, gpa, prev_gpa, assign, data.quiz_score, lms,
                data.study_hours, failed, backlogs, engagement,
                1 if data.scholarship_status else 0,
                1 if data.financial_support_needed else 0,
                att_trend, acad_trend
            ]])
            
            scaled_features = scaler.transform(raw_features)
            probs = clf.predict_proba(scaled_features)[0] # [Low, Med, High]
            
            ml_score = probs[0]*15.0 + probs[1]*50.0 + probs[2]*85.0
            heuristic_score = float(np.clip(ml_score * 0.6 + heuristic_score * 0.4, 0, 100))
            
            # Confidence based on max class probability
            confidence = float(round(float(np.max(probs)) * 100, 1))
        except Exception as e:
            print(f"ML model prediction error, using heuristic fallback: {e}")

    risk_score = int(round(heuristic_score))

    if risk_score >= 70:
        risk_level = "High"
    elif risk_score >= 40:
        risk_level = "Medium"
    else:
        risk_level = "Low"

    # 2. Dynamic Explainable AI Risk Factors
    factors = []
    
    if att < 75:
        impact = "High" if att < 65 else "Medium"
        factors.append({
            "factor": "Attendance",
            "impact": impact,
            "value": att,
            "description": f"Attendance level ({att:.1f}%) is below the required 75% threshold."
        })
    elif att_trend < -5:
        factors.append({
            "factor": "Attendance Trend",
            "impact": "Medium",
            "value": att_trend,
            "description": f"Recent attendance has declined by {abs(att_trend):.1f}%."
        })

    if gpa < 6.5 or acad_trend < -0.5:
        impact = "High" if gpa < 5.5 else "Medium"
        factors.append({
            "factor": "Academic Performance",
            "impact": impact,
            "value": gpa,
            "description": f"Current GPA ({gpa:.2f}) or academic trend ({acad_trend:+.2f}) indicates academic strain."
        })

    if failed > 0 or backlogs > 0:
        factors.append({
            "factor": "Backlogs & Failed Subjects",
            "impact": "High",
            "value": failed + backlogs,
            "description": f"{failed} current subject failure(s) and {backlogs} backlog(s) recorded."
        })

    if assign < 65:
        impact = "High" if assign < 50 else "Medium"
        factors.append({
            "factor": "Assignment Completion",
            "impact": impact,
            "value": assign,
            "description": f"Only {assign:.1f}% of course assignments submitted on time."
        })

    if lms < 50 or engagement < 50:
        factors.append({
            "factor": "Learning Engagement",
            "impact": "Medium",
            "value": engagement,
            "description": f"LMS activity ({lms:.1f}%) and engagement score ({engagement:.1f}%) below benchmark."
        })

    if not factors:
        factors.append({
            "factor": "Overall Performance",
            "impact": "Low",
            "value": gpa,
            "description": "Student displays stable academic indicators and regular engagement."
        })

    # Sort factors by impact (High -> Medium -> Low)
    impact_order = {"High": 1, "Medium": 2, "Low": 3}
    factors.sort(key=lambda x: impact_order.get(x["impact"], 4))

    # 3. Dynamic Personalized Interventions Engine
    interventions = []
    
    if att < 75 or att_trend < -5:
        interventions.extend([
            "Attendance improvement plan",
            "Faculty follow-up & schedule planning",
            "Mentor weekly check-in meeting"
        ])

    if gpa < 6.5 or failed > 0 or backlogs > 0 or acad_trend < -0.5:
        interventions.extend([
            "Subject-wise peer tutoring session",
            "Additional practice & study resources",
            "Faculty consultation for difficult modules"
        ])

    if assign < 65:
        interventions.extend([
            "Assignment submission reminder & milestone plan",
            "Academic study planner workshop"
        ])

    if lms < 50 or engagement < 50:
        interventions.extend([
            "LMS learning activity plan",
            "Group study project enrollment"
        ])

    if data.financial_support_needed:
        interventions.extend([
            "Scholarship & financial aid counselor referral",
            "Institutional learning resource textbook assistance"
        ])

    if not interventions:
        interventions.extend([
            "Quarterly academic progress check-in",
            "Advanced learning path & mentorship"
        ])

    # De-duplicate interventions
    unique_interventions = list(dict.fromkeys(interventions))

    return {
        "student_id": data.student_id,
        "risk_score": risk_score,
        "risk_level": risk_level,
        "confidence": confidence,
        "risk_factors": factors,
        "recommended_interventions": unique_interventions,
        "model_version": model_data['metrics']['version'] if model_data else "v1.0-heuristic"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "EduShield AI ML Service",
        "model_loaded": model_data is not None
    }

@app.get("/model-info")
def get_model_info():
    if model_data and 'metrics' in model_data:
        return model_data['metrics']
    return {
        "model": "Random Forest Classifier (Fallback)",
        "version": "v1.0.0",
        "status": "Heuristic engine operational"
    }

@app.post("/predict")
def predict_student_risk(data: StudentData):
    try:
        res = compute_risk_details(data)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict-batch")
def predict_batch(students: List[StudentData]):
    results = []
    for st in students:
        results.append(compute_risk_details(st))
    return {"count": len(results), "predictions": results}
