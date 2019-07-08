var express = require('express');
var router = express.Router();
var consoController = require('../controllers/consoController.js');

router.get('/', consoController.index);

module.exports = router;
