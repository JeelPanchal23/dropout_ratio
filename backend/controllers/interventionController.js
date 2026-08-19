const Intervention = require('../models/Intervention');
const Student = require('../models/Student');
const AuditLog = require('../models/AuditLog');
const { memoryInterventions, memoryStudents, memoryAuditLogs, isDbConnected } = require('../utils/dataStore');

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

const getInterventions = async (req, res) => {
  try {
    const { status, priority, studentId, search } = req.query;

    if (isDbConnected()) {
      try {
        let query = {};
        if (status && status !== 'All') query.status = status;
        if (priority && priority !== 'All') query.priority = priority;

        if (req.user.role === 'Student') {
          query.studentId = req.user.studentId;
        } else if (studentId) {
          query.studentId = studentId;
        }

        if (search) {
          query.$or = [
            { studentName: { $regex: search, $options: 'i' } },
            { studentId: { $regex: search, $options: 'i' } },
            { type: { $regex: search, $options: 'i' } }
          ];
        }

        const list = await Intervention.find(query).sort({ createdAt: -1 });
        return res.json(list || []);
      } catch (dbErr) {}
    }

    let list = [...memoryInterventions];
    if (req.user.role === 'Student') {
      list = list.filter(i => i.studentId === req.user.studentId);
    } else if (studentId) {
      list = list.filter(i => i.studentId === studentId);
    }

    if (status && status !== 'All') list = list.filter(i => i.status === status);
    if (priority && priority !== 'All') list = list.filter(i => i.priority === priority);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(i => 
        (i.studentName && i.studentName.toLowerCase().includes(q)) ||
        (i.studentId && i.studentId.toLowerCase().includes(q)) ||
        (i.type && i.type.toLowerCase().includes(q))
      );
    }

    return res.json(list);
  } catch (error) {
    console.error('getInterventions error:', error);
    return res.status(500).json({ message: 'Error retrieving interventions.' });
  }
};

const createIntervention = async (req, res) => {
  try {
    const { studentId, type, reason, assignedTo, priority, notes, dueDate } = req.body;

    if (!studentId || !type) {
      return res.status(400).json({ message: 'Student ID and Intervention Type are required.' });
    }

    let studentName = 'Student Record';
    let department = 'General';

    let st = null;
    if (isDbConnected()) {
      st = await Student.findOne({ studentId }).catch(() => null);
    }
    if (!st) {
      st = memoryStudents.find(s => s.studentId === studentId || s._id === studentId);
    }

    if (st) {
      studentName = st.name;
      department = st.department;
    }

    const payload = {
      _id: `INT-${Date.now()}`,
      studentId,
      studentName,
      department,
      type,
      reason: reason || 'Academic & Attendance Risk Support',
      assignedTo: assignedTo || st?.assignedMentor || 'Faculty Advisor',
      priority: priority || 'Medium',
      status: 'Assigned',
      notes: notes || '',
      dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      outcome: 'Assigned to student',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    let created = null;

    if (isDbConnected()) {
      try {
        created = await Intervention.create(payload);
      } catch (dbErr) {
        created = payload;
        memoryInterventions.unshift(payload);
      }
    } else {
      created = payload;
      memoryInterventions.unshift(payload);
    }

    await createAuditEntry(req.user, 'INTERVENTION_CREATED', studentId, `Created ${type} intervention for ${studentName}`, req);

    return res.status(201).json(created);
  } catch (error) {
    console.error('createIntervention error:', error);
    return res.status(500).json({ message: 'Error creating intervention.' });
  }
};

const updateIntervention = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    updates.updatedAt = new Date();

    let updated = null;
    if (isDbConnected()) {
      updated = await Intervention.findByIdAndUpdate(id, updates, { new: true }).catch(() => null);
    }

    if (!updated) {
      const idx = memoryInterventions.findIndex(i => i._id === id || i.id === id);
      if (idx !== -1) {
        memoryInterventions[idx] = { ...memoryInterventions[idx], ...updates };
        updated = memoryInterventions[idx];
      }
    }

    if (!updated) {
      return res.status(404).json({ message: 'Intervention not found.' });
    }

    await createAuditEntry(req.user, 'INTERVENTION_UPDATED', updated.studentId, `Updated intervention status to ${updated.status}`, req);

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating intervention.' });
  }
};

module.exports = {
  getInterventions,
  createIntervention,
  updateIntervention
};
