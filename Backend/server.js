
const express = require("express") ; 
const connectDB = require("./config/db") ; 
const path = require("path") ; 

const app = express() ; 

const PORT = process.env.PORT || 3000 ; 

// static files 

app.use(express.static('public')) ; 

// parsing json data - middleware (if ommitted, the req.body will be undefined)

app.use(express.json()) ; 

// database connection

connectDB() ; 

// Configure the template engine 

app.set('views', path.join(__dirname, '/views')) ; 

app.set('view engine', 'ejs') ; 

// Routes 

app.use('/api/files', require('./routes/files')) ; 

app.use('/files', require('./routes/show'))

app.use('/files/download', require('./routes/download')) ; 

app.listen(PORT, ()=>{
    console.log(`Listening on port: ${PORT}`);
})