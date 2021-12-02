const express = require('express');
const router = express.Router();

const configProvider = require('../../common-lib/configProvider');
const backlinksDB = require('../../common-lib/backlinksDB');
const generators = require('../lib/generators');
const utils = require('../lib/utils');

router.get('/*', function(req, res, next) {
    const host = req.protocol + '://' + req.get('host');
    const myURL = host + req.originalUrl;
    const pageHashIndex = utils.getPageHashIndexFromURL(myURL);
    const pageCRC32Index = utils.getCRC32(pageHashIndex);

    config = configProvider.get();

    const preferredDomainHost = 'https://' + config.domains.preferred;
    const canonicalURL = preferredDomainHost + req.originalUrl;
    const pageHeaderHTML = config.pageHeaderHTML;
    const metaDescription = generators.generateParagraph(pageHashIndex,123, false);
    const title = generators.getTitle(req.url, pageHashIndex);
    const imgSrc = generators.getImage(pageHashIndex);
    const paragraphs = generators.getParagraphs(pageHashIndex, true);
    const innerLinks = generators.getInternalLinks(pageCRC32Index, preferredDomainHost);
    const landingPageLink = backlinksDB.getTargetLink(pageCRC32Index);

    res.render('index', { canonicalURL, myURL, pageHeaderHTML, metaDescription, title, imgSrc, innerLinks, paragraphs, landingPageLink });
});

module.exports = router;
