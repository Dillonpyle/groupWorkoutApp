// require('dotenv').config()
const express = require("express");
const app = express();
require("./db/db");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const session = require('express-session');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');
const loginController = require('./controllers/login');
const usersController = require('./controllers/users');
const workoutsController = require('./controllers/workouts');

//middleware

app.use(express.static(__dirname + '/public'));

app.use(session({
    secret: "THIS IS A RANDOM STRING SECTRET",
    // ^^^ you have an env file somewhere, why aren't you putting this in it
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
app.listen(process.env.PORT || 3000, () => {
    console.log('listening on port 3000');
})