const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api')(express);

const app = express();

app.use(cors());
app.use(express.json());

require('./utils/ping');

app.use(express.static('dist'));

app.use('/api', apiRoutes);

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
