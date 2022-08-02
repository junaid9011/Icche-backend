const Admin=require('../Models/AdminModel')
const ErrorHandler= require('../Utlis/ErrorHandler');
const asyncError = require('../Middleware/asyncError');
const sendToken = require('../Utlis/jwtToken')

exports.register = asyncError(async(req, res, next)=>{
    //config cloudinary
    // const result= await cloudinary.v2.uploader.upload(req.body.avater,{
    //     folder:'ecommerce/avater',
    //     width:150,
    //     crop:"scale"

    // })
    const {name,email,phone,password}=req.body;
    let isExist=await Admin.findOne({email:email});
    
    if(isExist){
        return res.status(404).json({
            success:false,
            message:'This Email is Already Registered',
        })
    }
     isExist=await Admin.findOne({phone:phone});
    if(isExist){
        return res.status(404).json({
            success:false,
            message:'This Phone is Already Registered',
        })
    }
    //Admin id
    // let a="";
    // isExist=await Admin.find();
    // let length=isExist.length;
    // let userId=""
    // if(length>99)  userId=`IR0${length+1}`
    // else if(length>9) userId=`IR00${length+1}`
    // else userId=`IR000${length+1}`
   
    // console.log(userId)
    const admin = await Admin.create({
        name,
        email,
        phone,
        password,
        // avater:{
        //     public_id:result.public._id,
        //     url:result.secure_url
        // }
    })
    sendToken(admin,200,res)
    // const token=user.getJwtToken();
    // res.status(200).json({
    //     success: true,
    //     token
    // });
});
exports.login = asyncError(async(req, res, next)=>{
    const{email,password}=req.body;
    // console.log(req.body)
    //check if userId and password are entered by user
    if(!email || !password){
        return res.status(404).json({
            success:false,
            message:'Please Enter User Id and Password',
        })
    }
    //finding user 
    const admin = await User.findOne({email}).select('+password')//we select password because we set password select false in usermodel
    if(!admin){
        // return next(new ErrorHandler('Invalid Password',401));
        return res.status(404).json({
            success:false,
            message:'Invalid Password',
        })

    }
    //checks if password is correct or not

    const ifPasswordCorrect = await admin.comparePassword(password);
    if(!ifPasswordCorrect){
        return next(new ErrorHandler('Invalid Password',401));
    }
    sendToken(admin,200,res)
    // const token=findUser.getJwtToken();
    // res.status(200).json({
    //     success: true,
    //     token
    // });
})