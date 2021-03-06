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
            let authenticated = true;
            if(!req.isAuthenticated()) {
                authenticated = false;
                res.render('restaurant-menu', {
                    food: food,
                    navSize: req.query.nav,
                    address: restInfo.adres,
                    authenticated: authenticated,
                    userName: null
                });
            } else {
                db.query("SELECT * FROM klient_ulubione WHERE fk_Klient = ? AND fk_Restauracja = ?",[req.user.klientId, req.params.restId], function (err, data) {
                    let isFavourite = true;
                    if(data.length === 0) isFavourite = false;

                    res.render('restaurant-menu', {
                        food: food,
                        navSize: req.query.nav,
                        address: restInfo.adres,
                        authenticated: authenticated,
                        userName: req.user.login,
                        isFavourite: isFavourite
                    });
                });
            }
        });
    }).catch(err => {throw err});
});

router.get('/:restId/opinions', function(req, res) {
    let sqlFood = 'SELECT DISTINCT Kategoria FROM danie WHERE fk_Restauracja = ? ORDER BY Kategoria';
    let sqlComments = 'SELECT Adres, Login, Ocena, Komentarz, Nazwa, Srednia_Ocen, Srednia_Cen, Data_Dodania FROM klient JOIN klient_restauracja ON klient.Id_Klient = klient_restauracja.fk_Klient JOIN restauracja ON Id_Restaruacja = fk_restauracja1 WHERE Id_Restaruacja = ? ORDER BY Data_Dodania DESC';
    db.query(sqlFood, [req.params.restId], function(err, food) {
        if (err) throw err;
        db.query(sqlComments, [req.params.restId], function(err, comments) {
            if (err) throw err;
            db.query('SELECT Adres, Nazwa FROM restauracja WHERE Id_Restaruacja = ?', [req.params.restId], function (err, address) {
                console.log(comments);
                if(!req.isAuthenticated()) {
                    res.render('restaurant-opinions.ejs', {
                        food: food,
                        restInfo: address[0],
                        comments: comments.length > 0 ? comments : false,
                        navSize: req.query.nav,
                        restId: req.params.restId,
                        authenticated: false,
                        userName: null
                    });
                } else {
                    db.query("SELECT * FROM klient_ulubione WHERE fk_Klient = ? AND fk_Restauracja = ?",[req.user.klientId, req.params.restId], function (err, data) {
                        let isFavourite = true;
                        if(data.length === 0) isFavourite = false;

                        res.render('restaurant-opinions', {
                            food: food,
                            restInfo: address[0],
                            comments: comments.length > 0 ? comments : false,
                            navSize: req.query.nav,
                            restId: req.params.restId,
                            authenticated: true,
                            userName: req.user.login,
                            isFavourite: isFavourite
                        });
                    });
                }
            });
        });
    });
});

router.post('/:restId/opinions', function (req, res) {
    if(!req.isAuthenticated()) {
        req.flash('error', 'Komentować mogą tylko zalogowani użytkownicy');
        res.redirect('/restaurants/details/' + req.params.restId + '/opinions?nav=' + req.query.nav);
    } else {
        let date = Date.now();
        let sql = 'INSERT INTO klient_restauracja VALUES (?, ?, ?, ?, ?)';
        db.query(sql, [req.body.comment, req.body.rate, req.user.klientId, req.params.restId, date], function (err, data) {
            if(err){
                if(err.errno === 1062) {
                    req.flash('error', 'Już oceniłeś restaurację!')
                } else {
                    req.flash('error', 'Nie udało się dodać komentarza (błąd wewnętrzny serwera)')
                }
            }
            else req.flash('success', 'Komentarz dodany');
            res.redirect('/restaurants/details/' + req.params.restId + '/opinions?nav=' + req.query.nav);
        });
    }
});

router.get('/:restId/information', function(req, res) {
    let sql = 'SELECT DISTINCT Kategoria FROM danie WHERE fk_Restauracja = ? ORDER BY Kategoria';
    getRestInfo(req.params.restId).then(function(restInfo) {
        db.query(sql, [req.params.restId], function(err, food) {
            if (err) throw err;
            let authenticated = true;
            if(!req.isAuthenticated()) {
                authenticated = false;
                res.render('restaurant-info', {
                    food: food,
                    navSize: req.query.nav,
                    restInfo: restInfo,
                    restId: req.params.restId,
                    userName: null,
                    authenticated: authenticated
                });
            } else {
                db.query("SELECT * FROM klient_ulubione WHERE fk_Klient = ? AND fk_Restauracja = ?",[req.user.klientId, req.params.restId], function (err, data) {
                    let isFavourite = true;
                    if(data.length === 0) isFavourite = false;

                    res.render('restaurant-info', {
                        food: food,
                        navSize: req.query.nav,
                        restInfo: restInfo,
                        restId: req.params.restId,
                        authenticated: authenticated,
                        userName: req.user.login,
                        isFavourite: isFavourite
                    });
                });
            }
        });
    }).catch(err => {throw err})
});

router.get('/:restId/favourite', function (req, res) {
    if(req.isAuthenticated()) {
        db.query("SELECT * FROM klient_ulubione WHERE fk_Klient = ? AND fk_Restauracja = ?",[req.user.klientId, req.params.restId], function (err, data) {
            if(err) throw err;
            console.log(req.user.klientId + ' -> ' +  req.params.restId)
            if(data.length > 0) {
                db.query('DELETE FROM klient_ulubione WHERE fk_Klient = ? AND fk_Restauracja = ?', [req.user.klientId, req.params.restId], function (err, dat) {
                    if(err) throw err;
                    res.json({message: 'Pomyślnie usunięto restaurację z ulubionych'});
                });
            } else {
                db.query("INSERT INTO klient_ulubione VALUES (?, ?, 0)", [req.user.klientId, req.params.restId], function (err, dat) {
                    if(err) throw err;
                    res.json({message: 'Pomyślnie dodano restaurację do ulubionych'});
                });
            }
        });
    } else {
        req.flash('error', 'Aby dodawać do ulubionych, musisz się zalogować.');
    }
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
        db.query('SELECT Miasto, Adres, Nr_Domu, Numer, Nazwa, Opis FROM restauracja WHERE Id_Restaruacja = ?', [restaurant], function (err, rest) {
            if (err) reject(err);
            resolve({
                nazwa: rest[0].Nazwa,
                miasto: rest[0].Miasto,
                adres: rest[0].Adres,
                nrDomu: rest[0].Nr_Domu,
                kontakt: rest[0].Numer,
                opis: rest[0].Opis
            });
        });
    });
}

module.exports = router;