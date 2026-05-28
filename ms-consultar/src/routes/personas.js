const express = require('express');
const router = express.Router();
const { consultarPersona } = require('../controllers/personas');
const { extraerUsuario } = require('../middleware/usuario');

router.get('/:nro_documento', extraerUsuario, consultarPersona);

module.exports = router;