const express = require('express');
const router = express.Router();
const { modificarPersona } = require('../controllers/persona.controller');
const { extraerUsuario } = require('../middleware/usuario');

router.put('/modificar/:nro_documento', extraerUsuario, modificarPersona);

module.exports = router;