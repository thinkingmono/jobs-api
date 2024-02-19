const mongoose = require("mongoose");
//Encrypt tool dependencie
const bcryptjs = require('bcryptjs')
//Jason Web Token dependencie import
const jwt = require('jsonwebtoken')

//User's data model schema.
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: [true, 'Please provide a email'],
        //Email validation using a regex
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please provide a valid email'
        ],
        //Email must be unique validator.
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
    },
})

//Run encryption password before save document into mongo db collection.
UserSchema.pre('save', async function () {
    //Set encryption complexity to 10.
    const salt = await bcryptjs.genSalt(10);
    //Set user's password with password encryption. pass pwd and complexity.
    this.password = await bcryptjs.hash(this.password, salt)
})

//Create Jason Web Token method into userSchema. Run when user log or register.
UserSchema.methods.createJWT = function () {
    //Create jwt through sign method. pass user info as payload, jwt_secret env to decoded and token expiration date with env variable.
    return jwt.sign({ userId: this._id, name: this.name }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME })
}

//Compare password method into UserSchema. Run when login.
UserSchema.methods.comparePassword = function (candidatePassword) {
    //Compare login password with registered pwd in db. Use bcryptjs dependencie.
    const isMatch = bcryptjs.compare(candidatePassword, this.password)
    //Return tru or false if pwd match or not.
    return isMatch
}

//Export User model with UserSchema.
module.exports = mongoose.model('User', UserSchema);