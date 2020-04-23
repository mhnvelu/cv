// jshint esversion:8
const mongoose = require('mongoose');

function dbInit() {
    mongoose.connect('mongodb://localhost:27017/todolistDB', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}

dbInit();

const itemsSchema = new mongoose.Schema({
    name: String
});

const Item = mongoose.model("Item", itemsSchema);

module.exports.Item = Item;

function save(item) {
    console.log("Item :" + item);
    item.save();
    // Item.insertMany(items, function (err) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         console.log("Successfully saved items");
    //     }
    // });
}

module.exports.save = save;

function find(condition) {
    let items = "";
    Item.find(condition, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log("Data : " + data);
            items = data;
        }
    });
    console.log("items : " + items);
    return items;
}

module.exports.find = find;