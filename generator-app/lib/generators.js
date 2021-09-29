const fs = require('fs');
const parse = require('csv-parse/lib/sync');
const configProvider = require('../../common-lib/configProvider');
const backlinksDB = require('../../common-lib/backlinksDB');
const utils = require('./utils');

let config = {};

//
// Site has config.sitePagesCount pages with URL /123, where 123 is pageIndex number counted from 0 to sitePageCount-1.
// For each url we calculate pageHashIndex, which is CRC32(pageURL), that is integer. This integer is used as random
// seed for content generator and also from backlink selection. We take target link as links[pageHashIndex % links.count].
//

const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

module.exports = {
    init() {
        config = configProvider.get();
        backlinksDB.init(config);
    },

    getURLForPage(pageIndex, host) {
        host = host || "";
        return host + "/" + pageIndex;
    },

    getTitle(url, hashIndex) {
        // get words from url
        const urlWords = []; // url.replace(/[^a-zA-Z]+/g, ' ').trim().split(' ');
        // get random words
        const hashWords = utils.getSHA512('pageWithIndex' + hashIndex).replace(/[^a-zA-Z]+/g, ' ').trim().split(' ');;

        const words = urlWords.slice(0, 3).concat(hashWords.slice(0, 3));
        return capitalize(words.join(' ').toLowerCase().trim());
    },

    generateParagraph(hashIndex, paragraphIndex) {
        // TODO mají se měnit v čase
        let text = '';
        let hashWords = [];
        for (var i = 0; i < 5; i++) {
            hashWords = utils.getSHA512(i + "lorem ipsum " + hashIndex + " lorem ipsum " + paragraphIndex + ".")
                    .replace(/[^a-zA-Z]+/g, ' ').trim().split(' ');
            text += capitalize(hashWords.join(' ').toLowerCase() + '. ');
        }
        return text; 
    },
    
    getImage(hashIndex) {
        let domain = config.domains.images || '';
        return domain + '/img/' + hashIndex;
    },

    getParagraphs(hashIndex) {
        const paragraphs = [];
        for (var i = 0; i < config.pageParagraphsCount; i++) {
            paragraphs.push( this.generateParagraph(hashIndex, i) );
        }
        return paragraphs;
    },

    getInternalLinks(hashIndex, host) {
        const internalLinks = [];
        for (var i = 0; i < config.pageInternalLinksCount; i++) {
            const linkedPageIndex = (hashIndex + 1 + i) % config.sitePagesCount;
            const linkRelative = this.getURLForPage(linkedPageIndex, "");
            const linkAbsolute = this.getURLForPage(linkedPageIndex, host);
            const linkedPageHashIndex = utils.getPageHashIndexFromURL(linkAbsolute);

            internalLinks.push({
                link: linkRelative,
                anchorText: this.getTitle(linkAbsolute, linkedPageHashIndex),
                paragraphs: this.getParagraphs(linkedPageHashIndex)
            });
        }
        return internalLinks;
    }
}