const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({path: './config/config.env'});

// Load models
const Discount = require('./models/discount.model');

// connect to database
mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
});


// read the json files in data
const discounts = JSON.parse(fs.readFileSync(`${__dirname}/data/discountcodes.json`, 'utf-8'));

console.log(discounts)

// Import data
const importData = async() =>{
    try {
        await Discount.create(discounts);
        console.log('Discount data loaded');
        process.exit();
    } catch (err) {
        console.error(err);
    }
}


const deleteData = async() =>{
    try {
        await Discount.deleteMany();
        console.log('Discount data deleted ');
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