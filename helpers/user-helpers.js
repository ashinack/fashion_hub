const Register = require('../models/userSchema');
var bcrypt = require('bcrypt');
const { Products, Admin } = require('../models/adminSchema')
const subCategoryModel = require('../models/subcategorySchema')
const carModel = require('../models/cartSchema')
const wishListModel = require('../models/wishlistSchema')
const AddressModel = require('../models/AddressSchema')
const nodemailer = require('nodemailer');
const { response } = require('express');
const mongoose = require('mongoose');
const OrderSchema = require('../models/OrderSchema');
const Razorpay = require('razorpay');
const async = require('hbs/lib/async');
const { resolve } = require('path');
var instance = new Razorpay({
    key_id: 'rzp_test_SxDhXz8D2nP1A5',
    key_secret: 'JKX7ppeUEgDqGs8YUTFfx3vg',
});

// password secure
const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10)
        return passwordHash;
    } catch (err) {
        console.log(err.message)
    }
}


/*-----------for otp verification in signup-----------*/

const sendVerifyMail = async (name, email, otpGenerator) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            service: 'gmail',
            port: 587,
            secure: false,
            auth: {
                user: 'fashionhu321@gmail.com',
                pass: 'ckzlmsaghuiyiajz'

            },
            tls: {
                rejectUnauthorized: false
            }
        })

        //    const otpGenerator= await Math.floor(1000 + Math.random() * 9999)

        console.log(otpGenerator);
        const mailOptions = {
            from: 'fashionhu321@gmail.com',
            to: email,
            subject: 'for email verification',
            text: 'hii Your otp code is ' + otpGenerator
        }
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error)
            }
            else {
                console.log("mail has been send", info.response)
            }
        })

    }
    catch (error) {
        console.log(error);
    }
}


/*--------------verify otp-----------*/

const verifyOTP = async (req, res) => {
    let userOTP = req.body.otp
    let userNewOTP = req.session.OTP
    console.log(userNewOTP + '1111111')
    let userDetails = req.session.userDetails
    console.log(userDetails + "88888888")
    try {
        if (userNewOTP == userOTP) {
            const user = new Register({
                name: userDetails.name,
                email: userDetails.email,
                number: userDetails.number,
                address: userDetails.address,
                password: userDetails.password
            })

            const newUser = await user.save();
            console.log(newUser)
            req.session.userLoggedIn = true
            req.session.user = newUser
            req.session.userDetails = null
            req.session.OTP = null
            res.redirect("/")
        } else {
            req.session.ErrOtp = "Invalid OTP !!!"
            res.redirect("/verify_otp")
        }

    }
    catch (error) {
        console.log(error)
    }
}


//  user signup
const doSignup = async (req, res) => {

    try {

        const userPassword = await securePassword((req.body.password));

        const user = new Register({
            name: req.body.name,
            email: req.body.email,
            number: req.body.number,
            address: req.body.address,
            password: userPassword
        })
        console.log(user + "7777777")
        req.session.userDetails = user

        const otpGenerator = Math.floor(1000 + Math.random() * 9000);
        req.session.OTP = otpGenerator;

        if (user) {
            sendVerifyMail(req.body.name, req.body.email, otpGenerator)
            res.redirect('/verify_otp');

        } else {
            res.redirect('/signup');

        }

    }
    catch (error) {
        console.log(error)
    }

}

// user login and admin
const doLogin = (userData) => {
    return new Promise(async (resolve) => {
        let response = {}
        // console.log(userData)
        let user = await Register.findOne({ email: userData.email })
        let admin = await Admin.findOne({ email: userData.email })
        if (user) {
            if (user.block == false) {


                bcrypt.compare(userData.password, user.password).then((status) => {
                    if (status) {
                        console.log(status);
                        console.log('login sucess');
                        response.user = user
                        // console.log(useremail)
                        response.status = true
                        resolve(response)
                    } else {
                        console.log('login failed');
                        resolve({ status: false })
                    }
                })
            } else {
                console.log("you are blocked");
                resolve({ status: false })
            }
        } else if (admin) {


            if (userData.password == admin.password) {
                console.log('login sucess admin')
                response.admin = admin;
                response.status = true
                resolve(response)
            } else {
                console.log('login failed admin...')
                resolve({ status: false })
            }
        }

        else {
            console.log('login failed admin');
            resolve({ status: false })
        }

    })
}

//

// /---------------for reset password send mail------------------/

