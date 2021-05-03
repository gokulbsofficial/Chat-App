const ErrorResponse = require("../utils/errorResponse")

const errorHandler = (err,req,res,next)=>{
    let error = {...err}

    error.message = err.message;

    if(err.name === "CastError"){
        const message = "Resourse not found";
        error = new ErrorResponse(message,404);
    }

    if(err.message === "jwt expired"){
        const message = "Your refresh token has expired";
        error = new ErrorResponse(message,404);
    }

    if(err.message === "invalid token"){
        const message = "Your refresh token was Invalid";
        error = new ErrorResponse(message,404);
    }


    if(err.code === 11000){
        const message = "Duplicate field value entered";
        error = new ErrorResponse(message,400);
    }

    if(err.errorCode === "EAI_AGAIN"){
        const message = `Check your Internet Connection`;
        error = new ErrorResponse(message,400);
    }

    if(err.errorCode === 20404){
        const message = `OTP request not found, Try again!!`;
        error = new ErrorResponse(message,400);
    }
    
    if(err.name === "ValidationError"){
        const message = Object.values(err.errors)
        .map((error)=>error.message)
        .join(", ")
        error = new ErrorResponse(message,400);
    }


    // add more check...
    res.status(error.statusCode || 500).json({
        success:false,
        message:error.message || "Server Error"
    })
}

module.exports = errorHandler;