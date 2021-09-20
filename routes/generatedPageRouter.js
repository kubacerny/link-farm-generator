const express = require('express');
const router = express.Router();

const configProvider = require('../lib/configProvider');
const backlinksDB = require('../lib/backlinksDB');
const generators = require('../lib/generators');
const utils = require('../lib/utils');

router.get('/*', function(req, res, next) {
    const pageHashIndex = utils.getPageHashIndexFromURL(req.get('host') + req.originalUrl);
    const pageCRC32Index = utils.getCRC32(pageHashIndex);

    config = configProvider.get();

    const pageHeaderHTML = config.pageHeaderHTML;
    const metaDescription = generators.generateParagraph(pageHashIndex,123);
    const title = generators.getTitle(req.url, pageHashIndex);
    const imgSrc = generators.getImage(pageCRC32Index);
    const paragraphs = generators.getParagraphs(pageHashIndex);
    const innerLinks = generators.getInternalLinks(pageCRC32Index);    
    const landingPageLink = backlinksDB.getTargetLink(pageCRC32Index);

    res.render('index', { pageHeaderHTML, metaDescription, title, imgSrc, innerLinks, paragraphs, landingPageLink });
});

module.exports = router;
