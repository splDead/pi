const fs = require('fs');
const evemarketer = require('../evemarketer');

module.exports = (express) => {
    const router = express.Router();

    router.route('/getPrices')
        .post((req, res) => {
            evemarketer(req.body.systemId)
                .then(response => {
                    res.json(response);
                })
                .catch(err => {
                    console.error(err.message);
                    res.status(err.statusCode).json({
                        message: err.message
                    });
                })
    });

    router.route('/getSystemIds')
        .post((req, res) => {
            const raw = fs.readFileSync('./server/dict/system-id.json');
            const ids = JSON.parse(raw);

            res.json(ids);
        });

    return router;
};
