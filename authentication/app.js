//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Level 1 authentication - using email id and password as plaintext
// Level 2 authentication - using email id and password encrypted using mongoose-encryption
// Refer https://www.npmjs.com/package/mongoose-encryption
// Level 3 authentication - using email id and password hashed using md5
// Refer https://www.npmjs.com/package/md5
// Level 4 authentication - using email id and password salted and hashed using bcrypt
// Refer https://www.npmjs.com/package/bcrypt

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = mongoose.model("User", userSchema);

app.listen(3000, function () {
    console.log("Server started on port 3000");
});

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/register', function (req, res) {
    res.render('register');
});

app.post('/register', function (req, res) {
    bcrypt.hash(req.body.password, 10, function (err, hash) {
        const newUser = new User({
            email: req.body.username,
            password: hash
        });
        newUser.save(function (err) {
            if (err) {
                console.log(err);
            } else {
                res.render('secrets');
            }
        });
    });
});

app.get('/login', function (req, res) {
    res.render('login');
});

app.post('/login', function (req, res) {

    const email = req.body.username;
    const password = req.body.password;
    User.findOne({
        email: email
    }, function (err, foundUser) {
        if (err) {
            console.log(err);
            res.redirect('/login');
        } else {
            if (foundUser) {
                bcrypt.compare(password, foundUser.password, function (err, result) {
                    if (result) {
                        res.render('secrets');
                    }
                });
            } else {
                res.redirect('/login');
            }
        }
    });

});