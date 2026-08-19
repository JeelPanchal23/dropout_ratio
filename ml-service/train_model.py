import os
import json
import numpy as np
import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

def generate_synthetic_data(n_samples=1500, random_state=42):
    np.random.seed(random_state)
    
    attendance = np.clip(np.random.normal(78, 15, n_samples), 30, 100)
    current_gpa = np.clip(np.random.normal(7.2, 1.4, n_samples), 3.0, 10.0)
    previous_gpa = np.clip(current_gpa + np.random.normal(0.1, 0.6, n_samples), 3.0, 10.0)
    assignment_completion = np.clip(attendance * 0.7 + np.random.normal(20, 10, n_samples), 20, 100)
    quiz_score = np.clip(current_gpa * 9 + np.random.normal(5, 8, n_samples), 25, 100)
    lms_activity = np.clip(attendance * 0.6 + np.random.normal(25, 15, n_samples), 10, 100)
    study_hours = np.clip(current_gpa * 1.5 + np.random.normal(2, 2, n_samples), 1, 20)
    
    # Negative correlated indicators
    failed_subjects = np.where(current_gpa < 5.0, np.random.randint(1, 4, n_samples), np.random.choice([0, 1], n_samples, p=[0.85, 0.15]))
    backlog_count = np.where(failed_subjects > 0, failed_subjects + np.random.randint(0, 2, n_samples), np.random.choice([0, 1], n_samples, p=[0.9, 0.1]))
    
    engagement_score = np.clip((attendance * 0.4 + assignment_completion * 0.3 + lms_activity * 0.3), 10, 100)
    
    scholarship_status = np.random.choice([0, 1], n_samples, p=[0.7, 0.3])
    financial_support_needed = np.random.choice([0, 1], n_samples, p=[0.75, 0.25])
    
    attendance_trend = np.clip(np.random.normal(-2, 10, n_samples), -30, 30)
    academic_trend = np.clip(current_gpa - previous_gpa + np.random.normal(0, 0.3, n_samples), -3.0, 3.0)
    
    # Ground truth risk calculation formula (synthetic)
    risk_factor_score = (
        (100 - attendance) * 0.35 +
        (10.0 - current_gpa) * 6.5 +
        (100 - assignment_completion) * 0.15 +
        (100 - engagement_score) * 0.20 +
        failed_subjects * 8.0 +
        backlog_count * 5.0 +
        np.maximum(0, -attendance_trend) * 0.5 +
        np.maximum(0, -academic_trend) * 5.0
    )
    
    # Add minor noise
    risk_factor_score += np.random.normal(0, 4, n_samples)
    risk_score = np.clip(risk_factor_score, 0, 100)
    
    # Categorize into Low (0), Medium (1), High (2)
    # Low: < 40, Medium: 40-69, High: >= 70
    risk_level = np.where(risk_score < 40, 0, np.where(risk_score < 70, 1, 2))
    
    df = pd.DataFrame({
        'attendance_percentage': attendance,
        'current_gpa': current_gpa,
        'previous_gpa': previous_gpa,
        'assignment_completion': assignment_completion,
        'quiz_score': quiz_score,
        'lms_activity': lms_activity,
        'study_hours': study_hours,
        'failed_subjects': failed_subjects,
        'backlog_count': backlog_count,
        'engagement_score': engagement_score,
        'scholarship_status': scholarship_status,
        'financial_support_needed': financial_support_needed,
        'attendance_trend': attendance_trend,
        'academic_trend': academic_trend,
        'target_risk_level': risk_level,
        'continuous_risk_score': risk_score
    })
    return df

def train_and_save_model():
    print("Generating synthetic student dataset...")
    df = generate_synthetic_data(n_samples=2000)
    
    feature_cols = [
        'attendance_percentage', 'current_gpa', 'previous_gpa',
        'assignment_completion', 'quiz_score', 'lms_activity',
        'study_hours', 'failed_subjects', 'backlog_count',
        'engagement_score', 'scholarship_status', 'financial_support_needed',
        'attendance_trend', 'academic_trend'
    ]
    
    X = df[feature_cols]
    y = df['target_risk_level']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    clf = RandomForestClassifier(
        n_estimators=150,
        max_depth=12,
        random_state=42,
        class_weight='balanced'
    )
    clf.fit(X_train_scaled, y_train)
    
    y_pred = clf.predict(X_test_scaled)
    acc = float(accuracy_score(y_test, y_pred))
    prec = float(precision_score(y_test, y_pred, average='weighted'))
    rec = float(recall_score(y_test, y_pred, average='weighted'))
    f1 = float(f1_score(y_test, y_pred, average='weighted'))
    cm = confusion_matrix(y_test, y_pred).tolist()
    
    feature_importances = dict(zip(feature_cols, clf.feature_importances_.astype(float)))
    
    metrics = {
        'model': 'Random Forest Classifier',
        'version': 'v1.0.0',
        'dataset': 'Synthetic Demonstration Dataset (N=2000)',
        'accuracy': round(acc, 4),
        'precision': round(prec, 4),
        'recall': round(rec, 4),
        'f1_score': round(f1, 4),
        'confusion_matrix': cm,
        'feature_importances': feature_importances
    }
    
    os.makedirs('model', exist_ok=True)
    joblib.dump({
        'model': clf,
        'scaler': scaler,
        'feature_cols': feature_cols,
        'metrics': metrics
    }, 'model/dropout_model.joblib')
    
    with open('model/metrics.json', 'w') as f:
        json.dump(metrics, f, indent=2)
        
    print("Model trained and saved successfully!")
    print(f"Accuracy: {acc*100:.2f}%, F1-Score: {f1*100:.2f}%")

if __name__ == '__main__':
    train_and_save_model()
