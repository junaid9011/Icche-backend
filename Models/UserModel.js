const bcrypt = require('bcryptjs/dist/bcrypt');
const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        require: true
    },
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        maxlength: [30, 'your name cannot exceed 30 character']
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter valid Email']
    },
    phone: {
        type: String,
        required: [true, 'Please enter your phone number'],
        unique: true,
        minlength: [11, 'Minimum 11 digit required']
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minlength: [6, 'your password cannot exceed 6 character'],
        select: false
    },
    //  avatar:{
    //      public_id:{
    //          type:String,
    //          required:true,
    //      },
    //      url:{
    //          type:String,
    //          required:true
    //      },

    //  },
    address: {
        type: String,
        require: true
    },
    nid: {
        type: String,
        require: true
    },
    role: {
        type: String,
        default: 'user'
    },
    businessType: {
        type: String,
        require: true
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPsswordToken: String,
    resetPsswordExpire: Date

})

// Encrypting password before save
userSchema.pre('save', async function (next) {// here can't use arrow functions
    if (!this.isModified('password')) {
        next();
    }// this if block check if the password is modified or not if not it doesn't encrypt again
    this.password = await bcrypt.hash(this.password, 10);
})
//compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}
//Return JWT Token

userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    })
}
// Generate password reset token
userSchema.methods.getResetPasswordToken = function () {
    //Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');
    // hash and reset token
    this.resetPsswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    //set token expire time
    this.resetPsswordExpire = Date.now() + 30 * 60 * 1000;

    return resetToken;
}
module.exports = mongoose.model('user', userSchema)