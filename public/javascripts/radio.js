
$(document).ready(function(){
    $("#radioform").validate({
        errorClass:"error",
     rules:{
        size:{
            required:true,
        }
    },
     messages:{
         size:{
             required:"Please select your size",
         }
        
     }
    }) 
})        