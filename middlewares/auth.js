import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import ErrorHandler from "../utils/errorMiddleware.js";
import User from '../models/user.models.js';
import jwt from 'jsonwebtoken';


// ADMIN AUTHENTICATION AND AUTHORIZATION->
export const isAuthenticated = asyncErrorHandler(async(req,res,next)=>{
    // AUTHENTICATION->
    const { tokena } = req.cookies
    if(!tokena){
        return next(new ErrorHandler("Admin Not Authenticated", 401));
    }
    const decoded = jwt.verify(tokena,process.env.JWT_SECRETA);
    req.user = await User.findById(decoded.id);

    //AUTHORIZATION->
    if(req.user.role !== "Admin"){
        return next(
            new ErrorHandler(
                `${req.user.role} not submitted for this resources!`,
                403
            )
        );
    }
    next();
})



// USER AUTHNETICATION AND AUTHORIZATION->
export const isUserAuthenticated = asyncErrorHandler(async(req,res,next)=>{
    // AUTHENTICATION->
    const { tokenu } = req.cookies

    if(!tokenu){
        return next(new ErrorHandler("User Not Authenticated", 401));
    }
    const decoded = jwt.verify(tokenu,process.env.JWT_SECRETU);
    req.user = await User.findById(decoded.id);
    
    // AUTHORIZATION->
    if(req.user.role !=="User"){
        return next(
            new ErrorHandler(
                `${req.user.role} not submitted for this resources!`,
                403
            )
        );
    }
    next();
})


// INSTRUCTOR AUTHNETICATION AND AUTHORIZATION->
export const isInstructorAuthenticated = asyncErrorHandler(async(req,res,next)=>{
    // AUTHENTICATION->
    const { tokeni } = req.cookies

    if(!tokeni){
        return next(new ErrorHandler("Instructor Not Authenticated", 401));
    }
    const decoded = jwt.verify(tokeni,process.env.JWT_SECRETI);
    req.user = await User.findById(decoded.id);
    
    // AUTHORIZATION->
    if(req.user.role !=="Instructor"){
        return next(
            new ErrorHandler(
                `${req.user.role} not submitted for this resources!`,
                403
            )
        );
    }
    next();
})

export const isDoctorAuthenticated = asyncErrorHandler(async(req,res,next)=>{
    // AUTHENTICATION->
    const { tokend } = req.cookies

    if(!tokend){
        return next(new ErrorHandler("Doctor Not Authenticated", 401));
    }
    const decoded = jwt.verify(tokend,process.env.JWT_SECRETD);
    req.user = await User.findById(decoded.id);
    
    // AUTHORIZATION->
    if(req.user.role !=="Doctor"){
        return next(
            new ErrorHandler(
                `${req.user.role} not submitted for this resources!`,
                403
            )
        );
    }
    next();
})
