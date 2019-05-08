var express = require('express');
var mysql = require('mysql');
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

router.get('/restaurants/:search', function (req, res) {
    let sql = 'SELECT Id_Restaruacja, Nazwa, Srednia_Ocen, Srednia_Cen FROM restauracja WHERE Adres LIKE ?';
    if(Object.entries(req.query).length === 0 && req.query.constructor === Object) { // Czy nie ma parametrów filtrowania
        db.query(sql, [ `%${req.params.search}%`], function (err, restaurants) {
            if (err) throw err;
            db.query('SELECT Nazwa FROM kuchnia', function (err, kitchen) {
                if (err) throw err;
                res.render('restaurants', {restaurants: restaurants, kitchen: kitchen});
            });
        });
    } else {
        let queryData = [`%${req.params.search}%`];
        if(req.query.reset !== 'true') {
            if(req.query.kitchen) {
                sql +=  ' AND fk_kuchnia = (SELECT Id_kuchnia FROM kuchnia WHERE Nazwa LIKE ?)';
                queryData.push(req.query.kitchen);
            }
            if(req.query.rating) {
                sql += ' AND Srednia_Ocen >= ?';
                queryData.push(req.query.rating);
            }
            if(req.query.pricetag) {
                sql += ' AND Srednia_Cen IN (?)';
                queryData.push(req.query.pricetag.split('-'));
            }
            console.log(sql + ' -> ' + queryData);
        }
        db.query(sql, queryData, function(err, restaurants) {
            if (err) throw err;
            res.send({dane: restaurants});
        });
    }
});

router.post('/restaurants/:search', function(req, res) {

    /*let data = req.body.answer;
    var sql = 'SELECT Id_Restaruacja, Nazwa, Srednia_Ocen FROM restauracja WHERE Adres LIKE "%' + data + '%"';
    console.log(sql);
    db.query(sql, function (err, data) {
        if (err) throw err;
        for(item of data) {
            console.log(item.Id_Restaruacja);
        }
        res.send({dane: data});
    });*/
    //res.send({answer: 'doszło'});
});

/*
router.get('/restaurants/:restId', function(req, res) {
    res.render('restaurant-details');
});
*/

module.exports = router;
