const mongoose = require('mongoose');
const { stringify } = require('querystring');
const noteSchema = new mongoose.Schema({
  id:{
    type: String, 
    required:true    
  },
  title: {
    type: String, 
    max: 255,
    required: true
  },
  note: {
    type: String,
    required: true    
  },
  dateCreated: {
    date: Date,
    required: true
  },
  user: {
    userid: String,
    required: true
  }
});

module.exports = mongoose.model('noteSchema');