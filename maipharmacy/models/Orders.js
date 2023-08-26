const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const orderSchema=new Schema({

address: { type: String,
required:true},
phoneNumber:{type: String,
    required:true},
medname:{
    type:String,
    required:true
},
quantity:{
    type: Number,
    required:true
     
},
customeremail:{type: String,
    required:true},
  
category:{
    type: String,
    required:true
}
, subcategory:{
    type: String,
    required:true
},
amount:{
    type: Number,
    
},
price:{
    type: Number,
    required:true
     
},
paid:{
    type: String,
    default:'No'
},
orderNumber:{ type: String},
delivered:{type:String, default:'No'},
date:{
    type: Date,
    default: Date.now()
}
})
const Orders=mongoose.model('Orders', orderSchema)
module.exports=Orders