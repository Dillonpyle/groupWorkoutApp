const mongoose = require('mongoose');

const connectionString = 'mongodb://localHost/blog'

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
});

mongoose.connection.on('connected', () => {
    console.log('mongoose connnected to ', connectionString);
});

mongoose.connection.on('error', (err) => {
    console.log('mongoose error ', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('mongoose disconnnected from ', connectionString);
});