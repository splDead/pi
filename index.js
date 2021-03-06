const express = require('express');
const path = require('path');
const cors = require('cors');
const apiRoutes = require('./server/routes/api')(express);

const app = express();

app.use(cors());
app.use(express.json());

require('./server/utils/ping')();

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.use('/api', apiRoutes);

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);