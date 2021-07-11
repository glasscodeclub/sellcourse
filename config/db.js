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
        console.error(err);
    })
}

module.exports = connectDB;