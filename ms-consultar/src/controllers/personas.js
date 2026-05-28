const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const consultarPersona = async (req, res) => {
  const { nro_documento } = req.params;
  const usuario = req.usuario;

  if (!/^\d{1,10}$/.test(nro_documento)) {
    return res.status(400).json({ error: 'Número de documento inválido' });
  }

  try {
    const persona = await prisma.Persona.findUnique({
      where: { nro_documento }
    });

    if (!persona) {
      await prisma.Log.create({
        data: {
          tipo_operacion: 'CONSULTA',
          nro_documento,
          resultado: 'ERROR',
          usuario,
          detalle: 'Persona no encontrada'
        }
      });
      return res.status(404).json({ error: 'Persona no encontrada' });
    }

    await prisma.Log.create({
      data: {
        tipo_operacion: 'CONSULTA',
        nro_documento,
        resultado: 'EXITO',
        usuario,
        detalle: 'Consulta realizada correctamente'
      }
    });

    return res.status(200).json(persona);
  } catch (error) {
    return res.status(500).json({ error: 'Error al consultar la persona' });
  }
};

module.exports = { consultarPersona };