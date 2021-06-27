const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
    username: String,
    email: {
        type: String,
        isUnique: true,
        isRequired: true
    },
    password: String,
    resetPwdToken: String,
    resetPwdExpire: Date
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

