const express = require('express');
const app = express();

app.use(express.json());
app.use('/consultar', require('./routes/personas'));

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log(`ms-consultar corriendo en puerto ${PORT}`));