const fs = require('fs');
const parse = require('csv-parse/lib/sync');

const requiredColumnNames = ['id', 'link', 'anchorText'];
let links = [];
let config = {};

//
// Site has config.sitePagesCount pages with URL /123, where 123 is pageIndex number counted from 0 to sitePageCount-1.
// For each url we calculate pageHashIndex, which is CRC32(pageURL), that is integer. This integer is used as random
// seed for content generator and also from backlink selection. We take target link as links[pageHashIndex % links.count].
//

module.exports = {
    init(myConfig) {
        config = myConfig;
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

    getTargetLink(hashIndex) {        
        return links[hashIndex % links.length];
    }
}