const express = require('express');
const router = express.Router();

const configProvider = require('../lib/configProvider');
const imageGenerator = require('../lib/imageGenerator');

router.get('/*', function(req, res, next) {
    imageGenerator.generateImage(req, res);
});

module.exports = router;
