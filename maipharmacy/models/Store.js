const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const storeSchema=new Schema ({
email:{type:String, required:true},
total:{type:Number,required:true},
newArray:{
    type:[{
        orderNumber:{type:String}
    }]
}

})
const Store=mongoose.model('Store',storeSchema)
module.exports=Store