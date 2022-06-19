const mongoose=require('mongoose')

const orderDetails=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Register'
    },
     productdt:[{
           
        type:mongoose.Schema.Types.ObjectId,
        ref:'Products'
        //   type:Array,
        //   ref:'Products'
        

        }],
    
    paymentMethod:{
        type:String

    },
    status:{
        type:String
    },
    totalAmount:{
        type:Number,
        default:0
    },
    
       
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
   
    OrderPlacedAt:{
        type:Date,
        default:Date.now()
    },
    orderstatus:{
        type:String,
    },
    cancel:{
          type:Boolean,
          default:false
    }

})

const OrderModel=mongoose.model('orderdetail',orderDetails)

module.exports=(OrderModel);