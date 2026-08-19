const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  riskScore: { type: Number, required: true },
  riskLevel: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
  confidence: { type: Number, default: 85.0 },
  riskFactors: [{
    factor: { type: String, required: true },
    impact: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
    value: { type: mongoose.Schema.Types.Mixed },
    description: { type: String }
  }],
  recommendations: [{ type: String }],
  modelVersion: { type: String, default: 'v1.0.0' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Prediction', predictionSchema);
