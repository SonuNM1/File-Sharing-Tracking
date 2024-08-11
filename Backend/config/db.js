require('dotenv').config();
const mongoose = require("mongoose");

// Database connection
function connectDB() {
    mongoose.connect(process.env.MONGO_CONNECTION_URL)
    .then(() => {
        console.log('Database connected');
    })
    .catch((err) => {
        console.log("Database not connected: ", err);
    });
}

module.exports = connectDB;
