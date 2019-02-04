const express = require('express');
const router = express.Router();
const Workout = require('../models/workouts');
const User = require('../models/users');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');

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

router.post('/', upload.single('imageFile'), (req, res) => {
    console.log(req.body)
    const workout = {};
    workout.image = {};
    if (req.file) {
        const path = './uploads/' + req.file.filename;
        workout.image.data = fs.readFileSync(path);
        workout.image.contentType = req.file.mimetype;
        fs.unlinkSync(path)
    };
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

// show

router.get('/:id', async (req, res) => {
    // I prefer writing async, but this can all be done with callbacks too if you're more comfortable with those
    try {
        // find the workout by its id
        const workout = await Workout.findById(req.params.id);
        // once that is done, find the user currently logged in by their username
        // you could probably also find them by their id if you prefer
        const loggedInUser = await User.findOne({ username: req.session.username });
        // by default, a user has not liked a workout
        let liked = false;
        if (loggedInUser) {
            // the users that liked a workout are stored in an array on the model
            // the mechanics for putting the users in that array are in the next route
            for (let i = 0; i < workout.likes.length; i++) {
                // if they are in the array already, they can't like a workout again
                if (workout.likes[i].toString() === loggedInUser._id.toString()) {
                    liked = true;
                }
            }
        } else {
            // if you are not logged in, you cannot like
            // (if you do not include this, loggedInUser could return null and you would get an error)
            liked = true
        };
        res.render('workouts/show.ejs', {
            workout: workout,
            user: loggedInUser,
            liked: liked
        })
    } catch (err) {
        res.send(err)
    }
});

// like route

router.put('/:id/like', async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id)
        // find the logged in user
        const loggedInUser = await User.findOne({ username: req.session.username });
        // like before, voted defaults to false
        let liked = false;
        // if they are logged in
        if (loggedInUser){
            for (let i = 0; i < workout.likes.length; i++) {
                // as before, if they have already liked, they cannot like agaain
                if (workout.likes[i].toString() === currentUser._id.toString()) {
                    liked = true;
                }
            }
        } else {
            // if they are not logged in, they cannot like
            liked = true;
        }
        if (liked) {
            // if they have liked, redirect them to the workout's show page, which will not show a like button
            res.redirect(`/workouts/${req.params.id}`)
        } else {
            // if they have not liked, they have the button available
            // by pressing the button, they're liking the workout
            // we push them into the workout.likes array, so they can't like again
            workout.likes.push(loggedInUser._id);
            // save the database result so your db knows this happened
            // once you leave the route, the information is lost if you don't do this
            await workout.save();
            // redirect
            res.redirect(`/workouts/${req.params.id}`)
        }
    } catch (err) {
        res.send(err)
    }
});

// uploading images
router.get('/:id/upload', async (req, res) => {
    const workout = await Workout.findById(req.params.id);
    console.log(req.params.id, 'this should be the workout id');
    const uploadImage = workout.image;
    console.log(uploadImage, 'this should be the encoded image');
    res.set('Content-Type', uploadImage.contentType);
    res.send(uploadImage.data);
    console.log('end of route') 
})

/* 

==== PS ====
In order for any of this functionality to be useful, you're going to want to build
a workout show and index page. If you want this in a portfolio after the course
is over, you should probably do that anyway. I set the likes to print on the users
home page, but putting the button under the users model makes no sense if they're
supposed to be liking the actual workouts. Likewise, if you want people to create
multiple workouts, all you have to do is build off of the workout model and
controller that you already created. That's one of the project guidelines, not
just a feature to be added, so I don't feel like I should do that for you. If you
need any help on it, though, feel free to ask and I can try to help you figure it out.

*/


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