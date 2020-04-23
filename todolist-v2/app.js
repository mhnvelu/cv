//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
// Load our own module
const date = require(__dirname + "/date.js");
const _ = require('lodash');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/todolistDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const itemsSchema = new mongoose.Schema({
    name: String
});

const Item = mongoose.model("Item", itemsSchema);

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

app.get('/', function (req, res) {
    Item.find({}, function (err, items) {
        if (err) {
            console.log(err);
        } else {
            // EJS expects .ejs files in views directory.
            res.render('list', {
                title: date.getDate(),
                newListItems: items
            });
        }
    });

});

app.post('/', function (req, res) {
    let newItem = req.body.newItem;
    let listName = req.body.list;
    const item = new Item({
        name: newItem
    });


    List.findOne({
        name: listName
    }, function (err, data) {
        if (!err) {
            if (data) {
                data.items.push(item);
                data.save();
                res.redirect('/' + listName);
            } else {
                item.save();
                res.redirect('/');
            }
        }
    });
});

app.get('/about', function (req, res) {
    res.render('about');
});

app.post('/delete', function (req, res) {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
    console.log(listName);
    console.log(checkedItemId);
    List.findOneAndUpdate({
            name: listName
        }, {
            $pull: {
                items: {
                    _id: checkedItemId
                }
            }
        },
        function (err, results) {
            if (!err && results) {
                res.redirect('/' + listName);
            } else {
                Item.findByIdAndRemove(checkedItemId, function (err) {
                    if (!err) {
                        console.log("Successfully deleted an item : " + checkedItemId);
                    }
                });
                res.redirect('/');
            }
        }
    );
});

// create custom ToDo List
const listSchema = new mongoose.Schema({
    name: String,
    items: [itemsSchema]
});

const List = mongoose.model("List", listSchema);


app.get('/:customToDoListName', function (req, res) {
    const customToDoListName = _.capitalize(req.params.customToDoListName);
    List.findOne({
        name: customToDoListName
    }, function (err, data) {
        if (!err) {
            if (!data) {
                const list = new List({
                    name: customToDoListName
                });
                list.save();
                res.redirect('/' + customToDoListName);
            } else {
                res.render('list', {
                    title: data.name,
                    newListItems: data.items
                });
            }
        }
    });
});