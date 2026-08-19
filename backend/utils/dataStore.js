const mongoose = require('mongoose');

// Shared memory store fallback when MongoDB is offline / disconnected
const memoryUsers = [];
const memoryStudents = [];
const memoryInterventions = [];
const memoryPredictions = [];
const memoryAuditLogs = [];

const isDbConnected = () => mongoose.connection.readyState === 1;

module.exports = {
  memoryUsers,
  memoryStudents,
  memoryInterventions,
  memoryPredictions,
  memoryAuditLogs,
  isDbConnected
};
