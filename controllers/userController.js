const User = require('../Models/UserModel');

const ErrorHandler= require('../Utlis/ErrorHandler');
const asyncError = require('../Middleware/asyncError');
const sendToken = require('../Utlis/jwtToken')
const sendEmail = require('../Utlis/sendEmail');
// const { send } = require('express/lib/response');
// const cloudinary=require('cloudinary')
//Register a user =>/api/v1/register
exports.register = asyncError(async(req, res, next)=>{
    //config cloudinary
    // const result= await cloudinary.v2.uploader.upload(req.body.avater,{
    //     folder:'ecommerce/avater',
    //     width:150,
    //     crop:"scale"

    // })
    const {name,email,password}=req.body;

    const user = await User.create({
        name,
        email,
        password,
        // avater:{
        //     public_id:result.public._id,
        //     url:result.secure_url
        // }
    })
    sendToken(user,200,res)
    // const token=user.getJwtToken();
    // res.status(200).json({
    //     success: true,
    //     token
    // });
});

exports.login = asyncError(async(req, res, next)=>{
    const{email,password}=req.body;
    //check if email and password are entered by user
    if(!email || !password){
        return next(new ErrorHandler('Please enter email and password',400))
    }
    //finding user 
    const findUser = await User.findOne({email}).select('+password')//we select password because we set password select false in usermodel
    if(!findUser){
        return next(new ErrorHandler('Invalid Password',401));

    }
    //checks if password is correct or not

    const ifPasswordCorrect = await findUser.comparePassword(password);
    if(!ifPasswordCorrect){
        return next(new ErrorHandler('Invalid Password',401));
    }
    sendToken(findUser,200,res)
    // const token=findUser.getJwtToken();
    // res.status(200).json({
    //     success: true,
    //     token
    // });
})
//forgotpasswero =>/api/v1/forgotpass
exports.forgotPassword = asyncError(async(req, res,next)=>{
    const user=await User.findOne({email:req.body.email});
    if(!user){
        return next(new ErrorHandler('User not found',404))
    }
    //get reset Token
    const resetToken=user.getResetPasswordToken();
    await user.save({validateBeforeSave:false})

    //create reset password url
    const resetUrl=`${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`
    const message=`Your password reset token as follow:\n\n${resetUrl}\n\n`

    try{
        await sendEmail({
            email:user.email,
            subject:'Ecommerce password recovery',
            message
        })
        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email}`
        })
    }catch(error){
        user.restpasswordToken=undefined;
        user.resetPasswordExpire=undefined;
        await user.save({validateBeforeSave:false})

        return next(new ErrorHandler(error.message,500))

    }
})

//get current logged in user details
exports.getUserProfile= asyncError(async(req, res, next)=>{
    const LoggenInUser= await User.findById(req.user.id)

    res.status(200).json({
        success:true,
        LoggenInUser

    })
})

// change password
 exports.changePassword = asyncError(async(req, res, next)=>{
    const user = await User.findById(req.user.id).select('+password');
    //check previous user password
    const isMatched = await user.comparePassword(req.body.oldPassword)
    if(!isMatched){
        return next(new ErrorHandler('Old Password is incorrect',400))
    }
    user.password=req.body.password
    await user.save();
    sendToken(user,200,res)
})

//update user profile =>/api/v1/me/update
exports.updateUserProfile = asyncError(async(req, res, next)=>{
    const newUserData={
        name:req.body.name,
        email:req.body.email
    }
    //update avatar: TODO

    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators: true,
        usefindAndModify: false
    })
    res.status(200).json({
        success: true
    })
})

//logout user=>/api/v1/logout
exports.logout= asyncError(async(req, res, next)=>{
    res.cookie('token',null,{
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({
        success: true,
        message: 'Logged Out'
    })
})

//admin routes
//get all users => /api/v1/admin/users
exports.allUsers = asyncError(async(req, res, next)=>{
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    })
})
//get user details => /api/v1/user/:id
exports.getuserDetails = asyncError(async(req, res, next)=>{
    const user=await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`User not found with id:${req.params.id}`))
    }
    res.status(200).json({
        success: true,
        user
    })
})

//update user details => /api/v1/adim/user/:id
exports.updateUserProfileById = asyncError(async(req, res, next)=>{
    const newUserData={
        name:req.body.name,
        email:req.body.email.password,
        role:req.body.role
    }
    //update avatar: TODO

    const user = await User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidators: true,
        usefindAndModify: false
    })
    res.status(200).json({
        success: true,
        user
    })
})
//delete user => /api/v1/user/:id
exports.deleteUser = asyncError(async(req, res, next)=>{
    const user=await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`User not found with id:${req.params.id}`))
    }
    // remove avater
    await user.remove();
    res.status(200).json({
        success: true,
        user
    })
})
