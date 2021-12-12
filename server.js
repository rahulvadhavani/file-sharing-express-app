const express = require('express');
const path = require('path');
const cors = require('cors');
var bodyParser = require('body-parser');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
app.use(express.static('public'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
const connectDB = require('./config/db');
connectDB();

// Cors
const corsOptions = {
    origin:process.env.ALLOWED_CLIENTS.split(',')
}
app.use(cors(corsOptions));


app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use('/api/files',require('./routes/files')); 
app.use('/files',require('./routes/show'));

app.get('/',(req,res) => {
    return res.render('index');
});

app.listen(PORT,()=>{
    console.log(`Listen on port ${PORT}`);
})