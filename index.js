import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_key =  "1c9bbbd4526611b778629d75d72ddabd";
var lon, lat, result_1 = 0, result_2 = 0, suggest;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/geoLocation", async (req, res) => {
    try {
        //console.log(req.body);
        const city_name = req.body["cityName"];
        //console.log(city_name);
        result_1 = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=${API_key}`);
        console.log(`http://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=${API_key}`);
          lon = result_1.data.coord.lon;
          lat = result_1.data.coord.lat;
        result_1 = result_1.data;
        res.redirect("/forcast");
    } catch (error) {
        console.log(error);
    };
});

function get_suggest(mainWeather) {
    switch (mainWeather) {
        case 'Clear':
            return "It's a clear day! Great for a walk in the park.";
        case 'Clouds':
            return "It's cloudy. Good day for indoor activities.";
        case 'Rain':
        case 'Drizzle':
            return "It's rainy. Don't forget your umbrella!";
        case 'Snow':
            return "It's snowing. Time for some winter fun!";
        case 'Thunderstorm':
            return "Thunderstorms expected. Stay indoors and stay safe.";
        default:
            return "Explore the day as it comes!";
    }
};

app.use((req, res, next) => {
    if (result_1 === 0) {
        next();
    } else {
        suggest = get_suggest(result_1.weather[0].main);
        next();
    }
});

app.get("/forcast", async (req, res) => {
    try {
        result_2 = await axios.get(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_key}`);
        console.log(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_key}`);
        result_2 = result_2.data;
        res.redirect("/");
    } catch (error) {
        console.log(error);
    };
});

app.get("/", (req, res) => {
    // console.log(2);
    //  console.log(result_1);
    //  console.log(result_2);
    res.render("index.ejs", {
        current : result_1,
        forecast : result_2,
        suggestions : suggest
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});