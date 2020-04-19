//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

// The static files css, images referred in html are automatically send to UI. Refer inside public folder.
app.use(express.static('public'));

// process.env.PORT : Heroku environment PORT.
// Port 3000 : Local development environment.
app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on port 3000");
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post('/', function (req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    // Payload for MailChimp
    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    };
    const jsonData = JSON.stringify(data);

    const url = "https://" + process.env.MAILCHIMP_SERVER_PREFIX + ".api.mailchimp.com/3.0/lists/";
    const list_id = process.env.MAILCHIMP_LIST_ID;
    const apiKey = process.env.MAILCHIMP_API_KEY;
    const finalURL = url + list_id;

    const options = {
        method: 'POST',
        auth: process.env.MAILCHIMP_AUTH
    };

    // Send request to MailChimp using Node HTTPS module.
    const request = https.request(finalURL, options, function (response) {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + '/success.html');
        } else {
            res.sendFile(__dirname + '/failure.html');
        }
        response.on('data', function (data) {
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();

});

app.post('/failure', function (req, res) {
    res.redirect('/');
});