const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// Validaciones
function validarPersona(data) {
  const errores = [];

  const tiposValidos = ['Tarjeta de Identidad', 'Cédula'];
  if (!tiposValidos.includes(data.tipo_documento)) {
    errores.push('tipo_documento debe ser Tarjeta de Identidad o Cédula');
  }

  if (!data.nro_documento || !/^\d{1,10}$/.test(data.nro_documento)) {
    errores.push('nro_documento debe ser numérico y máximo 10 caracteres');
  }

  if (!data.primer_nombre || /\d/.test(data.primer_nombre) || data.primer_nombre.length > 30) {
    errores.push('primer_nombre no debe contener números y máximo 30 caracteres');
  }

  if (data.segundo_nombre && (/\d/.test(data.segundo_nombre) || data.segundo_nombre.length > 30)) {
    errores.push('segundo_nombre no debe contener números y máximo 30 caracteres');
  }

  if (!data.apellidos || /\d/.test(data.apellidos) || data.apellidos.length > 60) {
    errores.push('apellidos no debe contener números y máximo 60 caracteres');
  }

  const generosValidos = ['Masculino', 'Femenino', 'No binario', 'Prefiero no reportar'];
  if (!generosValidos.includes(data.genero)) {
    errores.push('genero debe ser Masculino, Femenino, No binario o Prefiero no reportar');
  }

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.correo_electronico || !regexEmail.test(data.correo_electronico)) {
    errores.push('correo_electronico debe tener formato válido');
  }

  if (!data.celular || !/^\d{10}$/.test(data.celular)) {
    errores.push('celular debe ser numérico y exactamente 10 caracteres');
  }

  return errores;
}

// Endpoint crear persona
app.post('/crear', async (req, res) => {
  const usuario = req.headers['x-usuario'] || 'desconocido';
  const data = req.body;

  const errores = validarPersona(data);
  if (errores.length > 0) {
    await prisma.log.create({
      data: {
        tipo_operacion: 'CREACION',
        nro_documento: data.nro_documento || 'N/A',
        resultado: 'ERROR',
        usuario,
        detalle: errores.join(', ')
      }
    });
    return res.status(400).json({ error: errores });
  }

  try {
    const persona = await prisma.persona.create({
      data: {
        nro_documento: data.nro_documento,
        tipo_documento: data.tipo_documento,
        primer_nombre: data.primer_nombre,
        segundo_nombre: data.segundo_nombre || null,
        apellidos: data.apellidos,
        fecha_nacimiento: new Date(data.fecha_nacimiento),
        genero: data.genero,
        correo_electronico: data.correo_electronico,
        celular: data.celular,
        foto_path: data.foto_path || null
      }
    });

    await prisma.log.create({
      data: {
        tipo_operacion: 'CREACION',
        nro_documento: data.nro_documento,
        resultado: 'EXITO',
        usuario,
        detalle: 'Persona creada exitosamente'
      }
    });

    return res.status(201).json({ mensaje: 'Persona creada exitosamente', persona });
  } catch (error) {
    const detalle = error.code === 'P2002'
      ? 'El número de documento ya existe'
      : error.message;

    await prisma.log.create({
      data: {
        tipo_operacion: 'CREACION',
        nro_documento: data.nro_documento,
        resultado: 'ERROR',
        usuario,
        detalle
      }
    });

    const status = error.code === 'P2002' ? 409 : 500;
    return res.status(status).json({ error: detalle });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`ms-crear corriendo en puerto ${PORT}`);
});