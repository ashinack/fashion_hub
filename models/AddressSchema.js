const mongoose=require('mongoose')

const AddressDetails=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Register'
    },
     Address:[{
    name:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true,
    },
    Place:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
     pincode:{
        type:Number,
        required:true
    },
    
    
    mobile_no:{
       type:Number,
       required:true  
    },
    
   
    }]
})

const AddressModel=mongoose.model('AddressModel',AddressDetails)

module.exports=(AddressModel);


  