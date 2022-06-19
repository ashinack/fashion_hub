// const { reject } = require('bcrypt/promises');
// const { ObjectId } = require('mongodb');
const {Products,Admin,Category}=require('../models/adminSchema')
const Users=require('../models/userSchema')
const subCategoryModel=require('../models/subcategorySchema')
const brandNameModel=require('../models/brandnameScheme')
const Register=require('../models/userSchema')
const OrderSchema=require('../models/OrderSchema')
const multer=require('multer')
const path=require('path');
const { resolve } = require('path')
const async = require('hbs/lib/async')
const { response } = require('express')
// const res = require('express/lib/response');
// const async = require('hbs/lib/async');
// const { resolve } = require('path');
// const { response } = require('../app');
// const { findOne } = require('../models/subcategorySchema');

// multer storage
var storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./public/images')
    },
    filename:(req,file,cb)=>{
       cb(null,Date.now()+'--'+file.originalname)
    }
})

// multer upload
var upload=multer({
    storage:storage
})

// add product save
const addProduct = (adminproduct,mainImage,nextImage)=>{
        return new Promise(async(resolve,reject)=>{
            // console.log(adminproduct);
            const subcategories=await subCategoryModel.findOne({subcategoryname:adminproduct.subcategoryname})
            const brand= await brandNameModel.findOne({brandname:adminproduct.branddet})
            let maini=mainImage
            let nexti=nextImage
           const addproduct= await new Products({
               bname:adminproduct.bname,
               price:adminproduct.price,
               description:adminproduct.description,
            //    categoryname:adminproduct.categoryname,
                subcategoryname:subcategories._id, 
                brandnames:brand._id,          
               size:adminproduct.size,
               allImages:{maini,nexti},
               quantity:adminproduct.quantity
           })
           await addproduct.save().then((data)=>{
               console.log(data);
               resolve(data)
            
         
       })
         
        
            })
        }

    // add category save    

    const  addCategory=(category)=>{
            return new Promise(async(resolve,reject)=>{
                let categoryname=await Category.findOne({categoryname:category.categoryname})
                if(categoryname){
                    reject({status:false,message:"allready categoryname exist"})
                }
                else{
                    const addcategory=new Category({
                    categoryname:category.categoryname,
                    
                })
                  await addcategory.save((err,result)=>{
                            if(err){
                                reject({status:false,message:"category is not added"})
                            }else{
                                resolve({result,message:"category is added successfully"})
                            }
                  })
                   

                }

                
              
            })
        }  

    // category details find    
        
     const   getCategory=()=>{
            return new Promise((resolve,reject)=>{
                Category.find().lean().then((category_data)=>{
                     resolve(category_data);
                     console.log(category_data)
                })
            })
        } 

       
        //delete category
        const deletecategory=(catId)=>{
            return new Promise((resolve,reject)=>{
                Category.deleteOne({_id:catId}).then(()=>{
                    resolve()
                })
            })
        }
        //edit category
        const editCategory=(catId)=>{
            return new Promise((resolve,reject)=>{
                let catdt=Category.findOne({_id:catId}).lean()
                resolve(catdt)
            })
        }
        //post edit category
        const posteditcat=(catId,dt)=>{
            return new Promise((resolve,reject)=>{
                let updatecat=Category.updateOne({_id:catId},{
                    $set:{
                        categoryname:dt.categoryname
                    }
                })
                resolve(updatecat)
            })
        }

    // product details find list   
        
     const viewProducts=()=>{
            return new Promise((resolve,reject)=>{
                Products.find().lean().populate('subcategoryname').populate('brandnames').then((product_detail)=>{
                    resolve(product_detail)
                   

                })
                
            })
        }  
    
        
    // product details find id edit  
     const  getProductDetails=(proId)=>{
            return new Promise((resolve,reject)=>{
                const getprodectdetails=Products.findOne({_id:proId}).lean().populate('subcategoryname').populate('brandnames')
                    resolve( getprodectdetails)
                    console.log( getprodectdetails+"######")
                    
               
                 
                    // console.log(data)
                  
             
                
            })
        } 
    



