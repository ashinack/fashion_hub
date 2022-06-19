const mongoose=require('mongoose');


const wishlist=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Register',
        required:true
    },
   
    wishlistItems:[{
        products:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Products',
            required:true,
            
        }
       
        
    }]
})




const wishListModel=mongoose.model('wishListModel',wishlist)

module.exports=(wishListModel);