// const sendPasswordResetMail = async (name, email, tocken) => {
const sendPasswordResetMail = async (name, email, otpGenerator) => {
    try {
        const mailTransporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            service: "gmail",
            port: 587,
            secure: false,
            auth: {
                user: "fashionhu321@gmail.com",
                pass: "ckzlmsaghuiyiajz"
            },
            tls: {
                rejectUnauthorized: false
            }

        });

        const mailDetails = {
            from: "fashionhu321@gmail.com",
            to: email,
            subject: "Reset Password",
            text: 'Your otp code is ' + otpGenerator
            // text: "just random texts ",
            // html: '<p>Hi ' + name + ' click <a href ="http://localhost:3000/users/reset_password?tocken=' + tocken + '"> here to </a> to reset your password</p>'
        }
        mailTransporter.sendMail(mailDetails, (err, Info) => {
            if (err) {
                console.log(err);
            } else {
                console.log("email has been sent ", Info.response);
            }
        })
    } catch (error) {
        console.log(error.message);
    }
}

// /--------------------forget password-----------/

//error msg forget password

const getUserResetPage = async (req, res) => {

    try {

        res.render("user/resetpassword-email", { mailMsg: req.session.checkMailMsg, Errmsg: req.session.checkMailErr })
        req.session.checkMailMsg = false
        req.session.checkMailErr = false
    } catch (error) {
        console.log(error);
    }
}

const forgetPasswordEmailVerify = async (req, res) => {
    try {
        const email = req.body.email;
        console.log(email);
        const userResetData = await Register.findOne({ email: email })
        console.log(userResetData + "uuuuuuu");
        req.session.userResetid = userResetData._id;
        if (userResetData) {
            // const validRandomString=randomstring.generate();
            // req.session.randomString = validRandomString;

            const otpGenerator = Math.floor(1000 + Math.random() * 9000);
            console.log(otpGenerator)
            req.session.OTP = otpGenerator;
            // sendPasswordResetMail(userResetData.name,userResetData.email,validRandomString); 
            sendPasswordResetMail(userResetData.name, userResetData.email, otpGenerator);
            req.session.checkMailMsg = "Check your Email to reset your password"
            //res.redirect("/forget_password")
            res.redirect('/resetpassword-verifyotp')

        }
        else {
            req.session.checkMailErr = "Invalid Email Id"
            res.redirect("/forget_password")
        }
    }
    catch (error) {
        console.log(error.message)
    }
}

///-------------- forget password verify otp-----------/

const forgetPasswordOTP = async (req, res) => {
    let userOTP = req.body.otp
    let userNewOTP = req.session.OTP
    //let userDetails=req.session.userDetails
    // console.log(userDetails)
    try {
        if (userNewOTP == userOTP) {
            req.session.OTP = null
            res.redirect("/resetpassword")

        } else {
            req.session.ErrOtp = "Invalid OTP !!!"
            res.redirect("/resetpassword-verifyotp")
        }

    }
    catch (error) {
        console.log(error)
    }
}


///------------- update the user password------------/
const updateNewPassword = async (req, res) => {

    try {
        const newPassword = req.body.password
        const confirmpassword = req.body.confirmpassword
        console.log(newPassword)
        if (newPassword == confirmpassword) {


            const resetId = req.session.userResetid
            console.log(resetId)
            const newSecurePassword = await securePassword(newPassword);
            const updatedUserData = await Register.findByIdAndUpdate({ _id: resetId }, { $set: { password: newSecurePassword } })
            console.log(updatedUserData)
            //req.session.randomString = null;
            req.session.userResetid = null;
            req.session.resetSuccessMsg = "Your password updated successfully.."
            res.redirect("/login")
        }
        else {
            req.session.resetErrorMsg = "password doesn't match"
            res.redirect('/resetpassword')
        }


    } catch (error) {
        console.log(error.message);
    }
}




//cards  user view product
const getallProductdetails = () => {
    return new Promise(async (resolve) => {
        let userproducts = await Products.find().lean().populate('brandnames')
        console.log(userproducts);
        resolve(userproducts)
    })
}

//product details get id

const getproductdetail = (proId) => {
    return new Promise(async (resolve) => {
        let viewuserproduct = await Products.findOne({ _id: proId }).lean().populate('brandnames')
        resolve(viewuserproduct)
    })
}

//user profile upadte
const updateuserdetails = (userdt, userId) => {
    return new Promise(async (resolve) => {
        await Register.updateOne({ _id: userId }, {
            $set: {
                name: userdt.name,
                email: userdt.email,
                address: userdt.address,
                number: userdt.number
            }
        }).then((response) => {
            resolve()
        })
    })
}

