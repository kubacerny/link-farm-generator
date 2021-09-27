exports.admin_detail = function(req, res) {
    const isAuthenticated = true;
    const userName = req.oidc.user.name;

    res.render('admin', { isAuthenticated, userName, title: 'Administration Detail' });
};

exports.admin_update_get = function(req, res) {
    const isAuthenticated = true;
    const userName = req.oidc.user.name;
    
    res.render('admin_form', { 
        isAuthenticated, userName,
        title: 'Administration Update GET',
        originalUrl: req.originalUrl,
        params: req.params
     });
};

exports.admin_update_post = function(req, res) {
    const isAuthenticated = true;
    const userName = req.oidc.user.name;
    
    res.render('admin_form', { 
        isAuthenticated, userName,
        title: 'Administration Update POST',
        originalUrl: req.originalUrl,
        params: req.params
    });
};