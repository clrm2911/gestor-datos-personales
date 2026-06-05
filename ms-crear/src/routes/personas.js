const express = require('express');
const router = express.Router();
const { crearPersona } = require('../controllers/personas');
const { extraerUsuario } = require('../middleware/usuario');

router.post('/', extraerUsuario, crearPersona);

module.exports = router;