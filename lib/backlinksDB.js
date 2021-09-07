const fs = require('fs');
const parse = require('csv-parse/lib/sync');
const configProvider = require('./configProvider');
const utils = require('./utils');

const requiredColumnNames = ['id', 'link', 'anchorText'];
let links = [];
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
        const csvUri = config.backlinksDBSource;

        try {
            const data = fs.readFileSync(csvUri, {encoding:'utf8', flag:'r'});
            links = parse(data, {
                columns: true
              });
        } catch (e) {
            if (e.code === 'ENOENT') {
                console.error('Backlinks DB file not found: ' + e.message);
            } else {
                console.error('Error when parsing backlinks db file "' + csvUri + '": ' + e.message);
            }
            throw e;
        }
        if (links.length <= 0) {
            console.error('Backlinks DB file contains no items.');
            throw new Error();
        } else {
            const firstItemColumnNames = Object.keys(links[0]);
            if (!(requiredColumnNames.every( k => firstItemColumnNames.includes(k) ))) {
                console.error('Backlinks DB file items have columns [' + firstItemColumnNames + 
                        '], but required column names are [id, link, anchorText]');
                throw new Error();
            }
        }
    },

    getURLForPage(pageIndex) {
        return "/" + pageIndex;
    },

    getTitle(url, hashIndex) {
        // get words from url
        const urlWords = url.replace(/[^a-zA-Z]+/g, ' ').trim().split(' ');
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
        return '/img/' + hashIndex;
    },

    getTargetLink(hashIndex) {
        return links[hashIndex % links.length];
    },

    getInternalLinks(hashIndex) {
        const internalLinks = [];
        for (var i = 0; i < config.pageInternalLinksCount; i++) {
            const linkedPageIndex = (hashIndex + 1 + i) % config.sitePagesCount;
            const link = this.getURLForPage(linkedPageIndex);
            const linkedPageHashIndex = utils.getPageHashIndexFromURL(link);

            internalLinks.push({
                link: link,
                anchorText: this.getTitle(link, linkedPageHashIndex)
            });
        }
        return internalLinks;
    },

    getParagraphs(hashIndex) {
        const paragraphs = [];
        for (var i = 0; i < config.pageParagraphsCount; i++) {
            paragraphs.push( this.generateParagraph(hashIndex, i) );
        }
        return paragraphs;
    }
}