const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    answers: [{
        type: Schema.Types.ObjectId,
        ref: 'Answer'
    }],
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Post', postSchema)
