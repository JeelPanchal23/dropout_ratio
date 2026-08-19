const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

dotenv.config();

// Disable Mongoose query buffering globally so operations don't hang when MongoDB is offline
mongoose.set('bufferCommands', false);

const authController = require('./controllers/authController');
const studentController = require('./controllers/studentController');
const predictionController = require('./controllers/predictionController');
const interventionController = require('./controllers/interventionController');
const dashboardController = require('./controllers/dashboardController');
const csvController = require('./controllers/csvController');
const reportsController = require('./controllers/reportsController');
const auditController = require('./controllers/auditController');

const { authenticateToken, requireRole, verifyStudentOwnership } = require('./middleware/authMiddleware');
const upload = require('./middleware/uploadMiddleware');
const { 
  apiLimiter, 
  authLimiter, 
  predictLimiter, 
  sanitizeInput, 
  configureHelmet 
} = require('./middleware/securityMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // Bind to 0.0.0.0 for LAN network sharing
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/edushield_db';

// 1. Security Headers Middleware (Helmet)
app.use(configureHelmet());

// 2. Cross-Origin Resource Sharing (CORS)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// 3. Body Parser & NoSQL Injection Protection
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(sanitizeInput);

// 4. Serve Static React Frontend Production Build
const frontendDist = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDist));

// 5. Rate Limiting Middleware
app.use('/api/', apiLimiter);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'EduShield AI Express Security Backend API',
    securityEnforced: true,
    mongoConnected: mongoose.connection.readyState === 1
  });
});

// Authentication Routes
app.post('/api/auth/register', authLimiter, authController.register);
app.post('/api/auth/login', authLimiter, authController.login);
app.get('/api/auth/me', authenticateToken, authController.getMe);

// Student Routes
app.get('/api/students/me', authenticateToken, studentController.getMeStudent);
app.get('/api/students', authenticateToken, requireRole('Admin', 'Faculty'), studentController.getStudents);
app.get('/api/students/:id', authenticateToken, verifyStudentOwnership, studentController.getStudentById);
app.post('/api/students', authenticateToken, requireRole('Admin', 'Faculty'), studentController.createStudent);
app.put('/api/students/:id', authenticateToken, verifyStudentOwnership, studentController.updateStudent);
app.delete('/api/students/:id', authenticateToken, requireRole('Admin', 'Faculty'), studentController.deleteStudent);

// Student File Management Routes (Documents & Certificates)
app.post('/api/students/:id/documents', authenticateToken, verifyStudentOwnership, upload.single('file'), studentController.uploadDocument);
app.post('/api/students/:id/certificates', authenticateToken, verifyStudentOwnership, upload.single('file'), studentController.uploadCertificate);
app.get('/api/students/:id/documents/:fileId', authenticateToken, verifyStudentOwnership, studentController.downloadFile);
app.delete('/api/students/:id/documents/:fileId', authenticateToken, verifyStudentOwnership, studentController.deleteFile);

// CSV Import Route
app.post('/api/students/import', authenticateToken, requireRole('Admin', 'Faculty'), csvController.importCSV);

// Prediction Routes
app.post('/api/predictions', authenticateToken, predictLimiter, predictionController.createPrediction);
app.get('/api/predictions/:studentId', authenticateToken, predictionController.getStudentPredictions);

// Intervention Routes
app.get('/api/interventions', authenticateToken, interventionController.getInterventions);
app.post('/api/interventions', authenticateToken, requireRole('Admin', 'Faculty'), interventionController.createIntervention);
app.put('/api/interventions/:id', authenticateToken, requireRole('Admin', 'Faculty'), interventionController.updateIntervention);

// Dashboard Analytics Routes
app.get('/api/dashboard/stats', authenticateToken, requireRole('Admin', 'Faculty'), dashboardController.getDashboardStats);

// Reports Routes
app.get('/api/reports/overview', authenticateToken, requireRole('Admin', 'Faculty'), reportsController.getOverviewReport);

// Audit Log Routes
app.get('/api/audit-logs', authenticateToken, requireRole('Admin', 'Faculty'), auditController.getAuditLogs);

// SPA Client-Side Routing Fallback (for React Router)
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(frontendDist, 'index.html'));
  }
});

// Connect to MongoDB with short 2.5s server selection timeout
mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 2500
})
  .then(() => console.log('✅ Connected to MongoDB database successfully.'))
  .catch((err) => {
    console.log('💡 MongoDB offline or unavailable: Running in memory storage fallback mode.');
  });

app.listen(PORT, HOST, () => {
  console.log(`🛡️ EduShield AI Security Server listening on http://${HOST}:${PORT}`);
});
