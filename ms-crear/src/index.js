const express = require('express');
const personaRoutes = require('./routes/persona');

const app = express();
app.use(express.json());
app.use('/', personaRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`ms-crear corriendo en puerto ${PORT}`);
});