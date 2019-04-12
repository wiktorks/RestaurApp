const mysql = require('mysql');

var db = mysql.createConnection({
    host: 'localhost',
    user: 'Admin',
    password: '', // Problem z kodowaniem hasła
    database: 'restauracje'
});

module.exports = db;