//cart product add
const addToCart = (proId, userId, dt, quantity) => {
    return new Promise(async (resolve) => {
        let totalObj = await Products.findOne({ _id: proId });
        let perTotal = totalObj.price;
        let qtyObj = await carModel.findOne({ user: userId })
        let userdt = await carModel.findOne({ user: userId })
        var subtotal = perTotal

        if (userdt) {
            if (qtyObj.cartItems[0]) {
                let qty = qtyObj.cartItems[0].quantity
                var subtotal = perTotal * qty
            }
            let proExist = userdt.cartItems.findIndex(product => product.products == proId)

            if (proExist != -1) {

                carModel.updateOne({ 'cartItems.products': proId, user: userId, size: dt.size },
                    {
                        $inc: { 'cartItems.$.quantity': 1, 'cartItems.$.subtotal': perTotal },
                        // $set:{'cartItems.$.subtotal':subtotal},
                    }).then((response) => {
                        console.log(response + "999999");
                        resolve()
                    })
            } else {


                carModel.updateOne({ user: userId }, {
                    $push: { cartItems: [{ products: proId, size: dt.size, quantity, subtotal }] }
                }).then((response) => {
                    console.log(response + "oooooo")
                    resolve()
                })
            }

        } else {
            let cartObj = {
                user: userId,
                cartItems: [{ products: proId, size: dt.size, quantity, subtotal }],


            }
            carModel(cartObj).save().then(() => {
                resolve()
            })


        }
    })
}



//cart product get
const getCartDetails = (userId) => {
    return new Promise(async (resolve) => {
        const cartDetails = await carModel.find({ user: userId }).populate({ path: 'cartItems.products', populate: { path: 'brandnames' } }).lean()
        resolve(cartDetails)
    })

}

// get total amount

const getTotalAmount = (userId) => {
    console.log(userId);
    return new Promise(async (resolve) => {
        cart = await carModel.findOne({ user: userId })
        console.log(cart);
        let id = mongoose.Types.ObjectId(userId)
        if (cart) {
            let totalAmount = await carModel.aggregate([
                {
                    $match: { user: id }
                },
                {
                    $unwind: '$cartItems'
                },
                {
                    $project: {

                        subtotal: "$cartItems.subtotal",
                        shippingCharge: "$cartItems.shippingCharge"
                    },

                },
                {
                    $project: {
                        subtotal: 1,
                        shippingCharge: 1
                    }
                },
                {
                    $group: {
                        _id: null,
                        total_am: { $sum: "$subtotal" },
                        ship: { $sum: "$shippingCharge" }
                    }
                },
                {
                    $addFields: {
                        total: { $sum: ["$total_am", "$ship"] }
                    }
                }
            ])
            console.log(totalAmount);
            if (totalAmount == null) {
                resolve({ status: true })

            } else {
                let grandTotal = totalAmount.pop();

                console.log("%j", grandTotal)
                await carModel.findOneAndUpdate({ user: userId }, { $set: { total: grandTotal.total, total_a: grandTotal.total_am } })
                //    resolve({status:true})
                resolve(grandTotal)

            }
        }
        else {
            resolve()
        }

    })

}

//get cart count

const getCartCount = (userId) => {
    return new Promise(async (resolve) => {
        let count = 0
        let cart = await carModel.findOne({ user: userId })
        // console.log(cart+"00000")
        if (cart) {
            count = cart.cartItems.length
        }
        resolve(count)
    })
}

//change quantity in cart

const changeProductQuantity = async (details) => {

    let count = parseInt(details.count)
    let quantity = parseInt(details.quantity)
    let product = await Products.findOne({ _id: details.products });
    let price = product.price;

    return new Promise((resolve) => {
        if (count == -1 && quantity == 1) {

            carModel.updateOne({ 'cartItems._id': details.cart },
                {
                    $pull: { cartItems: { products: details.products } }
                }).then(() => {

                    resolve({ removeProduct: true })
                })
        } else {
            if (count == 1) {
                let qty = quantity + 1;
                let subtotal = qty * price;
                console.log(count);
                carModel.updateOne({ 'cartItems._id': details.cart, 'cartItems.products': details.products },
                    {

                        $inc: { 'cartItems.$.quantity': count },
                        $set: { 'cartItems.$.subtotal': subtotal }
                    }
                ).then(() => {

                    resolve({ status: true })

                })
            }
            else {
                let qty = quantity - 1;
                let subtotal = qty * price;
                carModel.updateOne({ 'cartItems._id': details.cart, 'cartItems.products': details.products },
                    {

                        $inc: { 'cartItems.$.quantity': count },
                        $set: { 'cartItems.$.subtotal': subtotal }
                    }
                ).then(() => {

                    resolve({ status: true })

                })
            }

        }


    })
}

