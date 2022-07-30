const ErrorHandler=require('../Utlis/ErrorHandler');



module.exports=(err,req,res,next)=>{
        err.statusCode=err.statusCode||500; //the message and code come from product controller
        if(process.env.NODE_ENV==='DEVELOPMENT'){
            res.status(err.statusCode).json({
                success:false,
                error:err,
                errMessage:err.message,
                stack:err.stack
            })
        }
        else if(process.env.NODE_ENV==='PRODUCTION'){
            let error={...err}
            error.message=err.message;
            //handle wrong mongoose id error
            if(err.name==='CastError'){
                const message=`Invalid:${err.path}`;//here error.path is invalid id
                error=new ErrorHandler(message,400)
            }
            //handling Mongoose validation error
            if(err.name==='ValidationError'){
                 const message=Object.values(err.errors).map(value=>value.message);//this will show the all erros so we use map
                 error=new ErrorHandler(message,400)
            }
            //handling mongoose duplicate key errors
            if(err.code===11000){
                const message=`Duplicate ${Object.keys(err.keyValue)} entered`
                error=new ErrorHandler(message,400)
            }
            //handling wrong jwt error
            if(err.name==='TokenExpiredError'){
                const message="JSON Web Token is expired"
                error=new ErrorHandler(message,400)
           }
           //handling expired jwt error
           if(err.name==='JsonWebTokenError'){
            const message="JSON Web Token is invalid"
            error=new ErrorHandler(message,400)
       }
        res.status(err.statusCode).json({
            success:false,
            message:error.message||'internal server error' ///stack is used for see details. if don't use stack it will show only the code
        })
    }
}