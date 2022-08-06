const Product=require('../Models/ProductModel');// it will import the schema
const ErrorHandler=require('../Utlis/ErrorHandler');
const asyncError=require('../Middleware/asyncError');
const APIFeatures=require('../Utlis/APIFeatures');
const cloudinary = require('cloudinary').v2
const { fileUpload } = require('./fileUpload');
//create new product => /api/v1/product/
cloudinary.config({ 
    cloud_name: 'junaidscloud', 
    api_key:775371735753736 , 
    api_secret:"S8V3jSmGuNfPOmGPPTKyjgzqczI",
    secure:true
  });
exports.newProduct=  asyncError( async(req,res,next)=>{
    // 
    const {image}=req.body
    const isUploaded= await cloudinary.uploader.upload(image,{folder:"Icche"},(error, result) => {
        if (error) return console.error(error);
        // return res.json({ URL: result.secure_url });
      })
    
    isExist=await Product.find({category:req.body.category});
    // console.log(isExist)
    let length=isExist.length;
    
    let code=''
    if(req.body.category==='Clothes')code='ICL'
    else code='ICM'
    let productId="";
    if(length>=99)  productId=`${code}0${length+1}`
    else if(length>=9) productId=`${code}00${length+1}`
    else productId=`${code}000${length+1}`
    req.body.key=productId;
    req.body.image=isUploaded.secure_url;
    const createProduct= await Product.create(req.body); // it will create new product according to schema
    res.status(201).json({
        success:true,
        createProduct
    })
})
//get all products=> /api/v1/products
exports.getProducts= asyncError( async(req,res,next)=>{
    const resPerPage=12;// number of item show in one page
    const productCount= await Product.countDocuments(); //it will use in front-end to count all the docoment

    const apiFeatures= new APIFeatures(Product.find(),req.query).search().filter().pagination(resPerPage);

    const allProducts=await apiFeatures.query;
    // const allProducts=await Product.find() //without search facilites
    res.status(200).json({
        success:true,
        count:allProducts.length,
        allProducts,
        productCount,
        resPerPage
    });
} )
//get admin products
exports.getAdminProducts= asyncError( async(req,res,next)=>{
    // const resPerPage=12;// number of item show in one page
    const productCount= await Product.countDocuments(); //it will use in front-end to count all the docoment

    const allProducts=await Product.find() //without search facilites
    res.status(200).json({
        success:true,
        count:allProducts.length,
        allProducts,
        productCount,
    });
} )

//get single product => api/v1/product/:id
exports.getSingleProduct= asyncError( async(req,res,next)=>{
    const findSingleProduct=await Product.findById(req.params.id);
    if(!findSingleProduct){
        return next(new ErrorHandler('Product not Found',404))
        //it is without middleware
        /*return res.status(404).json({
            success:false,
            message:'product not found',
        })*/
    }
    res.status(200).json({
        success:true,
        findSingleProduct
    });
    
})
//update Product=> /api/v1/product/:id
exports.updateProduct= asyncError( async(req,res,next)=>{
    let updateAProduct=await Product.findById(req.params.id);
    if(!updateAProduct){
        return next(new ErrorHandler('Product not Found',404))
    }
    updateAProduct=await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    res.status(200).json({
        success:true,
        updateAProduct
    });
})
// remove a product
exports.removeProduct= asyncError( async(req,res,next)=>{
    const removeAProduct = await Product.findById(req.params.id);
    if(!removeAProduct){
        return next(new ErrorHandler('Product not Found',404))
    }
    await removeAProduct.remove();
    res.status(200).json({
        success:true,
        message:'product deleted',
    })
})

//create product review

exports.createProductReview = asyncError( async(req,res,next)=>{
    const {rating,comment,productId}=req.body;
    const review={
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment
    }
    const product=await Product.findById(productId);
    const isReviewed=product.reviews.find(
        r=>r.user.toString()===review.user._id.toString()//check this is user is reviwed or not
    )
    if(isReviewed){
        product.reviews.forEach(r=>{
            if(r.user.toString()===review.user._id.toString)
            review.comment=comment.toString();
            review.rating=rating
        })
    }
    else{
        product.reviews.push(review);
        product.numOfReviews=product.reviews.length
    }

    product.ratings=product.reviews.reduce((acc,item)=>item.rating+acc,0)/product.reviews.length;

    await product.save({validateBeforeSave:false});
    res.status(200).json({
        success: true
    })
})

//get product reviews=> /api/v1/reviews?id

exports.getProductReviews= asyncError( async(req,res,next)=>{
    const product= await Product.findById(req.query.id);

    res.status(200).json({
        success: true,
        reviews:product.reviews
    })
})
 
//delete product reviews=> /api/v1/reviews?id

exports.deleteReview= asyncError(async(req,res,next)=>{
    const product= await Product.findById(req.query.productId);
    const reviews=product.reviews.filter(review=>review._id.toString()!==req.query.id.toString())
    const numOfReviews=reviews.length;
    const ratings=product.reviews.reduce((acc,item)=>item.rating+acc,0)/reviews.length;
    //update reviews  
    await Product.findByIdAndUpdate(req.query.productId,{
        reviews,
        ratings,
        numOfReviews
    } ,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    res.status(200).json({
        success: true,
       
    })
})