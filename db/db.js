const mongoose = require('mongoose');

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost/workouts';
/* if your env variables aren't public (and they shouldn't be), I need a way to work on your 
site without them, so the connectionString needs to have an option to connect
to a local host. It will always follow the first path it runs into that works, so
for your deployed site it will work with your URI variable, but for forked versions
it needs to be accessible without access to your env file */

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