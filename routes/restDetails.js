var express = require('express');
//var mysql = require('mysql');
var router = express.Router();

const db = require('../lib/dbconfig/dbconnection');

router.get('/:restId', function(req, res) {
    res.redirect('/restaurants/details' + req.url + '/menu');
});

router.get('/:restId/menu', function(req, res) {
    let sql = 'SELECT Nazwa, Cena, Opis, Skladniki, Kategoria FROM danie WHERE fk_Restauracja = ? ORDER BY Kategoria';
    db.query(sql, [req.params.restId], function(err, data) {
        if (err) throw err;
        let food = categorizeFood(data)
        for(item in food) {
            console.log(item);
            for(item1 of food[item]) {
                console.log(item1.Nazwa);
            }
        }
        res.render('restaurant-menu', {food: food});
    });

});

router.get('/:restId/menu', function(req, res) {
    console.log('dziala!!');
    res.json({resp: 'resp'});
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