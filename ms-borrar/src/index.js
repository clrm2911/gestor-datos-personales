const express = require('express');
const app = express();

app.use(express.json());
app.use('/borrar', require('./routes/personas'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`ms-borrar corriendo en puerto ${PORT}`));