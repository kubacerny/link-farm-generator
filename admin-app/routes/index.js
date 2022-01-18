var express = require('express');
var router = express.Router();

var configProvider = require('../../common-lib/configProvider');

function hasPermissionFun(isAuthenticated, configJSON, user) {
  return isAuthenticated && configJSON.allowedEmails && user.email && configJSON.allowedEmails.indexOf(user.email) >= 0;
}

/* GET home page. */
router.get('/', function(req, res, next) {  
  const isAuthenticated = req.oidc.isAuthenticated();
  const hasPermission = hasPermissionFun(isAuthenticated, configProvider.get(), req.oidc && req.oidc.user);
  const userName = req.oidc && req.oidc.user && req.oidc.user.name;

  res.render('index', { isAuthenticated, hasPermission, userName, title: 'Administration Homepage' });
});

module.exports = router;
