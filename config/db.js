require('dotenv').config();
const mongoose = require('mongoose');
function connectDB(){
    mongoose.connect(process.env.MONGO_CONNECTION_URL, function(err, db) {
        if (err) {
            console.log('Unable to connect to the server. Please start the server. Error:', err);
        } else {
            console.log('db Connected to Server successfully!');
        }
    });
}

module.exports = connectDB;