// product update

const updateProduct=(proId,details,mainImage,nextImage)=>{
      return new Promise(async(resolve,reject)=>{
         let maini=mainImage
            let nexti=nextImage
            const subcategories=await subCategoryModel.findOne({subcategoryname:details.subcategoryname})
             const brand= await brandNameModel.findOne({brandname:details.brands})
        Products.updateOne({_id:proId},{
          $set:{
            bname:details.bname,
                    price:details.price,
                    description:details.description,
                    size:details.size,
                    subcategoryname:subcategories._id,
                    brandnames:brand._id,   
                    allImages:{maini,nexti},
                    quantity:details.quantity
            // address:userDetails.address
          }
        }).then((response)=>{
          resolve()
        })
      })
    }

    // product delete    

        const  deleteProduct=(proId)=>{
            return new Promise((resolve,reject)=>{
                Products.deleteOne({_id:proId}).then((response)=>{
                    resolve(response)
                    // console.log(deletedData)
                })
            })

        }

        // signup userdetails find

        const userInfo=()=>{
            return new Promise((resolve,reject)=>{
                Users.find().lean().then((userdata)=>{
                    resolve(userdata)
                    console.log(userdata)
                })
            })
        }

        // signup user delete

        const deleteUser=(userId)=>{
            return new Promise((resolve,reject)=>{
                Users.deleteOne({_id:userId}).then((delData)=>{
                    resolve()
                    console.log(delData)
                })
            })
        }

       
    

     // subcategory add

    const addSubCategory=(data)=>{
        return new Promise(async(resolve,reject)=>{
            const subcategoryss=await subCategoryModel.findOne({subcategoryname:data.subcategoryname})
            const category=await Category.findOne({categoryname:data.categoryname})
            if(subcategoryss){
                reject({status:false,message:"subcategory name already exist"})
            }else{
                let subcategories=new subCategoryModel({
                    subcategoryname:data.subcategoryname,
                    category:category._id,

                })
                await subcategories.save((err,result)=>{
                    if(err){
                        reject({status:false,message:'subcategory is not added'})
                    }else{
                        resolve({status:true,message:"subcategory added successfully"})
                    }
                })
            }
        })
    }
    

    // subcategory details find
    
    const listALLsubcategory=()=>{
        return new Promise(async(resolve,reject)=>{
            const product=await subCategoryModel.find({}).lean().populate('category')
            resolve(product)
        })
    }
    //delete subcategory
    const deleteSubcategory=(deleteId)=>{
        return new Promise(async(resolve,reject)=>{
          let deletesub=await subCategoryModel.deleteOne({_id:deleteId})
          resolve({status:true})
        })
    }

    //brand details get
    const getBrandDetails=()=>{
        return new Promise(async(resolve,reject)=>{
            let brand=await brandNameModel.find({}).lean()
            resolve(brand)
        })
    }

    //brandname post

    const addBrandName=(brandnamedet)=>{
        return new Promise(async(resolve,reject)=>{
            const brandss=await brandNameModel.findOne({brandname:brandnamedet.brandname})
            if(brandss){
                reject({status:false,message:"brandname already exist"})
            }
            else{
                 const brandname=new brandNameModel({
                brandname:brandnamedet.brandname
            })
              await brandname.save((err,result)=>{
                  if(err){
                      reject({status:false,message:"brandname is not added"})
                  }else{
                      resolve({status:true,message:'brandname added successfully'})
                  }
              })
            }

           
            

        })

    }
    
   //delete brands
   const deleteBrand=(brandId)=>{
    return new Promise((resolve,reject)=>{
        brandNameModel.deleteOne({_id:brandId}).then(()=>{
            resolve()
        })
    })
   } 

   const findsubcat=(catId)=>{
    return new Promise(async(resolve,reject)=>{
        let finsub=await subCategoryModel.find({category:catId}).lean()
        console.log('@@@2');
        console.log(finsub);
        resolve(finsub)
    })
   }

   //user block
 const blockUser=(userId) => {
  console.log(userId);
  return new Promise(async (resolve, reject) => {
    const user = await Register.findByIdAndUpdate(
      { _id: userId },
      { $set: { block: true } },
      { upsert: true }
    );
    resolve(user);
  });
}

 const unBlockUser=(userId) => {
  return new Promise(async (resolve, reject) => {
    const user = await Register.findByIdAndUpdate(
      { _id: userId },
      { $set: { block: false } },
      { upsert: true }
    );
    resolve(user);
  });
}
//get userorderlist
const getUserOrders=()=>{
    return new Promise(async(resolve,reject)=>{
        const userOrder=await OrderSchema.find({cancel:false}).populate('productdt').lean()
        resolve(userOrder)
    })
}
//get  cancel orders
const getCancelOrders=()=>{
    return new Promise(async(resolve,reject)=>{
        const cancelOrder=await OrderSchema.find({cancel:true}).populate('productdt').lean()
        resolve(cancelOrder)
    })
}
//change order status
const changeOrderStatus=(orderId)=>{
    console.log(orderId);
    return new Promise(async(resolve,reject)=>{
      let order=await OrderSchema.findByIdAndUpdate({_id:orderId},{
            $set:{orderstatus:'shipped'}
        })
         resolve(order)
       
       
    })
}

