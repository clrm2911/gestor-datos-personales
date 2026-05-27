const express = require('express');
const router = express.Router();
const multer = require('multer');
const { crearPersona } = require('../controllers/persona.controller');
const { extraerUsuario } = require('../middleware/usuario');

const upload = multer({ limits: { fileSize: 2 * 1024 * 1024 } });

router.post('/crear', extraerUsuario, upload.single('foto'), crearPersona);

module.exports = router;