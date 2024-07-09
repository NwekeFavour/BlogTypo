const mongoose = require('mongoose');
const connectDB = async () => {

    try {
        mongoose.set('strictQuery', false);
        const connect = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`database is connected sucessfully: ${connect.connection.host}`);
    } catch (e) {
        console.error(e);
    }
}     

module.exports = connectDB;   