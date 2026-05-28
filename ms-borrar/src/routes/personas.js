const express = require('express');
const router = express.Router();
const { buscarPersona, borrarPersona } = require('../controllers/personas');

router.get('/:nro_documento', buscarPersona);
router.delete('/:nro_documento', borrarPersona);

module.exports = router;