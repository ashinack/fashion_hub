const mongoose=require('mongoose');


const users=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    number:{
       type:Number
    },
    block:{
        type:Boolean,
        default:false
    }

})


const Register=new mongoose.model("Register",users);



module.exports=(Register);