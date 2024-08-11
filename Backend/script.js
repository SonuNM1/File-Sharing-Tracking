
const File = require('./models/file') ; 
const fs = require("fs") ; 
const connectDB = require("./config/db") ; 

connectDB() ; 

async function fetchData() {
    // fetch files older than 24 hours 

    const pastDate = new Date(Date.now() - (24 * 60 * 60 * 1000)) ; // in ms

    const files = await File.find({createdAt: {$lt: pastDate}}) ; // it will give us array of files 

    if(files.length){
        for(const file of files){
            try{
                fs.unlinkSync(file.path) ;
            await file.remove() ; 
            
            console.log(`Successfully deleted: ${file.filename}`) ; 
            }
            catch(err){
                console.log(`Error while deleting file: ${err}`) ; 
            }
        }
        console.log('Job done') ; 
    }
}

fetchData().then(process.exit()) ; 