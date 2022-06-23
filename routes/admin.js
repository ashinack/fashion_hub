var express = require('express');
var router = express.Router();
const { Products, Admin, Category } = require('../models/adminSchema');
const subCategoryModel = require('../models/subcategorySchema')
// var adminHelpers=require('../helpers/admin-helpers');
const multer = require('multer')
let adminHelpers = require('../helpers/admin-helpers');
let userHelpers = require('../helpers/user-helpers')
const async = require('hbs/lib/async');
// const { response } = require('../app');
// const res = require('express/lib/response');
// const req = require('express/lib/request');
// const async = require('hbs/lib/async');
// const fs=require('fs');

// const { encode } = require('punycode');
// const { resolve } = require('path');




/* GET admin home page. */


router.get('/',async function(req,res){
res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
if(req.session.admin){
  let total_user=await adminHelpers.getTotalUsers()
  let total_order=await adminHelpers.getTotalOrders()
  let totalProduct=await adminHelpers.getTotalProduct()
  let totalorderamount=await adminHelpers.getTotalAmount()
  let orderdt=await adminHelpers.getOrderdt()
  res.render('admin/dashboard', { admin: true, total_user, total_order, totalProduct,totalorderamount,orderdt});
}else{
  res.redirect('/login')
}


})


// add product get method

router.get('/add-products', async (req, res) => {
  
  const subcat = await adminHelpers.listALLsubcategory()
  const brands = await adminHelpers.getBrandDetails()
  res.render('admin/add-product', { admin: true, subcat, brands })
})


  //add product post method


  router.post('/add/', adminHelpers.upload.fields([{ name: "images", maxCount: 1 }, { name: "image1", maxCount: 1 }]), (req, res) => {
    let mainImage = req.files.images[0].filename
    let nextImage = req.files.image1[0].filename
    // console.log(req.body);
    adminHelpers.addProduct(req.body, mainImage, nextImage).then((id) => {


      res.redirect("/admin/add-products")
      // console.log(req.files.images);



    })
  })


//add category get method

router.get('/addCategory/', (req, res) => {

  res.render('admin/add-category', { admin: true, err: req.session.categoryError, categorymsg: req.session.categorypopup });
  req.session.categoryError = null
  req.session.categorypopup = null
})


//addcategory post method

router.post('/add-category/', (req, res) => {
  adminHelpers.addCategory(req.body).then((categorymsg) => {
    console.log(categorymsg.message);
    req.session.categorypopup = categorymsg.message
    res.redirect('/admin/addCategory');
  }).catch((err) => {
    console.log(err.message);
    req.session.categoryError = err.message
    res.redirect('/admin/addCategory')
  })

})


//view category list
router.get('/view-category', (req, res) => {
  adminHelpers.getCategory().then((categorydata) => {
    res.render('admin/view-category', { admin: true, categorydata })
  })
})
//delete category list
router.get('/delete-category/:id', (req, res) => {
  adminHelpers.deletecategory(req.params.id).then(() => {
    res.redirect('/admin/view-category')
  })
})
//edit category list
router.get('/edit_cat/:id', async (req, res) => {
  let editcat = await adminHelpers.editCategory(req.params.id)
  console.log(editcat);
  res.render('admin/editcategory', { admin: true, editcat })
})
//edit category post
router.post('/edit/:id', (req, res) => {
  adminHelpers.posteditcat(req.params.id, req.body).then(() => {
    res.redirect('/admin/view-category')
  })

})

// product details list page

router.get('/view-product', (req, res) => {
  adminHelpers.viewProducts().then((product_detail) => {
     res.render('admin/view-products', { admin: true, product_detail })
  })

})





// edit product get method

router.get('/edit_product/:id', async (req, res) => {
  let products = await adminHelpers.getProductDetails(req.params.id)
  const subcategorydet = await adminHelpers.listALLsubcategory()
  const brands = await adminHelpers.getBrandDetails()
  res.render('admin/edit-product', { admin: true, products, subcategorydet, brands })
  console.log(products + "******")
})


// edit product post method

router.post('/editpro/:id', adminHelpers.upload.fields([{ name: "images", maxCount: 1 }, { name: "image1", maxCount: 1 }]), async (req, res) => {
  const id = req.params.id
  let product_det = await Products.findById(id).lean()



  let mainImage = req.files.images ? req.files.images[0].filename : product_det.allImages[0].maini
  let nextImage = req.files.image1 ? req.files.image1[0].filename : product_det.allImages[0].nexti

  adminHelpers.updateProduct(req.params.id, req.body, mainImage, nextImage).then(() => {
    res.redirect('/admin/view-product')

  })

})

// product delete page

router.get('/delete/:id', (req, res) => {
  adminHelpers.deleteProduct(req.params.id).then((response) => {
    console.log(response)
    res.redirect('/admin/view-product/')
  })
})

