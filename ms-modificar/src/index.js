const express = require('express');
const personaRoutes = require('./routes/persona.routes');

const app = express();
app.use(express.json());
app.use('/', personaRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`ms-modificar corriendo en puerto ${PORT}`);
});