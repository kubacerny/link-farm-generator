const express = require('express');
const router = express.Router();

const configProvider = require('../lib/configProvider');
const backlinksDB = require('../lib/backlinksDB');
const utils = require('../lib/utils');

router.get('/*', function(req, res, next) {
    const pageHashIndex = utils.getPageHashIndexFromURL(req.url);

    config = configProvider.get();

    const pageHeaderHTML = config.pageHeaderHTML;
    const metaDescription = backlinksDB.generateParagraph(pageHashIndex,123);
    const title = backlinksDB.getTitle(req.url, pageHashIndex);
    const imgSrc = backlinksDB.getImage(pageHashIndex);
    const innerLinks = backlinksDB.getInternalLinks(pageHashIndex);
    const paragraphs = backlinksDB.getParagraphs(pageHashIndex);
    const landingPageLink = backlinksDB.getTargetLink(pageHashIndex);

    res.render('index', { pageHeaderHTML, metaDescription, title, imgSrc, innerLinks, paragraphs, landingPageLink });
});

module.exports = router;
