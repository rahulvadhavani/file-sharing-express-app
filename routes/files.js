const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const File = require('../models/file');
const {v4:uuid4} = require('uuid');
const sendMail  = require('../services/emailService');

let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null,'uploads/'),
    filename: (req, file, cb)=>{
        const uniqueName = `${Date.now()}-${Math.random(Math.random()*1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
})

let upload = multer({storage: storage,limits:{fileSize:1000000*100}}).single('myfile');


router.post('/',(req,res,next) => {

    upload(req, res, async(err)=>{

        // validate request
        if(!req.file){
            return res.json({error:"All fields are requried"});
        }
        if(err){
            return res.send({error: err.message});
        }
        
        // store in database
        const file = new File({
            filename: req.file.filename,
            uuid: uuid4(),
            path: req.file.path,
            size: req.file.size,
        });
        const response = await file.save();
        return res.json({file: `${process.env.APP_BASE_URL}/files/${response.uuid}`})
    });
    
});

router.post('/send-mail',async(req,res,next) => {
    try {
        console.log(process.env.APP_NAME);
        const {mail_from,mail_to,uuid} = req.body;
    
        if(mail_from == "" || mail_to == "" || uuid == ""){
            return res.status(422).send({error:"all filed are required."});
        }
        const file = await File.findOne({uuid:uuid});
        if(!file){
            return res.status(422).send({error:"Invalid uuid"});
        }
        // if(file.sender){
        //     return res.status(422).send({error:"Email already send."});
        // }
        file.sender = mail_from;
        file.receiver = mail_to;
        const response = await file.save();
        const bfile = await File.findOne({uuid:uuid});
        const d = new Date();
        let year = d.getFullYear();
        sendMail({
            from:mail_from,
            to:mail_to,
            subject:`FileShare`,
            text:`${mail_from} share this file to you.`,
            html:require('../services/emailTemplate')({
                from:mail_from,
                downloadLink:`${process.env.APP_BASE_URL}/files/${response.uuid}`,
                size:parseInt(file.size/1000)+' KB',
                expire:'24 hr',
                app_name:process.env.APP_NAME,
                year:year,
            })
        });
        return res.send({success: "Email Send Successfully."});
    } catch (error) {
        console.log(error);
        return res.send({error: error.message});
    }

});
 
module.exports = router;