const changeOrderStatusdelivered=(orderId)=>{
    console.log(orderId);
    return new Promise(async(resolve,reject)=>{
      let order=await OrderSchema.findByIdAndUpdate({_id:orderId},{
            $set:{orderstatus:'delivered'}
        })
         resolve(order)
       
       
    })
}
//get all products
const getAllProducts=()=>{
    return new Promise(async(resolve,reject)=>{
        await Products.find({}).lean().then((response)=>{
            resolve(response)
        })
    })
}

const getTotalUsers=()=>{
    return new Promise(async(resolve,reject)=>{
        let totalusercount=await Register.find({}).count().lean()
            resolve(totalusercount)
            console.log(totalusercount); 
    })
}
const getTotalOrders=()=>{
    return new Promise(async(resolve,reject)=>{
        let totalorder=await OrderSchema.find({}).count().lean()
        resolve(totalorder)
    })
}

const getTotalProduct=()=>{
    return new Promise(async(resolve,reject)=>{
        let totalproduct=await Products.find({}).count().lean()
        resolve(totalproduct)
    })
}

const getTotalAmount=()=>{
    return new Promise(async(resolve,reject)=>{
        let OrderTotalAmount=await OrderSchema.aggregate([
           
                  
         {$group: {
       _id: null,
      "Totalamount": {
         $sum: "$totalAmount"
       }
            }
        }
        
        ])
        console.log('999999');
        console.log(OrderTotalAmount[0].Totalamount);
       let sum=OrderTotalAmount[0].Totalamount
        resolve(sum)
    })
}

const getOrderdt=()=>{
    return new Promise(async(resolve,reject)=>{
        await OrderSchema.find({}).lean().then((response)=>{
            resolve(response)
        })

    })
}

module.exports={
    upload,addProduct, addCategory, getCategory,viewProducts,getProductDetails, deleteProduct,userInfo,deleteUser, updateProduct,
    addSubCategory,listALLsubcategory,addBrandName,getBrandDetails, deleteSubcategory,deletecategory,deleteBrand,findsubcat,editCategory,
    posteditcat, unBlockUser,blockUser,getUserOrders,changeOrderStatus,changeOrderStatusdelivered,getAllProducts,getTotalUsers,
    getTotalOrders,getTotalProduct,getTotalAmount,getOrderdt,getCancelOrders
    
}
    
