const { PrismaClient } = require('@prisma/client');
const { validarCampos } = require('../validators/persona');

const prisma = new PrismaClient();

const modificarPersona = async (req, res) => {
  const usuario = req.usuario;
  const { nro_documento } = req.params;
  const data = req.body;

  if (!/^\d{1,10}$/.test(nro_documento)) {
    return res.status(400).json({ error: 'Número de documento inválido' });
  }

  if (req.file) {
    data.foto_path = req.file.originalname;
  }

  const errores = validarCampos(data);
  if (errores.length > 0) {
    try {
      await prisma.log.create({
        data: {
          tipo_operacion: 'MODIFICACION',
          nro_documento,
          resultado: 'ERROR',
          usuario,
          detalle: errores.join(', ')
        }
      });
    } catch (logError) {
      console.error('Error escribiendo log:', logError);
    }
    return res.status(400).json({ error: errores });
  }

  try {
    const existe = await prisma.persona.findUnique({
      where: { nro_documento }
    });

    if (!existe) {
      try {
        await prisma.log.create({
          data: {
            tipo_operacion: 'MODIFICACION',
            nro_documento,
            resultado: 'ERROR',
            usuario,
            detalle: 'Documento no encontrado'
          }
        });
      } catch (logError) {
        console.error('Error escribiendo log:', logError);
      }
      return res.status(404).json({ error: 'Documento no encontrado' });
    }

    const { nro_documento: _omit, ...updateData } = data;

    if (updateData.fecha_nacimiento) {
      updateData.fecha_nacimiento = new Date(updateData.fecha_nacimiento);
    }

    const persona = await prisma.persona.update({
      where: { nro_documento },
      data: updateData
    });

    try {
      await prisma.log.create({
        data: {
          tipo_operacion: 'MODIFICACION',
          nro_documento,
          resultado: 'EXITO',
          usuario,
          detalle: 'Persona modificada exitosamente'
        }
      });
    } catch (logError) {
      console.error('Error escribiendo log:', logError);
    }

    return res.status(200).json({ mensaje: 'Persona modificada exitosamente', persona });
  } catch (error) {
    try {
      await prisma.log.create({
        data: {
          tipo_operacion: 'MODIFICACION',
          nro_documento,
          resultado: 'ERROR',
          usuario,
          detalle: error.message
        }
      });
    } catch (logError) {
      console.error('Error escribiendo log:', logError);
    }
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { modificarPersona };