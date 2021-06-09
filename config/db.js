const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = () => {
    mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  }).then( () => {
        console.log('Connected to the database');
    }).catch( err => {
        onsole.error('Error connecting to the database');
    })
}

module.exports = connectDB;