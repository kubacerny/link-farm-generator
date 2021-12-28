var express = require('express');
var router = express.Router();
var admin_controller = require('../controllers/adminController');

router.get('/', admin_controller.admin_detail);
router.get('/config/', admin_controller.admin_config_detail);
router.get('/backlinks/', admin_controller.admin_backlinks_detail);

router.get('/config/update', admin_controller.admin_config_update_get);
router.post('/config/update', admin_controller.admin_config_update_post);
router.get('/backlinks/update', admin_controller.admin_backlinks_update_get);
router.post('/backlinks/update', admin_controller.admin_backlinks_update_post);

module.exports = router;
