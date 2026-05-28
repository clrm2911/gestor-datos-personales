const express = require('express');
const router = express.Router();
const { buscarPersona, borrarPersona } = require('../controllers/personas');
const { extraerUsuario } = require('../middleware/usuario');

router.get('/:nro_documento', extraerUsuario, buscarPersona);
router.delete('/:nro_documento', extraerUsuario, borrarPersona);

module.exports = router;