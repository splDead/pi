const https = require('https');

module.exports = () => setInterval(function() {
    https.get('https://to-watch-series.herokuapp.com');
}, 300000); // every 5 minutes (300000)