const express = require('express');
const router = express.Router();
const { consultarLog } = require('../controllers/log');

router.get('/', consultarLog);

module.exports = router;