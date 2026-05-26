const { PrismaClient } = require('@prisma/client');
const { validarPersona } = require('../validators/persona.validator');

const prisma = new PrismaClient();

const crearPersona = async (req, res) => {
  const usuario = req.usuario;
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

    try {
      await prisma.log.create({
        data: {
          tipo_operacion: 'CREACION',
          nro_documento: data.nro_documento,
          resultado: 'EXITO',
          usuario,
          detalle: 'Persona creada exitosamente'
        }
      });
    } catch (logError) {
      console.error('Error escribiendo log:', logError);
    }

    return res.status(201).json({ mensaje: 'Persona creada exitosamente', persona });
  } catch (error) {
    const detalle = error.code === 'P2002'
      ? 'El número de documento ya existe'
      : error.message;

    try {
      await prisma.log.create({
        data: {
          tipo_operacion: 'CREACION',
          nro_documento: data.nro_documento,
          resultado: 'ERROR',
          usuario,
          detalle
        }
      });
    } catch (logError) {
      console.error('Error escribiendo log:', logError);
    }

    const status = error.code === 'P2002' ? 409 : 500;
    return res.status(status).json({ error: detalle });
  }
};

module.exports = { crearPersona };