const mongoose=require('mongoose')

const brandName=new mongoose.Schema({
    brandname:{
        type:String,
        required:true
    }
})

const brandNameModel=mongoose.model('brandname',brandName)

module.exports=(brandNameModel);