// signup user details list
router.get('/user-info', (req, res) => {
  adminHelpers.userInfo().then((users) => {
    console.log(users)
    res.render('admin/view-userInfo', { admin: true, users })
  })

})

// signup user delete

router.get('/userdelete/:id', (req, res) => {
  adminHelpers.deleteUser(req.params.id).then((response) => {
    console.log(response)
    res.redirect('/admin/user-info')
  })

})

// add subcategory get method



router.get('/add-subcategory', async (req, res) => {
  const result = await adminHelpers.getCategory()
  console.log(result + "****")
  res.render('admin/add-subcategory', { admin: true, result, err: req.session.categoryError, data: req.session.popupmsg })
  req.session.categoryError = null
  req.session.popupmsg = null

})

// add subcategory post



router.post('/subcategory-add/', (req, res) => {
  adminHelpers.addSubCategory(req.body).then((data) => {
    console.log(data.message)
    req.session.popupmsg = data.message
    res.redirect('/admin/add-subcategory')
  }).catch((err) => {
    console.log(err.message);
    req.session.categoryError = err.message
    res.redirect('/admin/add-subcategory')
  })
})
//view subcategorylist
router.get('/view-subcategory', (req, res) => {
  adminHelpers.listALLsubcategory().then((response) => {
    res.render('admin/view-subcategory', { admin: true, response })
  })

})
//delete subcategory 
router.get('/delete-sub/:id', (req, res) => {
  adminHelpers.deleteSubcategory(req.params.id).then(() => {
    res.redirect('/admin/view-subcategory')
  })
})
//add brandname get method

router.get('/add-brand', (req, res) => {
  res.render('admin/add-brandname', { admin: true, err: req.session.brandErr, bmsg: req.session.brandmessage })
  req.session.brandErr = null
  req.session.brandmessage = null
})

//brandname post method
router.post('/add-brand', (req, res) => {
  adminHelpers.addBrandName(req.body).then((data) => {
    console.log(data.message)
    req.session.brandmessage = data.message
    res.redirect('/admin/add-brand')
  }).catch((err) => {
    console.log(err.message)
    req.session.brandErr = err.message
    res.redirect('/admin/add-brand')
  })

})
//view brand list
router.get('/view-brands', (req, res) => {
  adminHelpers.getBrandDetails().then((data) => {
    res.render('admin/view-brands', { admin: true, data })

  })
})
//delete brand
router.get('/delete-brand/:id', (req, res) => {
  adminHelpers.deleteBrand(req.params.id).then(() => {
    res.redirect('/admin/view-brands')
  })
})
//render cat sub 
router.get('/cat-sub', async (req, res) => {
  let catsub = await adminHelpers.getCategory()
  res.render('admin/add-cat-sub', { catsub })
})

router.get('/find-sub/:id', async (req, res) => {

  let findsub = await adminHelpers.findsubcat(req.params.id)
  console.log(findsub + '***');
  res.render('admin/add-cat-sub', { findsub })

})
//user block
router.get("/blockUser/:id", (req, res) => {
  const proId = req.params.id;
  console.log(proId);
  console.log("sdjfhusguasuashguahshasdgs");
  adminHelpers.blockUser(proId).then((response) => {
    res.json({ status: true })
  });
});

//user unblock
router.get("/unBlockUser/:id", (req, res) => {
  const proId = req.params.id;
  console.log("esfhusayfuahiuashahsfhasdu");
  adminHelpers.unBlockUser(proId).then((response) => {
  });
});
//success ordermanage render
router.get("/order-manage", async (req, res) => {
  let orderList = await adminHelpers.getUserOrders()
  res.render('admin/order-manage', { admin: true, orderList })
})
//cancel order
router.get("/cancel-order", async (req, res) => {
  let orderList = await adminHelpers.getCancelOrders()
  res.render('admin/cancel-order', { admin: true, orderList })
})
//orderstatus manage
router.get('/manage-orderstatus/:id', (req, res) => {
  adminHelpers.changeOrderStatus(req.params.id).then(() => {
    res.redirect('/admin/order-manage')
  })
})

router.get('/manage-orderstatusdelivered/:id', (req, res) => {
  adminHelpers.changeOrderStatusdelivered(req.params.id).then(() => {
    res.redirect('/admin/order-manage')
  })
})


//search product
router.post('/search', async (req, res) => {
  let searchText = req.body['search_name'];
  console.log(searchText + "ooooooooooooooooooo");
  try {
    let products = await userHelpers.getallProductdetails()

    if (searchText) {
      let userproducts = products.filter((u) => u.brandnames.brandname.includes(searchText));
      let category = await adminHelpers.getCategory()
      console.log(userproducts, "products");
      res.render('search', { userproducts, category })

    }

  } catch (err) {
    console.log(err);
  }

})

// admin logout
router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/login')
})



module.exports = router;
