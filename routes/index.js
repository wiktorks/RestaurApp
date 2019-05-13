var express = require('express');
//var mysql = require('mysql');
var router = express.Router();

const db = require('../lib/dbconfig/dbconnection');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.post('/', function (req, res) {
    var link = '/restaurants?str=' + req.body.name;
    res.redirect(link);
});

module.exports = router;
