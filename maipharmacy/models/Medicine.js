const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const medSchema=new Schema({
    name:{
        type: String,
        required: true,
        unique:true
    },
    description:{
        type: String,
        required: true  
    },
    stock:{
        type: Number,
        required: true  
    }
    ,category:{
        type: String,
        required: true  
    }
    , subcategory:{
        type: String,
        required: true  
    },
    price:{
        type: Number,
        required: true 
    },
    page:{
        type: Number,
        default:0
    },
    images: {
        type: [String],
        validate: {
          validator: function (array) {
            return array.every(item => item.match(/\.(jpg|jpeg|png)$/));
          },
          message: 'Invalid image format. Only JPG, JPEG, and PNG files are allowed.'
        }
      }


})
const Medicine = mongoose.model('Medicine', medSchema)
module.exports = Medicine
