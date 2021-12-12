const File = require('./models/file');
const fs = require('fs');
const conneactDB = require('./config/db');
conneactDB();

async function fetchData(){
    try{
        const pastDate = new Date(Date.now() - (24 * 1000 * 60 * 60));
        const files = await File.find({createdAt: { $lt: pastDate}});
        if(files.length){
            for(const item of files){
                try{
                    console.log(`The-file deleted successfully ${item.filename}`);
                    fs.unlinkSync(item.path);
                    await item.remove();
                }catch(error){
                    console.log(error);
                }
                console.log('cron job done');
            }
        }
    }catch(error){
        console.log(error);
    }
}

fetchData().then(process.exit);