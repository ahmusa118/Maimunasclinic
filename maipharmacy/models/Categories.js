const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const catSchema=new Schema({
name:{type:String,
required:true},
subCategory:{
    type:[
        {
            name:{
                type:String,
            required:true
            }
        }
    ]
},
collapse:{type:Boolean, default:false}

})
const Categories= mongoose.model('Categories', catSchema)
module.exports = Categories