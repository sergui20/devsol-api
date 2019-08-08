const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    img: {
        type: String,
        default: "/assets/user-pic.png"
    },
    friends: {
        incomingRequests: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        outcomingRequests: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        friendsList: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
    github: {
        id: {
            type: String
        },
        authenticated: {
            type: Boolean,
            default: false
        }
    },
    location: {
        city: {
            type: String
        },
        coordinates: [Number]
    },
    recover: {
        type: Number
    }
})

userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
}

userSchema.methods.validatePassword = function(password) {
    if(!this.password) {
        return false;
    }

    return bcrypt.compareSync(password, this.password)
}

module.exports = mongoose.model('User', userSchema)