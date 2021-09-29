const express = require('express');
const router = express.Router();

const configProvider = require('../../common-lib/configProvider');
const backlinksDB = require('../../common-lib/backlinksDB');
const generators = require('../lib/generators');
const utils = require('../lib/utils');

router.get('/*', function(req, res, next) {
    const host = req.get('host');
    const myURL = host + req.originalUrl;
    const pageHashIndex = utils.getPageHashIndexFromURL(myURL);
    const pageCRC32Index = utils.getCRC32(pageHashIndex);

    config = configProvider.get();

    const pageHeaderHTML = config.pageHeaderHTML;
    const metaDescription = generators.generateParagraph(pageHashIndex,123);
    const title = generators.getTitle(req.url, pageHashIndex);
    const imgSrc = generators.getImage(pageCRC32Index);
    const paragraphs = generators.getParagraphs(pageHashIndex);
    const innerLinks = generators.getInternalLinks(pageCRC32Index, host);    
    const landingPageLink = backlinksDB.getTargetLink(pageCRC32Index);

    res.render('index', { myURL, pageHeaderHTML, metaDescription, title, imgSrc, innerLinks, paragraphs, landingPageLink });
});

module.exports = router;
