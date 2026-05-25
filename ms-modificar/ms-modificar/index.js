const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// Validaciones
function validarCampos(data) {
  const errores = [];

  const tiposValidos = ['Tarjeta de Identidad', 'Cédula'];
  if (data.tipo_documento && !tiposValidos.includes(data.tipo_documento)) {
    errores.push('tipo_documento debe ser Tarjeta de Identidad o Cédula');
  }

  if (data.primer_nombre && (/\d/.test(data.primer_nombre) || data.primer_nombre.length > 30)) {
    errores.push('primer_nombre no debe contener números y máximo 30 caracteres');
  }

  if (data.segundo_nombre && (/\d/.test(data.segundo_nombre) || data.segundo_nombre.length > 30)) {
    errores.push('segundo_nombre no debe contener números y máximo 30 caracteres');
  }

  if (data.apellidos && (/\d/.test(data.apellidos) || data.apellidos.length > 60)) {
    errores.push('apellidos no debe contener números y máximo 60 caracteres');
  }

  const generosValidos = ['Masculino', 'Femenino', 'No binario', 'Prefiero no reportar'];
  if (data.genero && !generosValidos.includes(data.genero)) {
    errores.push('genero debe ser Masculino, Femenino, No binario o Prefiero no reportar');
  }

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (data.correo_electronico && !regexEmail.test(data.correo_electronico)) {
    errores.push('correo_electronico debe tener formato válido');
  }

  if (data.celular && !/^\d{10}$/.test(data.celular)) {
    errores.push('celular debe ser numérico y exactamente 10 caracteres');
  }

  return errores;
}

// Endpoint modificar persona
app.put('/modificar/:nro_documento', async (req, res) => {
  const usuario = req.headers['x-usuario'] || 'desconocido';
  const { nro_documento } = req.params;
  const data = req.body;

  const errores = validarCampos(data);
  if (errores.length > 0) {
    await prisma.log.create({
      data: {
        tipo_operacion: 'MODIFICACION',
        nro_documento,
        resultado: 'ERROR',
        usuario,
        detalle: errores.join(', ')
      }
    });
    return res.status(400).json({ error: errores });
  }

  try {
    const existe = await prisma.persona.findUnique({
      where: { nro_documento }
    });

    if (!existe) {
      await prisma.log.create({
        data: {
          tipo_operacion: 'MODIFICACION',
          nro_documento,
          resultado: 'ERROR',
          usuario,
          detalle: 'Documento no encontrado'
        }
      });
      return res.status(404).json({ error: 'Documento no encontrado' });
    }

    const persona = await prisma.persona.update({
      where: { nro_documento },
      data: {
        ...data,
        fecha_nacimiento: data.fecha_nacimiento ? new Date(data.fecha_nacimiento) : undefined
      }
    });

    await prisma.log.create({
      data: {
        tipo_operacion: 'MODIFICACION',
        nro_documento,
        resultado: 'EXITO',
        usuario,
        detalle: 'Persona modificada exitosamente'
      }
    });

    return res.status(200).json({ mensaje: 'Persona modificada exitosamente', persona });
  } catch (error) {
    await prisma.log.create({
      data: {
        tipo_operacion: 'MODIFICACION',
        nro_documento,
        resultado: 'ERROR',
        usuario,
        detalle: error.message
      }
    });
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`ms-modificar corriendo en puerto ${PORT}`);
});