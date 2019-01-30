const express = require('express');
const router = express.Router();
const Workout = require('../models/workouts');
const User = require('../models/users');

//index route 
router.get('/', (req, res) => {
    Workout.find({}, (err, foundWorkouts) => {
        if (err) {
            res.send(err);
        } else {
            res.render('workouts/index.ejs', {
                workouts: foundWorkouts
            });
        }
    });
});

//create route
router.get('/new', (req, res) => {
    User.find({}, (err, allUsers) => {
        console.log(allUsers);
        res.render('workouts/new.ejs', {
            users: allUsers,
            userId: req.session.userId
        });
    });
});

// router.post('/', (req, res) => {
//     console.log(req.body)

//     User.findById(req.body.userId, (err, foundUser) => {
//         console.log('foundUser from post route ' + foundUser)
//         Workout.create(req.body, (err, createdWorkout) => {
//             if (err) {
//                 res.send(err);
//             } else {
//                 foundUser.workouts.push(createdWorkout);
//                 foundUser.save((err, data) => {
//                     res.redirect('/users')
//                 });
//             }
//         });
//     });
// });

router.post('/', (req, res) => {
    console.log(req.body)

    User.findById(req.session.userId, (err, foundUser) => {

        console.log("session id " +
            req.session.userId);
        console.log('foundUser ' + foundUser)
        Workout.create(req.body, (err, createdWorkout) => {
            if (err) {
                res.send(err);
            } else {
                foundUser.workouts.push(createdWorkout);
                foundUser.save((err, data) => {
                    res.redirect('/users')
                });
            }
        });
    });
});


module.exports = router