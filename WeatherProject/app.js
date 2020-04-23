// jshint esversion:6
const express = require("express");
//Native https module
const https = require("https");
const app = express();

//body-parser to parse post request
const bodyParser = require("body-parser");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.listen("3000", function () {
  console.log("Server started on port 3000");
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  const city = req.body.cityName;
  const appId = process.env.OPEN_WEATHER_MAP_APPID;
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    appId +
    "&units=metric";
  //Refer Node Https module API
  https.get(url, function (response) {
    response.on("data", function (data) {
      // This converts stringified json into  JavaScript object.
      const weatherData = JSON.parse(data);
      const temperature = weatherData.main.temp;
      const description = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
      res.write("<p>The weather is currently " + description + "</p>");
      res.write(
        "<h1>The temperature in " +
          city +
          " is " +
          temperature +
          " degree Celsius</h1>"
      );
      res.write("<img src=" + imageURL + ">");
      res.send();
      // This converts Javascript object into JSON String.
      // var weather = {
      //     city: "Dublin",
      //     temperature: 10
      // };
      // console.log(JSON.stringify(weather));
    });
  });
});
