const express = require('express');
const router = express.Router();
const multer = require('multer');
const { modificarPersona } = require('../controllers/personas');
const { extraerUsuario } = require('../middleware/usuario');

const upload = multer({ limits: { fileSize: 2 * 1024 * 1024 } });

router.put('/modificar/:nro_documento', extraerUsuario, upload.single('foto'), modificarPersona);

module.exports = router;