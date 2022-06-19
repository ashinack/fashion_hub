const mongoose=require('mongoose');
const { required } = require('nodemon/lib/config');

const cart=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Register',
        required:true
    },
    cartItems:[{
        products:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Products',
            required:true
        },
        quantity:{
            type:Number,
            default:1
    
        },
        size:{
            type:String,
            
        },
        subtotal:{
            type:Number,
            default:0
            
        },
        shippingCharge:{
            type:Number,
            default:50
        }
        
    }],
    total_a:{
        type:Number,
        default:0
    },
    total:{
        type:Number,
        default:0
    }
})




const cartModel=mongoose.model('carModel',cart)

module.exports=(cartModel);