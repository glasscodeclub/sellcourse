const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String
    },
    resetPwdToken: String,
    resetPwdExpire: Date,
    avatar: String,
    role: {
        type: String,
        enum: ['user', 'publisher', 'admin'],
        default: 'user'
  },
    courses: {
        type: [String],
        unique: true
    },
    cart: {
        type: [String]
    },
    createdAt: {
        type: Date,
        default: Date.now
   }
});


UserSchema.plugin(passportLocalMongoose);

UserSchema.methods.getResetPwdToken = function() {
    this.resetPwdToken = crypto.randomBytes(20).toString('hex');
    this.resetPwdExpire = Date.now() + 10 * 60 * 1000;
    console.log('token generated -');
    console.log(this.resetPwdToken);
    return this.resetPwdToken;
};

module.exports = mongoose.model("User", UserSchema);




