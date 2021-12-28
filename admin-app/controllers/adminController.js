const fs = require('fs');
const { body, param, validationResult } = require('express-validator');
const backlinksDB = require('../../common-lib/backlinksDB');
//require('dotenv').config();

function getConfigJSON() {
    const data = fs.readFileSync(process.env.APP_CONFIG_PATH, 'utf8');
    return JSON.parse(data);
}

function saveConfigJSON(json) {
    fs.writeFileSync(process.env.APP_CONFIG_PATH, JSON.stringify(json, true, 2), 'utf8');
}

function getBacklinksCSV() {
    try {
        const config = getConfigJSON();
        const data = backlinksDB.readLinksFromFile(config);
        backlinksDB.validateRawData(data, config);
        return data;
    } catch (err) {
        return "Error: " + err.message;
    }
}

exports.admin_detail = function(req, res) {
    const isAuthenticated = true;
    const userName = req.oidc.user.name;
    const configJSON = getConfigJSON();
    const reloadLink = '//' + configJSON.domains.preferred + '/reload';
    const linkfarmHPLink = '//' + configJSON.domains.preferred;

    res.render('admin', { 
        isAuthenticated, 
        userName, 
        title: 'Linkfarm Settings',
        reloadLink: reloadLink,
        linkfarmHPLink: linkfarmHPLink
    });
};

exports.admin_config_detail = function(req, res) {
    const isAuthenticated = true;
    const userName = req.oidc.user.name;
    const configJSON = getConfigJSON();
    const reloadLink = '//' + configJSON.domains.preferred + '/reload';
    const linkfarmHPLink = '//' + configJSON.domains.preferred;

    res.render('admin_config', { 
        isAuthenticated, 
        userName, 
        title: 'Linkfarm Settings: Config',
        config: JSON.stringify(configJSON, true, 2),
        reloadLink: reloadLink,
        linkfarmHPLink: linkfarmHPLink
    });
};

exports.admin_backlinks_detail = function(req, res) {
    const isAuthenticated = true;
    const userName = req.oidc.user.name;
    const configJSON = getConfigJSON();
    const backlinksCSV = getBacklinksCSV();
    const reloadLink = '//' + configJSON.domains.preferred + '/reload';
    const linkfarmHPLink = '//' + configJSON.domains.preferred;

    res.render('admin_backlinks', { 
        isAuthenticated, 
        userName, 
        title: 'Linkfarm Settings: Backlinks',
        backlinksCSV: backlinksCSV,
        reloadLink: reloadLink,
        linkfarmHPLink: linkfarmHPLink
    });
};

exports.admin_config_update_get = function(req, res) {
    const isAuthenticated = true;
    const userName = req.oidc.user.name;    
    const configJSON = getConfigJSON();

    res.render('admin_config_form', { 
        isAuthenticated, userName,
        title: 'Editing Linkfarm Setting: Config',
        originalUrl: req.originalUrl,
        config: JSON.stringify(configJSON, true, 2)
     });
};

exports.admin_backlinks_update_get = function(req, res) {
    const isAuthenticated = true;
    const userName = req.oidc.user.name;    
    const backlinksCSV = getBacklinksCSV();

    res.render('admin_backlinks_form', { 
        isAuthenticated, userName,
        title: 'Editing Linkfarm Setting: Backlinks',
        originalUrl: req.originalUrl,
        backlinksCSV: backlinksCSV
     });
};

exports.admin_config_update_post = [
    body('json').custom((value, { req }) => {
        try {
            JSON.parse(value);
            return true;
        } catch(err) {
            throw new Error('Field JSON Config: Invalid JSON: ' + err.message);
        }
    }),
    function(req, res, next) {
        const isAuthenticated = true;
        const userName = req.oidc.user.name;
        
        const errors = validationResult(req);

        if (!errors.errors || errors.errors.length > 0) {
            res.render('admin_config_form', { 
                isAuthenticated, userName,
                title: 'Editing Linkfarm Setting: Config',
                originalUrl: req.originalUrl,
                config: req.body.json,
                errors: errors.errors
            });
        } else {
            const configJSON = JSON.parse(req.body.json);
            saveConfigJSON(configJSON);

            res.redirect(req.originalUrl + '/..');
        }
    }
];

exports.admin_backlinks_update_post = [
    body('backlinksCSV').custom((value, { req }) => {
        const configJSON = getConfigJSON();
        try {
            console.log('Validating CSV: ' + value);
            backlinksDB.validateRawData(value, configJSON);
            return true;
        } catch(err) {
            throw new Error('Field Links as CSV: ' + err.message);
        }
    }),
    function(req, res, next) {
        const isAuthenticated = true;
        const userName = req.oidc.user.name;
        const configJSON = getConfigJSON();
        
        const errors = validationResult(req);

        if (!errors.errors || errors.errors.length > 0) {
            res.render('admin_backlinks_form', { 
                isAuthenticated, userName,
                title: 'Editing Linkfarm Setting: Backlinks',
                originalUrl: req.originalUrl,
                backlinksCSV: req.body.backlinksCSV,
                errors: errors.errors
            });
        } else {
            const rawCSVdata = req.body.backlinksCSV;
            backlinksDB.saveLinksToFile(rawCSVdata, configJSON);

            res.redirect(req.originalUrl + '/..');
        }
    }
];