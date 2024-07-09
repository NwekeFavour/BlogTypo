const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Data = new Schema({
    image: {
        data: Buffer,
        contentType: String
    },
    // imageType: {
    //     type: String,
    //     required: true
    // },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('post', Data)


