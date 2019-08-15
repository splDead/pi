const evemarketer = require('../evemarketer');

module.exports = (express) => {
    const router = express.Router();

    router.route('/getPrices')
        .post((req, res) => {
            evemarketer(req.body.systemId)
                .then(response => {
                    res.json(response);
                }
            );
    });

    return router;
};
