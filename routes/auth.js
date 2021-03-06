const express = require('express');
const { signUp, login, forgotPassword, resetPassword, verifyEmail, resendVerificationLink, logout, token } = require('../controller/auth');
const { verifyToken } = require('../middlewares/tokenVerifier');
const router = express.Router();

router.post('/signUp', signUp); //register users
router.post('/login', login); //verifying users
router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword', verifyToken, resetPassword);
router.post('/verifyEmail', verifyEmail);
router.post('/resendVerificationLink', resendVerificationLink);
router.post('/logout', verifyToken, logout);
router.get('/tokenVerifier', verifyToken, token);

module.exports = router;