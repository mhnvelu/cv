//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
// Load our own module
const date = require(__dirname + "/date.js");
const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

// https://github.com/mde/ejs/wiki/Using-EJS-with-Express
app.set('view engine', 'ejs');

// The static files css, images referred in html are automatically send to UI. Refer inside public folder.
app.use(express.static('public'));

// process.env.PORT : Heroku environment PORT.
// Port 3000 : Local development environment.
app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on port 3000");
});

const items = [];

app.get('/', function (req, res) {
    // EJS expects .ejs files in views directory.
    res.render('list', {
        kindOfDay: date.getDate(),
        newListItems: items
    });
});

app.post('/', function (req, res) {
    let newItem = req.body.newItem;
    items.push(newItem);
    res.redirect('/');
});

app.get('/about', function (req, res) {
    res.render('about');
});