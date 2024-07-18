const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const NextSxhema = new Schema({
    coverimage : {
        data: Buffer,
        contentType: String
    },
    profileimage : {
        data: Buffer,
        contentType: String
    },
    name: {
        type: String,
        required: true
    },
    ref:{
        type: String,
        required: true
    },
    link:{
        type: String,
        required: true
    },
    about: {
        type: String,
        required: true
    },
    publishDate: {
        type: Date,
        default: Date.now
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

const MonthlyProfilesSchema = new mongoose.Schema({
    title: { type: String, required: true },
    month: { type: String, required: true },
    year: { type: Number, required: true },
    profiles: [NextSxhema],
    createdDate: { type: Date, default: Date.now }
});

const Nextbeats = mongoose.model('nextbeats', MonthlyProfilesSchema)

module.exports = Nextbeats