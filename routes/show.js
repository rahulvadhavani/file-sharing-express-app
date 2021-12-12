const router = require('express').Router();

const path = require('path');
const File = require('../models/file');

router.get('/:uuid',async(req,res) => {
    try{
    
        const file = await File.findOne({uuid:req.params.uuid});
        if(!file){
            return res.render('download',{error: 'kink has been rexpired.'});
        }
        return res.render('download',{
            uuid: file.uuid,
            fileName: file.filename,
            fileSize: file.size,
            downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`,
        });
    }catch(err){
        return res.render('download',{error: 'Somthing went wrong!!'});
    }
});


router.get('/download/:uuid', async(req,res)=>{
    const file = await File.findOne({uuid:req.params.uuid});
        if(!file){
            return res.render('download',{error: 'kink has been rexpired.'});
        }
        const filePath = `${__dirname}/../${file.path}`;
        res.download(filePath); 
})
module.exports = router;