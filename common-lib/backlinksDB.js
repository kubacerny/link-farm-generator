const fs = require('fs');
const parse = require('../generator-app/node_modules/csv-parse/lib/sync');

let links = [];
let config = {};

//
// Site has config.sitePagesCount pages with URL /123, where 123 is pageIndex number counted from 0 to sitePageCount-1.
// For each url we calculate pageHashIndex, which is CRC32(pageURL), that is integer. This integer is used as random
// seed for content generator and also from backlink selection. We take target link as links[pageHashIndex % links.count].
//

module.exports = {
    getCSVURI(config) {
        return config.backlinksDBSource;
    },
    readLinksFromFile(config) {
        const csvUri = this.getCSVURI(config);
        try {
            const data = fs.readFileSync(csvUri, {encoding:'utf8', flag:'r'});
            return data;
        } catch (e) {
            if (e.code === 'ENOENT') {
                e.message = 'Backlinks DB file not found: ' + e.message;
            } else {
                e.message = 'Error when parsing backlinks db file "' + csvUri + '": ' + e.message;
            }
            throw e;
        }
    },
    saveLinksToFile(rawCSVdata, config) {
        fs.writeFileSync(this.getCSVURI(config), rawCSVdata, 'utf8');
    },
    validateRawData(data, config) {
        let links = parse(data, {
            columns: ['link', 'anchorText'],
            delimeter: config.backlinksCSVDelimeter || '\t',
            skip_empty_lines: true
            });
        if (links.length <= 0) {
            throw new Error('Backlinks DB file contains no items.');
        }
        return links;    
    },
    init(myConfig) {
        try {
            config = myConfig;        
            links = this.validateRawData(this.readLinksFromFile(config), config);
        } catch (e) {
            console.error(e.message);
            throw e;
        }
    },

    getTargetLink(hashIndex) {        
        return links[hashIndex % links.length];
    }
}