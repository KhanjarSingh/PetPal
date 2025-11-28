const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const { registerFCMToken, scheduleReminder, getUserReminders } = require('../controllers/notificationController');

router.post('/register-token', authenticateToken, registerFCMToken);
router.post('/schedule-reminder', authenticateToken, scheduleReminder);
router.get('/reminders', authenticateToken, getUserReminders);

module.exports = router;