var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {  
  const isAuthenticated = req.oidc.isAuthenticated();
  const userName = req.oidc && req.oidc.user && req.oidc.user.name;

  res.render('index', { isAuthenticated, userName, title: 'Administration Homepage' });
});

module.exports = router;
