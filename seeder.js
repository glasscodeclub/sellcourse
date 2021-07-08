const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');


// Load env vars
dotenv.config({path: './config/config.env'});

// Load models
const UserModel = require('./models/user');


// connect to database
mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
});

// read the json files in _data
const users = JSON.parse(fs.readFileSync(`${__dirname}/data/userdata.json`, 'utf-8'));


// Import data
const importData = async() =>{
    try {
        await UserModel.create(users);
        console.log('Data loaded');
        process.exit();
    } catch (err) {
        console.error(err);
    }
}


const deleteData = async() =>{
    try {
        await UserModel.deleteMany();
        console.log('Data deleted ');
        process.exit();
    } catch (err) {
        console.error(err);
    }
}

if(process.argv[2] === '-i'){
    importData();
} else if(process.argv[2] === '-d'){
    deleteData();
}