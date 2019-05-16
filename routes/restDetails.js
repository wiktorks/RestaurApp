var express = require('express');
var router = express.Router();

const db = require('../lib/dbconfig/dbconnection');

router.get('/:restId', function(req, res) {
    res.redirect('/restaurants/details' + req.url + '/menu');
});

router.get('/:restId/menu', function(req, res) {
    let sql = 'SELECT Nazwa, Cena, Opis, Skladniki, Kategoria FROM danie WHERE fk_Restauracja = ? ORDER BY Kategoria';
    db.query(sql, [req.params.restId], function(err, data) {
        if (err) throw err;
        let food = categorizeFood(data);
        res.render('restaurant-menu', {
            food: food,
        });
    });
});

router.get('/:restId/opinions', function(req, res) {
    let sqlFood = 'SELECT DISTINCT Kategoria FROM danie WHERE fk_Restauracja = ? ORDER BY Kategoria';
    let sqlComments = 'SELECT Login, Ocena, Komentarz, Nazwa, Srednia_Ocen, Srednia_Cen FROM klient JOIN klient_restauracja ON klient.Id_Klient = klient_restauracja.fk_Klient JOIN restauracja ON Id_Restaruacja = ?';
    db.query(sqlFood, [req.params.restId], function(err, food) {
        if (err) throw err;
        db.query(sqlComments, [req.params.restId], function(err, comments) {
            if (err) throw err;
            for(item of food) {
                console.log(item.Kategoria);
            }
            res.render('restaurant-opinions.ejs', {
                food: food,
                comments: comments,
            });
        });
    });
    //res.render('restaurant-opinions.ejs');
    //res.render('restaurant-opinions.ejs', {food: food});
});

router.get('/:restId/information', function(req, res) {
    let sql = 'SELECT Kategoria FROM danie WHERE fk_Restauracja = ? ORDER BY Kategoria';
    db.query(sql, [req.params.restId], function(err, food) {
        if (err) throw err;
        res.render('restaurant-info', {
            food: food,
        });
    });
});

function categorizeFood(data) {
    let food = {};
    for(item of data) {
        if(!food[item.Kategoria]) food[item.Kategoria] = [];
        food[item.Kategoria].push(item);
    }
    return food;
}

module.exports = router;