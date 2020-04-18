//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate')

const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

// https://www.npmjs.com/package/express-session

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

//http://www.passportjs.org/docs/configure/

app.use(passport.initialize());
app.use(passport.session());

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
// Level 5 authentication - using Passport js
// Level 6 authentication - using OAuth2.0

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    googleId: String,
    secret: String
});

// https://www.npmjs.com/package/passport-local-mongoose
userSchema.plugin(passportLocalMongoose);

// https://www.npmjs.com/package/mongoose-findorcreate
userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

// // https://github.com/jaredhanson/passport-google-oauth2/pull/51
passport.use(new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/secrets",
        userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
    },
    function (accessToken, refreshToken, profile, cb) {
        User.findOrCreate({
            googleId: profile.id
        }, function (err, user) {
            return cb(err, user);
        });
    }
));

app.listen(3000, function () {
    console.log("Server started on port 3000");
});

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/auth/google',
    passport.authenticate('google', {
        scope: ['profile']
    }));

app.get('/auth/google/secrets',
    passport.authenticate('google', {
        failureRedirect: '/login'
    }),
    function (req, res) {
        res.redirect('/secrets');
    });

app.get('/register', function (req, res) {
    res.render('register');
});

app.get('/secrets', function (req, res) {
    if (req.isAuthenticated()) {
        User.find({
            "secret": {
                $ne: null
            }
        }, function (err, foundUsers) {
            if (err) {
                console.log(err);
                res.redirect('/');
            } else {
                if (foundUsers) {
                    res.render('secrets', {
                        usersWithSecrets: foundUsers
                    });
                } else {
                    res.render('secrets');
                }
            }
        });
    } else {
        res.redirect('/login');
    }

});

app.get('/submit', function (req, res) {
    if (req.isAuthenticated()) {
        res.render('submit');
    } else {
        res.redirect('/login');
    }

});

app.post('/submit', function (req, res) {
    const newSecret = req.body.secret;
    User.findById(req.user.id, function (err, foundUser) {
        if (err) {
            console.log(err);
            res.redirect('/secrets');
        } else {
            if (foundUser) {
                foundUser.secret = newSecret;
                foundUser.save(function () {
                    res.redirect('/secrets');
                });
            }
        }
    });
});

app.post('/register', function (req, res) {
    //passport-local-mongoose - automatically salts and hashes the passport.
    User.register({
        username: req.body.username
    }, req.body.password, function (err, registeredUser) {
        if (err) {
            console.log(err);
            res.redirect('/register');
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect('/secrets');
            });
        }
    });
});

app.get('/login', function (req, res) {
    res.render('login');
});

app.post('/login', function (req, res) {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    // Refer http://www.passportjs.org/docs/login/
    req.login(user, function (err) {
        if (err) {
            console.log(err);
            res.redirect('/login');
        } else {
            // Refer http://www.passportjs.org/docs/authenticate/            
            passport.authenticate("local")(req, res, function () {
                res.redirect('/secrets');
            });
        }
    });
});

app.get('/logout', function (req, res) {
    // Refer http://www.passportjs.org/docs/logout/
    req.logout();
    res.redirect('/');
});