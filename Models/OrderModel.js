const mongoose=require('mongoose');


const orderSchema=mongoose.Schema({
    // shippingInfo: {
    //     address: {
    //         type: String,
    //         required: true
    //     },
    //     city: {
    //         type: String,
    //         required: true
    //     },
    //     state: {
    //         type: String,
    //         required: true
    //     },
    //     postalCode: {
    //         type: String,
    //         required: true
    //     }
    // },
    user:{
        type:mongoose.Schema.ObjectId,
        // required: true,
        ref:'User'
    },
   orderItems: [
        {
            name:{
                type: String,
                required: true,
            },
            quantity:{
                type:Number ,
                required: true,
            },
            // image:{
            //     type: String,
            //     required: true
            // },
            price:{
                type:Number ,
                required: true,
            },
            
        }
    ],
    paymentInfo:{
        id:{
            type:String
        },
        status:{
            type:String
        }
    },
    paidAt:{
        type:Date
    },
    itemPrice:{
        type:Number,
        required:true,
        defalt:0.0
    },
    tax:{
        type:Number,
        required:true,
        defalt:0.0
    },
    shippingPrice:{
        type:Number,
        required:true,
        defalt:0.0
    },
    totalPrice:{
        type:Number,
        required:true,
        defalt:0.0
    },
    orderStatus:{
        type:String,
        // required:true,
        default:"Processing"
    },
    deliveredAt:{
        type:Date,
        // required:true,
        default:Date.now
    }
})


module.exports=mongoose.model('Order',orderSchema)