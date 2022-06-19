var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs=require('express-handlebars');
const config=require('./config/connection');
const Register=require('./models/userSchema');

// const Admin=require('./models/adminSchema/Admin');
const {Products,Admin}=require('./models/adminSchema');
const SubCategoryModel=require('./models/subcategorySchema');
const brandNameModel=require('./models/brandnameScheme')
const cartModel=require('./models/cartSchema')
const wishListModel=require('./models/wishlistSchema')
const OrderModel=require('./models/OrderSchema')
const AddressModel=require('./models/AddressSchema')

var session=require('express-session')
var bodyParser=require('body-parser')
var multer=require('multer');
// var fileUpload=require('express-fileupload')


var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs',hbs.engine({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/layout/',partialsDir:__dirname+'/views/partials/'}))


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(session({secret:"key",cookie:{maxAge:600000}}));
app.use((req,res,next)=>{
  res.set('Cache-Control','no-store')
  next()
})
// app.use(fileUpload())


app.use('/',usersRouter);
app.use('/admin',adminRouter );

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error',{layout:false});
});



module.exports = app;
