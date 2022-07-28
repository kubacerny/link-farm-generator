const fs = require('fs');
const parse = require('../node_modules/csv-parse/lib/sync');
const utils = require('./utils');

let domainNames = [];
module.exports = {
    getCSVURI(config) {
        return config.domainNamesSource;
    },
    readDomainNamesFromFile(config) {
        const csvUri = this.getCSVURI(config);
        try {
            const data = fs.readFileSync(csvUri, {encoding:'utf8', flag:'r'});
            return data;
        } catch (e) {
            if (e.code === 'ENOENT') {
                e.message = 'DomainNames file not found: ' + e.message;
            } else {
                e.message = 'Error when parsing domain names file "' + csvUri + '": ' + e.message;
            }
            throw e;
        }
    },
    saveDomainNamesToFile(rawCSVdata, config) {
        fs.writeFileSync(this.getCSVURI(config), rawCSVdata, 'utf8');
    },
    validateRawData(data, config) {
        let names = parse(data, {
            columns: ['domainName'],
            delimiter: config.domainNamesCSVDelimeter || '\t',
            skip_empty_lines: true
            });
        if (names.length <= 0) {
            throw new Error('DomainNames file contains no items.');
        }
        return names;    
    },
    init(myConfig) {
        try {
            config = myConfig;        
            domainNames = this.validateRawData(this.readDomainNamesFromFile(config), config);
        } catch (e) {
            console.error(e.message);
            throw e;
        }
    },

    getDomainName(hashIndex) {
        const numericIndex = utils.getCRC32(hashIndex);
        const domainNameReversed = domainNames[numericIndex % domainNames.length].domainName;
        return domainNameReversed.split('.').reverse().join('.');
    }
}