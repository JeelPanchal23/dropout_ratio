const mongoose = require('mongoose');

const interventionSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  department: { type: String },
  type: { type: String, required: true },
  reason: { type: String, required: true },
  assignedTo: { type: String, required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  status: { 
    type: String, 
    enum: ['Recommended', 'Assigned', 'In Progress', 'Completed', 'Follow-up Required'], 
    default: 'Assigned' 
  },
  notes: { type: String, default: '' },
  dueDate: { type: Date },
  outcome: { type: String, default: 'Pending evaluation' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Intervention', interventionSchema);
