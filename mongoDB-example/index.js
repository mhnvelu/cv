// jshint esversion:6

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/fruitsDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const fruitSchema = new mongoose.Schema({
    // Mongoose built-in validator
    name: {
        type: String,
        required: true
    },
    // Mongoose provides built-in validators
    rating: {
        type: Number,
        min: 1,
        max: 10
    },
    review: String
});

// Collection name will be fruits. mongoose creates collection as 'fruits' for 'Fruit'
const Fruit = mongoose.model("Fruit", fruitSchema);

// const apple = new Fruit({
//     name: "Apple",
//     rating: 9,
//     review: "Good for health!"
// });

// // Insert one document
// apple.save();
// mongoose.connection.close();

// Invalid rating.
// const plums = new Fruit({
//     name: "Plums",
//     rating: 35,
//     review: "Good for health!"
// });

// // Insert one document
// plums.save();
// mongoose.connection.close();

// Without name value
// const kiwi = new Fruit({
//     rating: 7,
//     review: "Good for health!"
// });

// // Insert one document
// kiwi.save();
// mongoose.connection.close();


// const banana = new Fruit({
//     name: "Banana",
//     rating: 7,
//     review: "Good for health!"
// });


// const grapes = new Fruit({
//     name: "Grapes",
//     rating: 8,
//     review: "Good for health!"
// });

// const orange = new Fruit({
//     name: "Orange",
//     rating: 10,
//     review: "Good for health!"
// });

// Insert many documents
// Fruit.insertMany([banana,grapes,orange], function (err) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("Successfully saved all the fruits into fruitDB");
//     }
// mongoose.connection.close();
// });

// Find documents
// Fruit.find(function (err, fruits) {
//     if (err) {
//         console.log(err);
//     } else {
//         fruits.forEach(function (fruit) {
//             console.log(fruit.name);
//         });

//     }
//     mongoose.connection.close();
// });

// Update the document

// const peach = new Fruit({
//     name: "Peach",
//     rating: 9
// });

// // Insert one document
// peach.save();
// // mongoose.connection.close();

// Fruit.updateOne({
//     name: "Peach"
// }, {
//     review: "Peach review got updated"
// }, function (err) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("Successfully updated the review");
//     }
// });


// delete a document
// Fruit.deleteOne({
//     name: "Peach"
// }, function (err) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("Successfully deleted the document");
//     }
// });


const peopleSchema = new mongoose.Schema({
    name: String,
    age: Number,
    favouriteFruit: fruitSchema
    // Establishing relationships and embedding documents
});
const People = mongoose.model("People", peopleSchema);

// case 1:
// const pineapple = new Fruit({
//     name: "Pineapple",
//     rating: 10,
//     review: "Good for health!"
// });

// const jon = new People({
//     name: "Jon",
//     age: 30,
//     favouriteFruit: pineapple
// });
// jon.save();
// // This would create fruit document embedded in people. But there is no document for pineapple in Fruit collection.


// case 2:
const pomegrante = new Fruit({
    name: "Pomegrante",
    rating: 10,
    review: "Good for health!"
});
pomegrante.save();

const me = new People({
    name: "Me",
    age: 35,
    favouriteFruit: pomegrante
});
me.save();
// Pomegrante document is created in Fruits collection. This would create Pomegrante document embedded in people.
// The relationship is created through object id.


// const amy = new People({
//     name: "Amy",
//     age: 30
// });

// amy.save();
// mongoose.connection.close();