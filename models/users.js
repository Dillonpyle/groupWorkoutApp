const mongoose = require('mongoose');
const Workout = require('./workouts');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    workouts: [Workout.schema]
});

const User = mongoose.model('User', userSchema);
module.exports = User;