const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Workout = require('../models/workouts');


//create route
router.get('/new', (req, res) => {
    res.render('users/signup.ejs');
});

router.post('/', (req, res) => {
    console.log('req.body', req.body)
    User.create(req.body, (err, createdUser) => {
        if (err) {
            res.send(err)
        } else {
            console.log(createdUser);
            res.redirect('/profile')
        }
    });
});

//show for private page
router.get('/:id', (req, res) => {
    User.findById(req.params.id, (err, foundUser) => {
        console.log(`foundUser ${foundUser}`)
        if (err) {
            res.send(err)
        } else {
            res.render('users/show.ejs', {
                user: foundUser
            });
        }
    })
})

//show public pages
router.get('/:id', (req, res) => {
    User.findById(req.params.id, (err, foundUser) => {
        console.log(`foundUser ${foundUser}`)
        if (err) {
            res.send(err)
        } else {
            res.render('users/show.ejs', {
                user: foundUser
            });
        }
    })
})

module.exports = router;