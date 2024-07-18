const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Data = new Schema({
    image: {
        data: Buffer,
        contentType: String,
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    optionalimage: {
        data: Buffer,
        contentType: String
    },
    secoptionalimage: {
        data: Buffer,
        contentType: String
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


