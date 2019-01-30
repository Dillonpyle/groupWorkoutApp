const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Workout = require('../models/workouts');

//index route
router.get('/', (req, res) => {
    User.find({}, (err, allUsers) => {
        res.render('users/home.ejs', {
            currentUser: req.session.username,
            users: allUsers
        });
    });
});

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
            res.redirect('/users')
        }
    });
});



//Adding new edit route
router.get("/:id/edit", (req, res) => {
    workouts.findByIdAndUpdate({}, (err, workoutFound) => {
        if (err) {
            res.send(err)
        } else {
            res.render("workouts/edit.ejs", {
                workouts: workoutFound
            })
        }
    });
});
//ends here 



//show selecteduser page
router.get('/:id', (req, res) => {
    User.findById(req.params.id, (err, foundUser) => {
        console.log(`foundUser ${foundUser}`)
        if (err) {
            res.send(err)
        } else {
            res.render('users/selecteduser.ejs', {
                user: foundUser
            });
        }
    })
})


//delete
router.delete('/:id', (req, res) => {
    User.findByIdAndRemove(req.params.id, (err, deletedUser) => {
        const workoutIds = [];
        for (let i = 0; i < deletedUser.workouts.length; i++) {
            workoutIds.push(deletedUser.workouts[i]._id);
        }
        Workout.deleteMany({
                _id: {
                    $in: workoutIds
                }
            },
            (err, data) => {
                console.log(`data ${data}`)
                console.log(`deleted ${deletedUser}`);
                res.redirect('/users');
            }
        )
    })
})







// //show for private page
// router.get('/:id', (req, res) => {
//     User.findById(req.params.id, (err, foundUser) => {
//         console.log(`foundUser ${foundUser}`)
//         if (err) {
//             res.send(err)
//         } else {
//             res.render('users/show.ejs', {
//                 user: foundUser
//             });
//         }
//     })
// })


module.exports = router;