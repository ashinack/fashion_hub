const mongoose=require('mongoose');

const admins=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    

})
const products=new mongoose.Schema({
    
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    // size:{
    //     type:String,
    //     required:true
    // },

    
     subcategoryname:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'SubCategoryModel',
        required:true
    },
    allImages:{
        type:Array,
        required:true

    },
    quantity:{
        type:Number,
        required:true
    },
    brandnames:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'brandname',
        required:true
    }
    // filename:{
    //     type:String,
    //     unique:true,
    //     required:true
    // },
    // contentType:{
    //     type:String,
    //     required:true
    // }

})

const category=new mongoose.Schema({
    categoryname:{
        type:String,
        required:true
    }
})


const Admin=new mongoose.model("Admin",admins)
const Products=new mongoose.model("Products",products)
const Category=new mongoose.model("Category",category)
module.exports={Admin,Products,Category};