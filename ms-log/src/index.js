const express = require('express');
const app = express();

app.use(express.json());
app.use('/log', require('./routes/log'));

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`ms-log corriendo en puerto ${PORT}`));