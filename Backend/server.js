require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');
const cors = require('cors');

// Cors 

/*
const corsOptions = {
    origin: process.env.ALLOWED_CLIENTS ? process.env.ALLOWED_CLIENTS.split(',') : '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    preflightContinue: false,
   optionsSuccessStatus: 204
  };
*/

const corsOptions ={
  origin: ['http://127.0.0.1:5500','https://syncshare.netlify.app']
}


// Default configuration looks like
// {
//     "origin": "*",
//     "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
//     "preflightContinue": false,
//     "optionsSuccessStatus": 204
//   }

app.use(cors(corsOptions))

app.use(express.static('public'));

const connectDB = require('./config/db');
connectDB();

app.use(express.json());

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

// Routes 
app.use('/api/files', require('./routes/files'));
app.use('/files', require('./routes/show'));
app.use('/files/download', require('./routes/download'));


app.listen(PORT, console.log(`Listening on port ${PORT}.`));