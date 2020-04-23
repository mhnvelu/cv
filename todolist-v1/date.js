//jshint esversion:6

// JS date format
function getDate() {
    const today = new Date();
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    };
    return new Intl.DateTimeFormat("en-US", options).format(today);
}
module.exports.getDate = getDate;

// Other way of exporting a function through functional expression
var getMonth = function getMonth() {
    const today = new Date();
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    };
    return new Intl.DateTimeFormat("en-US", options).format(today);
};
// node provides short cut for module.exports as exports
exports.getMonth = getMonth;

// Other way of exporting a function through anonymous function
module.exports.getDay = function () {
    const today = new Date();
    const options = {
        weekday: "long"
    };
    return new Intl.DateTimeFormat("en-US", options).format(today);
};