//addtowishlist



const addToWishList = (userId, proId) => {

    return new Promise(async (resolve) => {
        console.log(proId)
        let prodExist = await wishListModel.findOne({ user: userId, 'wishlistItems.products': proId })

        if (!prodExist) {
            console.log(true);

            wishListModel.updateOne({ user: userId },
                {
                    $push: { wishlistItems: { products: proId } }

                }, { upsert: true }
            ).then((r) => {
                console.log(r);
            })
            resolve()
        } else {
            resolve()
        }
    })

}

//get wishlist items

const getWishList = (userId) => {
    return new Promise(async (resolve) => {
        let wish = await wishListModel.find({ user: userId }).populate({ path: 'wishlistItems.products', populate: { path: 'brandnames' } }).lean()

        resolve(wish)

    })
}

//delete wishListItems

const deleteWishList = (proId) => {
    return new Promise(async (resolve) => {
        let prodExist = await wishListModel.findOne({ 'wishlistItems.products': proId })
        if (prodExist) {
            wishListModel.updateOne({ 'wishlistItems.products': proId },
                {
                    $pull: { wishlistItems: { products: proId } }
                }).then(() => {
                    resolve()

                })
        }

    })
}



//cart product delete

const cartDelete = (proId) => {
    return new Promise((resolve) => {
        carModel.updateOne({ 'cartItems.products': proId }, {
            $pull: { cartItems: { products: proId } }
        }).then(() => {
            resolve()
        })
    })
}

//add address
const addAddress = (addaddressdetail, userId) => {
    return new Promise(async (resolve) => {

        let userinfo = await AddressModel.findOne({ user: userId })

        if (userinfo) {
            AddressModel.updateOne({ user: userId }, {
                $push: {
                    Address: [{
                        name: addaddressdetail.name,
                        address: addaddressdetail.address,
                        Place: addaddressdetail.place,
                        state: addaddressdetail.state,
                        pincode: addaddressdetail.pincode,
                        mobile_no: addaddressdetail.phone
                    }]
                }
            }).then((response) => {

                resolve()
            })
        }
        else {


            let addressObj = {
                user: userId,
                Address:
                    [{
                        name: addaddressdetail.name,
                        address: addaddressdetail.address,
                        Place: addaddressdetail.place,
                        state: addaddressdetail.state,
                        pincode: addaddressdetail.pincode,
                        mobile_no: addaddressdetail.phone
                    }]
            }
            AddressModel(addressObj).save().then((response) => {
                resolve(response)
            })
        }

    })
}
//get address
const getAddress = (userId) => {
    return new Promise(async (resolve) => {
        let getaddress = await AddressModel.find({ user: userId }).lean()
        resolve(getaddress)
    })
}
//get user address
const getAddressdt = (Id) => {
    console.log(Id);
    return new Promise(async (resolve) => {

        let id = mongoose.Types.ObjectId(Id)

        let getadd = await AddressModel
            // .findOne({'Address._id':Id}).lean()
            .aggregate([
                {
                    $unwind: "$Address"
                },
                {
                    $match: { 'Address._id': id }
                }
            ])

        resolve(getadd[0])
    })
}


//order place
const placeOrder = (order, productss, total) => {
    return new Promise((resolve) => {
        console.log(order, productss, total);
        let status = order['payment-method'] === 'COD' ? 'placed' : 'pending'
        let orderObj = {

            name: order.name,
            address: order.address,
            Place: order.place,
            state: order.state,
            mobile_no: order.phone,
            pincode: order.pincode,
            user: order.userId,
            paymentMethod: order['payment-method'],
            productdt: productss,
            totalAmount: total,
            status: status,
            orderstatus: 'ordered'
        }
        OrderSchema(orderObj).save().then((response) => {
            carModel.deleteOne({ user: order.userId }).then(() => {

                // console.log(response);
                resolve({ status: true })
            })

            resolve(response._id)
        })
    })

}


