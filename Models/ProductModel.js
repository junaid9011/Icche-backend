const mongoose=require('mongoose');

const productSchema=new mongoose.Schema({
key:{
    type:String
},
category:{
    type:String,
    // required:true
},
name:{
    type:String,
    required:[true,'Please Enter Product Name'],
    // trim: true, //remove the blank white space
    // maxlength:[100,'Product cannot exceed 100 character'],
},
// seller:{
//     type:String,
//     required:true
// },
// wholePrice:{
//     type:String,
//     required:[true,'Please Enter Product price'],
   
//     maxlength:[5,'Product cannot exceed 100 character'],
//     default:0.0,
// },
// priceFraction:{
//     type:Number,
//     required:true
// },
    // stock:{
    //     type:Number,
    //     required:true
    // },
// star:{
//     type:Number,
//     required:[true,'Please Enter Product star '],
    
// },
// starCount:{
//     type:Number,
//     // required:true
// },
image:
    {
    type:String
}
,
// url:{
//     type:String
// },
 description:{
        type:String
        // required:[true,'Please Enter Product description '],
        
        },


price:{
    type:Number,
    required:[true,'Please Enter Product price'],
   
    maxlength:[5,'Product cannot exceed 100 character'],
    default:0.0,
},
// shipping:{
//     type:Number,
//     required:true
    
// },

createdAt:{
    type:Date,
    default:Date.now
}

// images:[
//     {
//         public_id:{
//             type:String,
//             required:true
//         },
//         url:{
//             type:String,
//             required:true
//         }
//     }
// ],



// numOfReviews:{
//     type:Number,
//     default:0
// },
// reviews:[
//     {
//         user:{
//             type:mongoose.Schema.ObjectId,
//             ref:'user',
//             required:true
//         },
//         name:{
//             type:String,

//         },
//         rating:{
//             type:Number,
//             required:true 
//         },
//         comment:{
//             type:String,
//             required:true,
//         }

//     }
// ],




})

module.exports=mongoose.model('Product',productSchema);