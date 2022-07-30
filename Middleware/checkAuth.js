const User= require('../Models/UserModel')
const ErrorHandler = require('../Utlis/ErrorHandler');
const asyncError =require('./asyncError');
const jwt = require('jsonwebtoken');
// const { getCookie } = require('../../front-end/src/Redux/Cookie');
//check user is authenticated or not
exports.isAuthenticatedUser = asyncError(async(req,res,next)=>{
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
      }
      else if (req.cookies.token) {
        token = req.cookies.token;
      }
    
    
    // console.log(req.cookies);
    if (!token){
        return next(new ErrorHandler('Login first',401));
    }
    const decoded=jwt.verify(token,process.env.JWT_SECRET)
    req.user=await User.findById(decoded.id)
    // console.log(req.user);
    next()
});

//handling user role change
exports.authorizedRule =(...roles)=>{
    return(req,res,next)=>{
       if(!(roles.includes(req.user.role))) {
          return next( new ErrorHandler(`Role (${req.user.role}) is not allowed `,403))
       }
       next()
    }
}