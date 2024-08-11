const router = require("express").Router() ; 
const multer = require("multer") ; 
const path = require("path") ; // NodeJS in-built module, tells the extension name of any file
const File = require("../models/file");
const {v4: uuid4} = require("uuid") ; 

let storage = multer.diskStorage({
    destination: (req, file, callback)=> callback(null, 'uploads/'),
    filename: (req, file, callback)=>{
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}` ; // since the file name should be unique - 
        callback(null, uniqueName) ; 
    }
})

let upload = multer({
    storage,
    limit: {fileSize: 100000 * 100}, // 100 MB
}).single('myfile') ; 

router.post('/', (req, res)=>{

    // Store file 

    upload(req, res, async (err)=>{

        // validate request 

        if(!req.file){
            return res.json({error: 'All fields are required'}) ; 
        }

        if(err){
            return res.status(500).send({error: err.message})
        }

        // Store into the database 

        const file = new File({
            filename: req.file,filename, 
            uuid: uuid4(),
            path: req.file.path,
            size: req.file.size
        }) ; 

        const response = await file.save() ; 
        return res.json({file: `${process.env.APP_BASE_URL}/files/${response.uuid}`}) ; // http://localhost:3000/files/2334u=fjdk34u934u20
    });

     


    // Response -> Link

}) ; 

router.post('/send', async (req, res)=>{
    
    const {uuid, emailTo, emailFrom} = req.body ; 

    // Validate request 

    if(!uuid || !emailTo || !emailFrom){
        return res.status(422).send({error: "All fields are required"}) ; 
    }

    // GET data from database 

    const file = await File.findOne({uuid: uuid}) ; 

    if(file.sender){
        return res.status(422).send({error: "Email already sent. "}); 
    }

    file.sender = emailFrom ;
    file.receiver = emailTo ;
    
    const response = await file.save() ; 

    // Send email 

    const sendMail = require("../services/emailService") ; 

    sendMail({
        from: emailFrom,
        to: emailTo,
        subject: "SyncShare file sharing",
        text: `${emailFrom} shared a file with you.`,
        html: require('../services/emailTemplate')({
            emailFrom: emailFrom,
            downloadLink : `${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size: parseInt(file.size/1000) + ' KB',
            expires: '24 hours'
        })
    }) ; 

    return res.send({success: true})

})

module.exports = router ; 