//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/wikiDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
});

const Article = mongoose.model('article', articleSchema);

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

app.listen(3000, function () {
    console.log("Server started on port 3000");
});


////////// Requests targeting all articles //////////////////
// Get all articles
app.get('/articles', function (req, res) {
    Article.find({}, function (err, data) {
        if (!err) {
            res.send(data);
        } else {
            res.send(err);
        }
    });
});

// Post a article
app.post('/articles', function (req, res) {
    const title = req.body.title;
    const content = req.body.content;
    const article = new Article({
        title: title,
        content: content
    });
    article.save(function (err) {
        if (!err) {
            res.send("Successfully added a new article");
        } else {
            res.send(err);
        }
    });
});

//Delete articles
app.delete('/articles', function (req, res) {
    Article.deleteMany(function (err) {
        if (!err) {
            res.send("Successfully deleted all articles");
        } else {
            res.send(err);
        }
    });
});

////////// Requests targeting a specific articles //////////////////

// Express route - to chain multiple handlers for same path
app.route("/articles/:title").get(function (req, res) {
    const title = req.params.title;
    Article.findOne({
        title: title
    }, function (err, data) {
        if (!err) {
            if (data) {
                res.send(data);
            } else {
                res.send("No article matching the title is found");
            }
        }
    });
}).put(function (req, res) {
    const articleTitle = req.params.title;
    const title = req.body.title;
    const content = req.body.content;

    Article.update({
            title: articleTitle
        }, {
            title: title,
            content: content
        }, {
            overwrite: true
        },
        function (err, data) {
            if (!err) {
                res.send("Successfully updated article");
            } else {
                res.send(err);
            }
        });
}).patch(function (req, res) {
    const articleTitle = req.params.title;
    Article.update({
            title: articleTitle
        }, {
            $set: req.body
        }, {
            overwrite: false
        },
        function (err, data) {
            if (!err) {
                res.send("Successfully updated article");
            } else {
                res.send(err);
            }
        });

}).delete(function (req, res) {
    const articleTitle = req.params.title;
    Article.deleteOne({
        title: articleTitle
    }, function (err) {
        if (!err) {
            res.send("Successfully deleted an article");
        } else {
            res.send(err);
        }
    });
});