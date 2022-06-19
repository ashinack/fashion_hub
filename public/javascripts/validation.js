$(document).ready(function(){
    $("#form1").validate({
        errorClass:"error",
     rules:{
        name:{
            required:true,
            minlength:4,
            maxlength:15,
            namevalidation:true
        },
         email:{
            required:true,
            email:true,
           
        },
         password:{
            required:true,
            minlength:5
        },
       confirmpassword:{
           required:true,
           equalTo:'#password'
       },
       
        number:{
            required:true,
            minlength:10,
            maxlength:15,
            number:true
        },
        address:{
            required:true,
            minlength:6,
            maxlength:20,
        },
       
       

       
        
     },
     messages:{
         name:{
             required:"Please enter your name",
             minlength:"At least 4 characters required",
             maxlength:"Maximum 15 characters are allowed"
         },
         email:{
             required:"Please enter your email id",
             email:"Enter a valid email",
            
         },
         
         
         number:{
            required:"Please enter your phone number",
            minlength:"Enter 10 numbers",
            maxlength:"Number should be less than or equal to 15 numbers",
            
           },
         
         password:"Please enter your password",
         address:"please enter your address",
        
     }
    })
    $.validator.addMethod("namevalidation", function(value, element) {
            return /^[A-Za-z]+$/.test(value);
    },
      "Sorry,only alphabets are allowed"
   );
   
})

//

$(document).ready(function(){
    $("#form2").validate({
        errorClass:"error",
     rules:{
        branddet:{
            required:true,
            
        },
        price:{
            required:true,
            number:true
        },
         description:{
            required:true,
            minlength:8
        },
       subcategoryname:{
           required:true,
           
       },
       
       images:{
            required:true,
            
        },
        image1:{
            required:true,
            
        },
        quantity:{
            required:true,
            
        },
       
       

       
        
     },
     messages:{
         branddet:{
             required:"select your brand",
             
         },
         price:{
             required:"Enter the price",
             
         },
         
         
        description:{
            required:"Enter the description",
            
            
           },

subcategoryname:"select the subcategory",
         images:"select the image",
         image1:"select the image",
         quantity:"enter the quantity"
        
     }
    })
   
   
})


 