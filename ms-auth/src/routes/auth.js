const express = require('express');
const router = express.Router();
const { validarToken } = require('../controllers/auth');

router.get('/auth/validate', validarToken);

module.exports = router;
