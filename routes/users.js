var express = require('express');
const async = require('hbs/lib/async');
let router = express.Router();
let Register=require('../models/userSchema')
let Category=require('../models/adminSchema')
var userHelpers=require('../helpers/user-helpers');
var adminHelpers=require('../helpers/admin-helpers')
const { response } = require('express');
// const req = require('express/lib/request');
// const { response } = require('../app');

//verfylogin

// const verifyLogin=(req,res,next)=>{
//   if(req.session.loggedIn){
//     next()
//   }else{
//     res.redirect('/login');
//   }

// }

const verifyLogin=(req,res,next)=>{
  if(req.session.user){
    next()
  }else if(req.session.admin){
    next()
  }
  else{
    res.redirect('/login');
  }

}


/* GET users listing. */
  //  home page detaila
// router.get('/',async function(req, res, next) {
//         userHelpers.getallProductdetails().then((userproducts)=>{

//    console.log(userproducts+'//////')
//    if(req.session.user){
//     let user=req.session.user
//     let cartCount=await userHelpers.getCartCount(req.session.user._id)


//      res.render('home',{user,userproducts})
//    }
//    else if(req.session.admin){
//      res.redirect('/login')
//    }else{
//   //  console.log(userproducts+'****')
//    res.render('home',{userproducts});
//    }
// })
// });

router.get('/',async function(req, res, next) {
  let userproducts=await userHelpers.getallProductdetails()
  let category=await adminHelpers.getCategory()
  let cartCount=null 
  //  console.log(userproducts+'//////')
   if(req.session.user){
    let user=req.session.user
    let cartCount=await userHelpers.getCartCount(req.session.user._id)


     res.render('home',{user,userproducts,cartCount,category})
   }
   else if(req.session.admin){
     res.redirect('/login')
   }else{
  //  console.log(userproducts+'****')
  console.log(category);
   res.render('home',{userproducts,cartCount,category});
   }

});


// Login page get method

router.get('/login',function(req,res){
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if(req.session.user){
    res.redirect('/')
  }else if(req.session.admin){
    res.redirect('/admin')
  }
  else{
  res.render('user/login',{'loginErr':req.session.loginErr,'blockerr':req.session.userblock})
  req.session.loginErr=false;
  req.session.userblock=false
  }
})

  // signup page get method

router.get('/signup',function(req,res){
  res.render('user/signup')
})



 // signup post method

router.post('/signup',userHelpers.doSignup)



// login post method

// router.post('/login',(req,res)=>{
//   userHelpers.doLogin(req.body).then((response)=>{
//     if(response.user){
//       req.session.loggedIn=true
//       req.session.user=response.user
//       res.redirect('/')
//     }else if(response.admin){
//       req.session.admin=response.admin;
//       res.redirect('/admin');
      
//     }else{
//       req.session.loginErr="Invalid username or password"
//       res.redirect('/login')
//     }
//   })
// })

router.post('/login',(req,res)=>{
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  userHelpers.doLogin(req.body).then((response)=>{
    if(response.user){
      
      req.session.loggedIn=true
      req.session.user=response.user
      res.redirect('/')
    }else if(response.admin){
      req.session.admin=response.admin;
      
      res.redirect('/admin');
      
    }else{
      req.session.userblock="you are blocked"
      req.session.loginErr="Invalid username or password"
      res.redirect('/login')
    }
  })
})


// userdetails update get method

router.get('/update',async(req,res)=>{
  let user=req.session.user
  
  const UserDetails=await Register.findOne({_id:user}).lean()
  console.log( UserDetails);
  res.render('user/update_profile',{user,UserDetails})

 
})

//user details update post
router.post('/update-profile/:id',(req,res)=>{
  userHelpers.updateuserdetails(req.body,req.params.id).then(()=>{
   
    res.redirect('/update')
  })

})


// product details get method id display

router.get('/product-details/:id',async(req,res)=>{
  let user=req.session.user;
  
  userHelpers.getproductdetail(req.params.id).then((data)=>{
    // console.log(data+"asshinnn")
    res.render('user/product_details',{user,data});
    
  })
  
  
  // res.render('user/product_details',{user});
})




//otp page render
router.get('/verify_otp',(req,res)=>{
  if(req.session.user){
    res.redirect('/')
  }else{
  res.render('user/verify_otp')
  }
})



//otp page post
router.post('/verifyOtp',userHelpers.verifyOTP)


//cart page render

router.get('/cart',verifyLogin,async(req,res,next)=>{
  let user=req.session.user
  let cartProducts=await userHelpers.getCartDetails(req.session.user._id)
  let cartCount=await userHelpers.getCartCount(req.session.user._id)
  let grandTotal=await userHelpers.getTotalAmount(req.session.user._id)
  
  res.render('user/cart',{user,cartProducts,cartCount,grandTotal})
})

//add to cart action


router.post('/add-tocart/:id',verifyLogin,(req,res)=>{
 
  userHelpers.addToCart(req.params.id,req.session.user._id,req.body).then(()=>{
    res.redirect('/')
    // res.json({status:true})
  })

})

//place order page render

