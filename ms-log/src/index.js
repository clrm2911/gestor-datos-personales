const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
app.use(express.json());

app.get('/log', async (req, res) => {
  const { tipo_operacion, nro_documento, fecha_desde, fecha_hasta, page = 1, limit = 10 } = req.query;

  try {
    const where = {};

    if (tipo_operacion) where.tipo_operacion = tipo_operacion;
    if (nro_documento) where.nro_documento = nro_documento;
    if (fecha_desde || fecha_hasta) {
      where.fecha_hora = {};
      if (fecha_desde) where.fecha_hora.gte = new Date(fecha_desde);
      if (fecha_hasta) where.fecha_hora.lte = new Date(fecha_hasta);
    }

    const total = await prisma.log.count({ where });

    const logs = await prisma.log.findMany({
      where,
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
      orderBy: { fecha_hora: 'desc' }
    });

    return res.status(200).json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      datos: logs
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error al consultar el log' });
  }
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`ms-log corriendo en puerto ${PORT}`));