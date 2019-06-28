var express = require('express');
var router = express.Router();
const db = require('../lib/dbconfig/dbconnection');

/* GET users listing. */
router.get('/:user/favourites', function(req, res, next) {
    /*if(!req.isAuthenticated()) {
        req.flash('error', 'Ten panel jest dostępny tylko dla zalogowanego użytkownika.');
        res.redirect('/#login');
    } else {*/
    console.log(req.params.user)
        getFavourites(req.params.user)
            .then(data => {
                res.render('user_page', {page: 'user_favourites', data: data});
            });

   // }
});

router.get('/:user/settings', function(req, res, next) {
    if(!req.isAuthenticated()) {
        req.flash('error', 'Ten panel jest dostępny tylko dla zalogowanego użytkownika.');
        res.redirect('/#login');
    } else {
        res.end()
    }
});

module.exports = router;

function getFavourites(user) {
    let sql = 'SELECT * FROM restauracja WHERE Id_Restaruacja IN (SELECT fk_Restauracja FROM klient_ulubione WHERE fk_Klient = (SELECT Id_Klient FROM klient WHERE Login LIKE ?))';
    console.log(sql);
    return new Promise(function(resolve, reject) {
        db.query(sql, [user], function (err, data) {
           if(err) reject(err);
           console.log(data);
           console.log(typeof data);
           resolve(Object.keys(data).length > 0 ? data : null);
        });
    });
}