const express = require('express');
const apiRoutes = require('./routes/api')(express);

const app = express();

app.use(express.json());

require('./utils/ping');

app.use(express.static('dist'));

app.use('/api', apiRoutes);

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
