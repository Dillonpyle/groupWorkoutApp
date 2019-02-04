const mongoose = require('mongoose');

const workoutSchema = mongoose.Schema({
    workout: {
        type: String
    },
    variation: {
        type: String
    },
    reps: {
        type: String
    },
    weight: {
        type: String
    },
    likes: [],
    image: {
        contentType: String,
        data: Buffer
    }
});

const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout;