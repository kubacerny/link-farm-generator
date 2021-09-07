const fs = require('fs');
const { get } = require('../routes/generatedPageRouter');

const configFilePath = './app-config.json';
let config = {};
 
module.exports = {
    init() {
        try {
            const data = fs.readFileSync(configFilePath,{encoding:'utf8', flag:'r'});
            config = JSON.parse(data);
        } catch (e) {
            if (e.code === 'ENOENT') {
                console.log('Config file not found: ' + e.message);
            } else {
                console.log('Error when parsing config file "' + configFilePath + '": ' + e.message);
            }
            throw e;
        }
        return config;
    },
    get() {
        return config;
    }
}




