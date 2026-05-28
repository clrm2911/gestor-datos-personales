const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const buscarPersona = async (req, res) => {
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
          tipo_operacion: 'BORRADO',
          nro_documento,
          resultado: 'ERROR',
          usuario,
          detalle: 'Persona no encontrada'
        }
      });
      return res.status(404).json({ error: 'Persona no encontrada' });
    }

    return res.status(200).json(persona);
  } catch (error) {
    return res.status(500).json({ error: 'Error al buscar la persona' });
  }
};

const borrarPersona = async (req, res) => {
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
          tipo_operacion: 'BORRADO',
          nro_documento,
          resultado: 'ERROR',
          usuario,
          detalle: 'Persona no encontrada al intentar borrar'
        }
      });
      return res.status(404).json({ error: 'Persona no encontrada' });
    }

    await prisma.Persona.delete({ where: { nro_documento } });

    await prisma.Log.create({
      data: {
        tipo_operacion: 'BORRADO',
        nro_documento,
        resultado: 'EXITO',
        usuario,
        detalle: 'Persona eliminada correctamente'
      }
    });

    return res.status(200).json({ mensaje: 'Persona eliminada correctamente' });
  } catch (error) {
    return res.status(500).json({ error: 'Error al eliminar la persona' });
  }
};

module.exports = { buscarPersona, borrarPersona };