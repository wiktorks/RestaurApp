var express = require('express');
var router = express.Router();
const db = require('../lib/dbconfig/dbconnection');

/* GET users listing. */
router.get('/:user/favourites', function (req, res, next) {
    if (!req.isAuthenticated()) {
        req.flash('error', 'Ten panel jest dostępny tylko dla zalogowanego użytkownika.');
        res.redirect('/#login');
    } else {
        getFavourites(req.params.user)
            .then(data => {
                res.render('user_page', {page: 'user_favourites', data: data, user: req.user.login});
            });
    }
});

router.delete('/:user/favourites', function (req, res, next) {
    if (!req.isAuthenticated()) {
        req.flash('error', 'Aby usunąć restaurację z ulubionych należy się zalogować.');
        res.sendStatus(401);
    } else {
        db.query('SELECT Id_Klient FROM klient WHERE Login = ?', [req.body.user], function (err, userId) {
            if (err) throw err;
            db.query('DELETE FROM klient_ulubione WHERE fk_Klient = ? AND fk_Restauracja = ?', [userId[0].Id_Klient, req.body.restaurant], function (err, data) {
                if (err) throw err;
                else {
                    console.log(data);
                    res.sendStatus(200);
                }
            });
        });
    }
});

router.get('/:user/settings', function (req, res, next) {
    if (!req.isAuthenticated()) {
        req.flash('error', 'Ten panel jest dostępny tylko dla zalogowanego użytkownika.');
        res.redirect('/#login');
    } else {
        res.render('user_page', {page: 'user_settings', data: req.user, user: req.user.login});
    }
});

module.exports = router;

function getFavourites(user) {
    let sql = 'SELECT Id_Restaruacja, Nazwa, Adres, Nr_Domu, Miasto, Srednia_Ocen, Ocena, fk_Klient FROM restauracja JOIN klient_restauracja ON restauracja.Id_Restaruacja = klient_restauracja.fk_Restauracja1 AND klient_restauracja.fk_Klient = (SELECT Id_Klient FROM klient WHERE Login LIKE ?) AND restauracja.Id_Restaruacja IN (SELECT fk_Restauracja FROM klient_ulubione WHERE fk_Klient = (SELECT Id_Klient FROM klient WHERE Login LIKE ?))';
    return new Promise(function (resolve, reject) {
        db.query(sql, [user, user], function (err, data) {
            if (err) reject(err);
            resolve(Object.keys(data).length > 0 ? data : null);
        });
    });
}

