const express = require('express');
const router = express.Router();
const { crearPersona } = require('../controllers/persona.controller');
const { extraerUsuario } = require('../middleware/usuario');

router.post('/crear', extraerUsuario, crearPersona);

module.exports = router;