var express = require('express');
var router = express.Router();
var admin_controller = require('../controllers/adminController');

router.get('/', admin_controller.admin_detail);
router.get('/update', admin_controller.admin_update_get);
router.post('/update', admin_controller.admin_update_post);

module.exports = router;
