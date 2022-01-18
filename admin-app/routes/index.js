var express = require('express');
var router = express.Router();

var configProvider = require('../../common-lib/configProvider');

function hasPermission(configJSON, user) {
  return configJSON.allowedEmails && user.email && configJSON.allowedEmails.indexOf(user.email) >= 0;
}

/* GET home page. */
router.get('/', function(req, res, next) {  
  let isAuthenticated = req.oidc.isAuthenticated();
  isAuthenticated = isAuthenticated && hasPermission(configProvider.get(), req.oidc && req.oidc.user);
  const userName = req.oidc && req.oidc.user && req.oidc.user.name;

  res.render('index', { isAuthenticated, userName, title: 'Administration Homepage' });
});

module.exports = router;
