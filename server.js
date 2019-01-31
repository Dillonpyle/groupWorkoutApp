const express = require("express");
const app = express();
require("./db/db");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const session = require('express-session');
const loginController = require('./controllers/login');
const usersController = require('./controllers/users');
const workoutsController = require('./controllers/workouts');

//middleware

app.use(express.static(__dirname + '/public'));

app.use(session({
    secret: "THIS IS A RANDOM STRING SECTRET",
    resave: false,
    saveUninitialized: false
}));

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({
    extended: false
}));



//routes
app.use('/login', loginController);
app.use('/users', usersController);
app.use('/workouts', workoutsController);



app.get("/", (req, res) => {
    res.render("index.ejs")
})

//server
app.listen(3000, () => {
    console.log("Listening on port 3000")
})