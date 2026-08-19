const AuditLog = require('../models/AuditLog');
const { memoryAuditLogs, isDbConnected } = require('../utils/dataStore');

const getAuditLogs = async (req, res) => {
  try {
    const { limit = 50, page = 1 } = req.query;

    if (isDbConnected()) {
      try {
        const logs = await AuditLog.find({})
          .sort({ timestamp: -1 })
          .skip((Number(page) - 1) * Number(limit))
          .limit(Number(limit));

        const total = await AuditLog.countDocuments({});

        return res.json({
          total,
          page: Number(page),
          totalPages: Math.ceil(total / Number(limit)) || 1,
          logs
        });
      } catch (dbErr) {}
    }

    const total = memoryAuditLogs.length;
    const startIndex = (Number(page) - 1) * Number(limit);
    const paginated = memoryAuditLogs.slice(startIndex, startIndex + Number(limit));

    return res.json({
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)) || 1,
      logs: paginated
    });
  } catch (error) {
    console.error('getAuditLogs error:', error);
    return res.status(500).json({ message: 'Error retrieving audit logs.' });
  }
};

module.exports = { getAuditLogs };
