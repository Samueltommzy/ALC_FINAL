"use strict";

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

let userSchema = new Schema({
    userName: { type: String, required: true },
    password: { type: String, required: true, minlength: [6, "The password is too short, minimum length is {MINLENGTH}"] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    userType : {type : String , required: true},
    available: { type: Boolean, default: true }
});

userSchema.pre("save", function(next) {
    let user = this
    if (!user.isModified("password")) return next()

    bcrypt.hash(user.password, null, null, function(err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
    });
});

userSchema.methods.passwordCheck = function(password, callback) {
    let user = this;

    bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) return callback(err);

        callback(null, isMatch);
    });
}

module.exports = mongoose.model("User", userSchema);
