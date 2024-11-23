var express = require('express');
var router = express.Router();
var logger = require('morgan');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json("server running on port 3000");
});

module.exports = router;
