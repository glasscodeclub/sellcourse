const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({path: './config/config.env'});
const MONGO_URI = process.env.MONGO_URI;

const connectDB = () => {
    mongoose.connect(MONGO_URI, {
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