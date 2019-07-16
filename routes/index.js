var express = require('express');
//var mysql = require('mysql');
var router = express.Router();
var passport = require('passport');

const db = require('../lib/dbconfig/dbconnection');

/* GET home page. */
router.get('/', function (req, res, next) {
    if(req.isAuthenticated()) {
        res.render('main_logged_page', {userName: req.user.login});
    } else {
        res.render('index', {title: 'Express'});
    }
});

router.post('/register', function (req, res, next) {
    for(let item in req.body) {
        if (req.body[item] === '') {
            req.flash('error', 'Nie wypełniono wszystkich wymaganych pól!');
            res.redirect('/#login');
        }
    }
    if(req.body.password !== req.body['password-confirm']) {
        req.flash('error', 'Hasła nie są takie same!');
        res.redirect('/#login');
    }
    db.query('SELECT * FROM klient WHERE Login LIKE ? UNION SELECT * FROM klient WHERE Email LIKE ?', [req.body.login, req.body.email], function (err, data) {
        if(data.length > 0) {
            req.flash('error', 'Login lub email zajęty!');
            res.redirect('/#login');
        } else {
            db.query('INSERT INTO klient(Login, Haslo, Email, Imie, Nazwisko) VALUES (?, ?, ?, ?, ?)', [req.body.login, req.body.password, req.body.email, req.body.name, req.body.surname], function (err, data) {
                req.flash('success', 'Udało się utworzyć konto. Zaloguj się.');
                res.redirect('/#login');
            });
        }
    });

});

router.post('/login',  passport.authenticate('local',
    { successRedirect: '/',
        failureRedirect: '/#login',
        failureFlash: true})
);

router.get('/logout', function(req, res, next) {
    req.logout();
    req.flash('success', 'Pomyślnie wylogowano z konta');
    res.redirect('/#login');
});

module.exports = router;
