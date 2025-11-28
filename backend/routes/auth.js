const express = require('express');
const router = express.Router();
const { registerUser, loginUser, verifyGoogleToken } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-token', verifyGoogleToken);

module.exports = router;