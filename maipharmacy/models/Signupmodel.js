const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const signupschema=new Schema({
firstname:{type:String, required:true},
lastname:{type:String, required:true},
email:{type:String, required:true, unique:true},
address:{type:String, required:true},
password:{type:String, required:true},
phoneNumber:{type:String, required:true},
medicine:{
    type:[
{   
    name:{
        type:String
    },
    quantity:{
        type: Number,
         
    }
    ,category:{
        type: String,
   
    }
    , subcategory:{
        type: String,
        
    },
    amount:{
        type: Number,
        
    },
    date:{
        type: Date,
        default: Date.now()
    }
}

    ]
}


})

const Signupmodel = mongoose.model('Signupmodel', signupschema);
module.exports = Signupmodel