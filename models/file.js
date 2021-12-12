const monoose = require('mongoose');
const Schema = monoose.Schema;

const fileSchema = new Schema({
    filename: {type: String,required:true},
    path: {type: String,required:true},
    size: {type: String,required:true},
    uuid: {type: String,required:true},
    sender: {type: String,required:false},
    receiver: {type: String,required:false},
},{timestamps:true});

module.exports = monoose.model("File",fileSchema);