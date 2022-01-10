const express = require('express');
const router = express.Router();

const configProvider = require('../../common-lib/configProvider');
var generators = require('../lib/generators');

router.get('/', function(req, res, next) {
    console.log('Reloading config ... ');
    try {
        configProvider.reload();
        generators.init();
        next();
    } catch(err) {
        res.send('Error during reload: ' + err.message);
    }
});

module.exports = router;