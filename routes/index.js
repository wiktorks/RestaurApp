var express = require('express');
//var mysql = require('mysql');
var router = express.Router();
var passport = require('passport');

const db = require('../lib/dbconfig/dbconnection');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.post('/login',  passport.authenticate('local',
    { successRedirect: '/restaurants/zalogowano',
        failureRedirect: '/#login'}));

router.get('/logout', function(req, res, next) {
    req.logout();
    res.redirect('/#login');
});
module.exports = router;
