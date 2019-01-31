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

//edit route
router.get('/:id/edit', (req, res) => {
    Workout.findById(req.params.id, (err, foundWorkout) => {

        User.find({}, (err, allUsers) => {
            // Finding the author that wrote the article we are trying to edit
            User.findOne({
                'workouts._id': req.params.id
            }, (err, workoutUser) => {

                if (err) {
                    res.send(err);
                } else {
                    res.render('workouts/edit.ejs', {
                        workout: foundWorkout,
                        users: allUsers,
                        workoutUser: workoutUser
                    });
                }
            });
        });
    });
});

router.put('/:id', (req, res) => {

    Workout.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    }, (err, updatedWorkout) => {

        User.findOne({
            'workouts._id': req.params.id
        }, (err, foundUser) => {
            console.log(foundUser)
            foundUser.workouts.id(req.params.id).remove();
            foundUser.workouts.push(updatedWorkout);
            foundUser.save((err, data) => {
                res.render('users/selecteduser.ejs', {
                    user: foundUser,
                    sessionId: req.session.userId
                });
            });
        });
    });
});



//delete route
router.delete('/:id', (req, res) => {
    Workout.findByIdAndRemove(req.params.id, (err, deletedWorkout) => {
        console.log(`deleted workout ${deletedWorkout}`)
        User.findOne({
            'workouts._id': req.params.id
        }, (err, foundUser) => {

            foundUser.workouts.id(req.params.id).remove();

            foundUser.save((err, data) => {
                if (err) {
                    res.send(err);
                    console.log(`foundUser.workouts ${foundUser.workouts}`)
                } else {
                    res.redirect('/users');
                }
            });
        });
    });
});

module.exports = router