const LocalStrategy = require('passport-local').Strategy;
const db = require('./dbconfig/dbconnection');

module.exports = function (passport) {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'passwd'
    }, function (username, password, done) {
        db.query('SELECT * FROM klient WHERE Email LIKE ?', [username], function(err, data) {
            if(err) return done(null, false, {message: 'SQL Error'});
            if(!data.length || password !== data[0].Haslo) {
                return done(null, false, {message: 'Podano zły email lub hasło. Spróbuj ponownie, lub zarejestruj się.'});
            }
            return done(null, {
                klientId: data[0].Id_Klient,
                login: data[0].Login,
                email: data[0].Email,
                imie: data[0].Imie,
                nazwisko: data[0].Nazwisko
            });
        });
    }));

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });
};