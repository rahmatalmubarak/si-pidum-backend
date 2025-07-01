const express = require('express');
const app = express();
const api = require('./routes/api');
app.use(express.json());
app.use('/api', api);

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
