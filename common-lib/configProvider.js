const fs = require('fs');

let config = {};
let configFilePath = "";
 
module.exports = {
    init(myConfigFilePath) {
        configFilePath = myConfigFilePath;
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
    reload() {
        this.init(configFilePath);
    },
    get() {
        return config;
    }
}




