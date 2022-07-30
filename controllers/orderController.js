const Order=require("../Models/OrderModel")
const Product=require("../Models/ProductModel")
const ErrorHandler=require("../Utlis/ErrorHandler")
const asyncError=require("../Middleware/asyncError")

//create new order

exports.newOrder = asyncError(async(req,res,next)=>{
    const{orderItems,
        shippingInfo,
        itemPrice,
        tax,
        shippingPrice,
        totalPrice,
    paymentInfo,
    user
}=req.body;
    // console.log(req.body)
    const createOrder=await Order.create({
        user:user._id,
        orderItems,
        shippingInfo,
        itemPrice,
        tax,
        shippingPrice,
        totalPrice,
        paymentInfo,
        // paidAt:Date.now(),
        
    })
    res.status(200).json({
        success: true,
        createOrder
    })
});


//get single order=>/api/v1/order/:id

exports.getSingleOrder = asyncError(async(req,res,next)=>{
    const findOrder = await Order.findById(req.params.id)/*.populate('user','name email')*/
    if(!findOrder){
        return next(new ErrorHandler('No Order found with this ID',404))

    }
    res.status(200).json({
        success: true,
        findOrder
    })
})

//get logged in user order=>/api/v1/orders/me

exports.myOrders = asyncError(async(req,res,next)=>{
    
    const myOrder = await Order.find({user:req.params.user})

    res.status(200).json({
        success: true,
        myOrder
    })
})

//get all aorders=>/api/v1/admin/orders/

exports.allOrders = asyncError(async(req,res,next)=>{
    const allOrder = await Order.find()
    let totalAmount=0
    allOrder.forEach(order=>{
        totalAmount+=order.totalPrice;
    })//it will show total amount of all orders
    res.status(200).json({
        success: true,
        totalAmount,
        allOrder
    })
})

//update processing order=>/api/v1/admin/order/:id

exports.processOrder = asyncError(async(req,res,next)=>{
    const findOrder = await Order.findById(req.params.id)/*.populate('user','name email')*/
    if(findOrder.orderStatus==="Delivered"){
        return next(new ErrorHandler('This Order is already delivered',400));
    }
    findOrder.orderItems.forEach(async item=>{
         await updateStock(item.product,item.quantity)
    })

    findOrder.orderStatus=req.body.orderStatus,
    findOrder.deliveredAt=Date.now();
    await findOrder.save();

    res.status(200).json({
        success: true,
        
    })
})

async function updateStock(id, quantity){
    const product= await Product.findById(id);
    product.stock=product.stock-quantity;

    await product.save({validateBeforeSave:false});
}
// delete order=>/api/v1/order/:id

exports.deleteOrder = asyncError(async(req,res,next)=>{
    const findOrder = await Order.findById(req.params.id)/*.populate('user','name email')*/
    if(!findOrder){
        return next(new ErrorHandler('No Order found with this ID',404))

    }
    await findOrder.remove();
    res.status(200).json({
        success: true,
        
    })
})
