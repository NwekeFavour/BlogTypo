const mongoose = require('mongoose')

const Schema = mongoose.Schema

const playlist = new Schema({
    image: {
        data: Buffer,
        contentType: String
    },
    playlistname: {
        type: String,
        required: true
    }, 
    link: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('playlist', playlist);