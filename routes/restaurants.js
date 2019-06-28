var express = require('express');
var router = express.Router();

const db = require('../lib/dbconfig/dbconnection');

router.get('/:search', function (req, res) {
    //let searchWords = req.params.search.split('-');
    let sql = 'SELECT Id_Restaruacja, Nazwa, Srednia_Ocen, Srednia_Cen FROM restauracja WHERE Adres LIKE ?';
    if(Object.entries(req.query).length === 0 && req.query.constructor === Object) { // Czy nie ma parametrów filtrowania
        let params = req.params.search.split('-').filter((el) => {
            return el !== '';
        });
        if(params.length > 1) sql += 'AND Miasto LIKE ?';

        db.query(sql, [ `%${params[0]}%`, `%${params[1]}%`], function (err, restaurants) {
            if (err) throw err;
            db.query('SELECT Nazwa FROM kuchnia', function (err, kitchen) {
                if (err) throw err;
                if(req.isAuthenticated()) {
                    res.render('restaurants', {restaurants: restaurants, kitchen: kitchen, authenticated: true, user: req.user})
                } else {
                    res.render('restaurants', {restaurants: restaurants, kitchen: kitchen, authenticated: false});
                }
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
        }
        db.query(sql, queryData, function(err, restaurants) {
            if (err) throw err;
            res.send(JSON.stringify({dane: restaurants}));
        });
    }
});


router.post('/:search/suggestion', function (req, res) {
    let params = req.body.phrase.split(' ').filter((el) => {
        return el !== '';
    });
    let json = [];
    db.query("SELECT DISTINCT Adres, Miasto FROM `restauracja` WHERE Adres LIKE ?", [params[0] + '%'], function (err, data) {
        if(err) throw err;
        for(let pair of data) {
            json.push({"street": pair.Adres, "city": pair.Miasto});
        }
        console.log(json);
        res.send(json);
    });
});
/*router.post('/:search', function(req, res) {

    let data = req.body.answer;
    var sql = 'SELECT Id_Restaruacja, Nazwa, Srednia_Ocen FROM restauracja WHERE Adres LIKE "%' + data + '%"';
    console.log(sql);
    db.query(sql, function (err, data) {
        if (err) throw err;
        for(item of data) {
            console.log(item.Id_Restaruacja);
        }
        res.send({dane: data});
    });
    //res.send({answer: 'doszło'});
});*/

module.exports = router;