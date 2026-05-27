const express = require('express');
const router = express.Router();
const { consultarPersona } = require('../controllers/personas');

router.get('/:nro_documento', consultarPersona);

module.exports = router;