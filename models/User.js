const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    dob: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please fill a valid email address",
        ],
    },
    hashPassword: {
        type: String,
        required: true,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

userSchema.methods.generateToken = async function () {
    try {
        const token = jwt.sign({ _id: this._id.toString() }, 'thisisthesecretkeyforcreatingtoken',);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (e) {
        console.log(e);
    }
}

const User = mongoose.model('User', userSchema);
module.exports = User;