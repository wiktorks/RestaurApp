var express = require('express');
var router = express.Router();

const db = require('../lib/dbconfig/dbconnection');

router.get('/:restId', function(req, res) {
    res.redirect('/restaurants/details' + req.url + '/menu');
});

router.get('/:restId/menu', function(req, res) {
    let sql = 'SELECT Nazwa, Cena, Opis, Skladniki, Kategoria FROM danie WHERE fk_Restauracja = ? ORDER BY Kategoria';
    getRestInfo(req.params.restId).then(function (restInfo) {
        db.query(sql, [req.params.restId], function(err, data) {
            if (err) throw err;
            let food = categorizeFood(data);
            res.render('restaurant-menu', {
                food: food,
                navSize: req.query.nav,
                address: restInfo.adres
            });
        });
    }).catch(err => {throw err});
});

router.get('/:restId/opinions', function(req, res) {
    let sqlFood = 'SELECT DISTINCT Kategoria FROM danie WHERE fk_Restauracja = ? ORDER BY Kategoria';
    let sqlComments = 'SELECT Adres, Login, Ocena, Komentarz, Nazwa, Srednia_Ocen, Srednia_Cen FROM klient JOIN klient_restauracja ON klient.Id_Klient = klient_restauracja.fk_Klient JOIN restauracja ON Id_Restaruacja = fk_restauracja1 WHERE Id_Restaruacja = ?';
    db.query(sqlFood, [req.params.restId], function(err, food) {
        if (err) throw err;
        db.query(sqlComments, [req.params.restId], function(err, comments) {
            if (err) throw err;
            res.render('restaurant-opinions.ejs', {
                food: food,
                comments: comments,
                navSize: req.query.nav,
                restId: req.params.restId
            });
        });
    });
});

router.get('/:restId/information', function(req, res) {
    let sql = 'SELECT DISTINCT Kategoria FROM danie WHERE fk_Restauracja = ? ORDER BY Kategoria';
    getRestInfo(req.params.restId).then(function(restInfo) {
        db.query(sql, [req.params.restId], function(err, food) {
            if (err) throw err;
            res.render('restaurant-info', {
                food: food,
                navSize: req.query.nav,
                restInfo: restInfo,
                restId: req.params.restId
            });
        });
    }).catch(err => {throw err})
});

function categorizeFood(data) {
    let food = {};
    for(item of data) {
        if(!food[item.Kategoria]) food[item.Kategoria] = [];
        food[item.Kategoria].push(item);
    }
    return food;
}

function getRestInfo(restaurant) {
    return new Promise(function(resolve, reject) {
        db.query('SELECT Adres, Numer, Nazwa, Opis FROM restauracja WHERE Id_Restaruacja = ?', [restaurant], function (err, rest) {
            if (err) reject(err);
            console.log(rest);
            resolve({nazwa: rest[0].Nazwa, adres: rest[0].Adres, kontakt: rest[0].Numer, opis: rest[0].Opis});
        });
    });
}

module.exports = router;