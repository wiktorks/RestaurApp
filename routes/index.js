var express = require('express');
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

router.get('/restaurants', function (req, res) {
    var sql = 'SELECT Nazwa, Srednia_Ocen FROM restauracja WHERE Adres LIKE "%' + req.query.str + '%"';
    db.query(sql, function (err, data) {
        if (err) throw err;
        res.render('restaurants', {dane: data});
    });
    // res.render('restaurants');
});

router.post('/restaurants', function(req, res) {
    let data = req.body.answer;
    var sql = 'SELECT Nazwa, Srednia_Ocen FROM restauracja WHERE Adres LIKE "%' + data + '%"';
    console.log(sql);
    db.query(sql, function (err, data) {
        if (err) throw err;
        res.send({dane: data});
    });
    //res.send({answer: 'doszło'});
});

module.exports = router;