router.get('/place-order/:id',verifyLogin,async(req,res)=>{
  let user=req.session.user
  let totalam=await userHelpers.getTotalAmount(req.session.user._id)
  let adddet=await userHelpers.getAddressdt(req.params.id)
  //  userHelpers.getAddressdt(req.params.id).then((adddet)=>{
  res.render('user/place-order',{user,totalam,adddet})
  //  })
//  console.log(adddet);
})

//place order post

router.post('/place-order',async(req,res)=>{
  let productss=await userHelpers.getCartProductList(req.body.userId)
  let totalam=await userHelpers.getGrandTotal(req.body.userId)
  console.log('8888888888');
  console.log(productss);
  userHelpers.placeOrder(req.body,productss,totalam).then((orderId)=>{
    if(req.body['payment-method']=='COD'){
          res.json({codSuccess:true})
    }else{
      userHelpers.generateRazorpay(orderId, totalam).then((response)=>{
        res.json(response)

      })
    }
     
  })
  // console.log(req.body);
})

router.post('/verify-payment',(req,res)=>{
  console.log(req.body);
  userHelpers.verfiyPayment(req.body).then(()=>{
    userHelpers.changePaymentStatus(req.body['order[receipt]']).then(()=>{
       res.json({status:true})
    })
  }).catch((err)=>{
    res.json({status:false,errMsg:''})
  })
})

//order confirm page render
router.get('/order-confirm',async(req,res)=>{
  let user=req.session.user
 
  res.render('user/order-confirm',{user})
})



router.get('/display-order',async(req,res)=>{
  let user=req.session.user
  let orders=await userHelpers.getUserOrders(req.session.user._id)
  console.log('345678');
 console.log(orders);
 res.render('user/display-order',{user,orders})
})

//get orderproducts render
router.get('/view-orderproducts/:id',async(req,res)=>{
  let user=req.session.user
  let orderproduct=await userHelpers.getOrderProducts(req.params.id)
  console.log(orderproduct);
  res.render('user/view-orderproduct',{user,orderproduct})
})

//add address page render
router.get('/address',async(req,res)=>{
  let user=req.session.user
  let totalam=await userHelpers.getTotalAmount(req.session.user._id)
  let getaddress=await userHelpers.getAddress(req.session.user._id)
  
  res.render('user/address',{user,totalam,getaddress})
})
//add address post
router.post('/address',(req,res)=>{
  userHelpers.addAddress(req.body,req.session.user._id).then((response)=>{
      res.redirect('/address')
  })
 
})

//change quantity

router.post('/change-product-quantity',(req,res)=>{
  let user=req.session.user
  userHelpers.changeProductQuantity(req.body,user).then((response)=>{
    res.json(response)
    
  })

})

// cart product delete
router.get('/cart_delete/:id',(req,res)=>{
  userHelpers.cartDelete(req.params.id).then(()=>{
    
    res.redirect('/cart')
  })
})

//product subcategorydetails

router.get('/sub',async(req,res)=>{
  let user=req.session.user;
  const pt=await userHelpers.getsubDetails()
  res.render('user/dupatta',{pt,user})

})

//wishlist page render

router.get('/wishlist',verifyLogin,async(req,res)=>{
    let user=req.session.user;
    const wish=await userHelpers.getWishList(req.session.user._id)
   res.render('user/wishlist',{wish,user})
})

//add-to-wishlist action

router.get('/wishlist/:id',verifyLogin,(req,res)=>{
  userHelpers.addToWishList(req.session.user._id,req.params.id).then(()=>{
        res.redirect('/')
  })
  
})

//delete wishlist

router.get('/delete-wishlist/:id',(req,res)=>{
  userHelpers.deleteWishList(req.params.id).then(()=>{
    res.redirect('/wishlist')
  })
})



//reset password email render
router.get('/resetpassword-email',userHelpers.getUserResetPage)

//reset password email post

router.post('/resetpassword-email',userHelpers.forgetPasswordEmailVerify)

//reset password otp page render

router.get('/resetpassword-verifyotp',(req,res)=>{
  res.render('user/resetpassword_verifyotp')
})

//reset password verify otp post

router.post('/resetpassword-verifyotp',userHelpers.forgetPasswordOTP)



//resetpassword page render

router.get('/resetpassword',(req,res)=>{
  res.render('user/resetpassword')
})

//reset password post

router.post('/resetpassword',userHelpers.updateNewPassword)

//get subcategory
router.get('/find-subcat/:id',async(req,res)=>{
  let user=req.session.user;
  let category=await adminHelpers.getCategory()
 let response=await userHelpers.displaySubCat(req.params.id)
  let cat=await userHelpers.displayAllCat(req.params.id)
    console.log(cat);
    res.render('home2',{response,cat,user,category})
 
  
})
//find only sub

router.get('/find/:id',(req,res)=>{
  let user=req.session.user;
  userHelpers.findOneSub(req.params.id).then((response)=>{
    res.render('sub',{response,user})
  })
})

//about us
router.get('/aboutus',(req,res)=>{
  let user=req.session.user
  res.render('Aboutus',{user})
})
 //contact us
 router.get('/contact',(req,res)=>{
  let user=req.session.user
  res.render('contact',{user})
 })

 //order cancel
 router.get('/cancel-order/:id',(req,res)=>{
  userHelpers.cancelOrder(req.params.id).then((response)=>{
    res.redirect('/display-order')
  })
 })

// user logout

router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/login')
})

module.exports = router;