//generate razorpay
const generateRazorpay = (orderId, total) => {
    return new Promise((resolve) => {
        var options = {
            amount: total * 100,  // amount in the smallest currency unit
            currency: "INR",
            receipt: "" + orderId
        };
        instance.orders.create(options, function (err, order) {
            console.log("new order", order);
            resolve(order)
        });

    })
}

//verify payment
const verfiyPayment = (details) => {

    return new Promise((resolve, reject) => {
        const crypto = require('crypto')
        let hmac = crypto.createHmac('sha256', 'JKX7ppeUEgDqGs8YUTFfx3vg')
        hmac.update(details['payment[razorpay_order_id]'] + '|' + details['payment[razorpay_payment_id]'])
        hmac = hmac.digest('hex')
        if (hmac == details['payment[razorpay_signature]']) {
            resolve()
        } else {
            reject()
        }

    })
}

//change payment  status
const changePaymentStatus = (orderId) => {
    return new Promise((resolve) => {
        OrderSchema.updateOne({ _id: orderId }, {
            $set: {
                status: 'placed'
            }
        }).then(() => {
            resolve()
        })
    })
}

//get user orders
const getUserOrders = (userId) => {
    return new Promise(async (resolve) => {
        let orderdt = await OrderSchema.find({ user: userId }).populate({ path: 'productdt', populate: { path: 'brandnames' } }).lean()

        resolve(orderdt)
    })
}

//get orderproductdetails
const getOrderProducts = (orderId) => {
    return new Promise(async (resolve) => {
       
        const orderproDetails = await OrderSchema.find({ _id: orderId }).populate({ path: 'productdt', populate: { path: 'brandnames' } }).lean()
       
        resolve(orderproDetails)


    })

}
//get cart product id find
const getCartProductList = (userId) => {
    return new Promise(async (resolve) => {
        id = mongoose.Types.ObjectId(userId)
        let cart = await carModel.aggregate([
            {
                $match: {
                    user: id
                }
            },
            {
                $unwind: '$cartItems'
            }, {
                $project: {
                    _id: '$cartItems.products'
                }
            }
        ])

        resolve(cart)

    })
}
//get grandTotal
const getGrandTotal = (userId) => {
    return new Promise(async (resolve) => {
        let grandtotal = await carModel.findOne({ user: userId })
        resolve(grandtotal.total)

    })
}

//sub categorywise display one
const getsubDetails = () => {
    return new Promise(async (resolve) => {
        let dt = await subCategoryModel.findOne({ subcategoryname: 'dupatta-shawl' })
        let pt = await Products.find({ subcategoryname: dt._id }).lean()
        resolve(pt)
    })
}

//get subcategory
const displaySubCat = (catId) => {
    console.log(catId);
    return new Promise(async (resolve, reject) => {
        let displaysub = await subCategoryModel.find({ category: catId }).lean()
        // let prod=await Products.find({subcategoryname:displaysub}).lean()

        resolve(displaysub)
    })
}
//display all category
const displayAllCat = (catId) => {
    console.log(catId);
    return new Promise(async (resolve, reject) => {
        let displaysub = await subCategoryModel.find({ category: catId }).lean()

        let prod = await Products.find({ subcategoryname: displaysub }).populate('brandnames').lean()

        resolve(prod)
    })
}
//subcategory find id
const findOneSub = (subId) => {
    return new Promise(async (resolve, reject) => {
        let sub = await Products.find({ subcategoryname: subId }).populate('brandnames').lean()
        resolve(sub)
    })
}

//cancelorder
const cancelOrder = (orderId) => {
    return new Promise(async (resolve, reject) => {
        const cancel = await OrderSchema.updateOne({ _id: orderId }, {
            $set: {
                cancel: true,
                orderstatus: 'cancelled'
            }
        })
        resolve(cancel)
    })
}



module.exports = {
    doSignup, verifyOTP, doLogin, getallProductdetails, sendPasswordResetMail,
    updateNewPassword, forgetPasswordOTP, forgetPasswordEmailVerify, getUserResetPage,
    getproductdetail, updateuserdetails, addToCart, getCartDetails, getCartCount, getsubDetails,
    addToWishList, getWishList, changeProductQuantity, deleteWishList, cartDelete, getTotalAmount,
    placeOrder, addAddress, getAddress, getAddressdt, getCartProductList, getGrandTotal, getUserOrders,
    getOrderProducts, generateRazorpay, verfiyPayment, changePaymentStatus, displaySubCat, displayAllCat,
    findOneSub, cancelOrder,

}
