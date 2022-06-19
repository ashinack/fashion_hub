const mongoose=require('mongoose')

const subCategory=new mongoose.Schema({
    subcategoryname:{
         type:String,
         required:true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required:true
    }
})

const SubCategoryModel=mongoose.model("SubCategoryModel",subCategory)

module.exports=(SubCategoryModel);