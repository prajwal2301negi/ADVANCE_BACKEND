import ConnectWithUs from "../models/connectWithUs.models.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import ErrorHandler from "../utils/errorMiddleware.js";

export const createConnectWithUs = asyncErrorHandler(async(req,res,next)=>{
 
    const {name,message}=req.body;
    if(!message){
        return next(new ErrorHandler("Please provide a message",400));
    }
    if(name===""){
        name=null;
    }
    const newContactUs = new ConnectWithUs({
        name,message
    })
   
    await newContactUs.save();
    res.status(200)
    .json({message:"new message created",newContactUs});
})



export const getAllConnects = asyncErrorHandler(async (req, res, next) => {
    const connectMessages = await ConnectWithUs.find();
    if (!connectMessages || connectMessages.length === 0) {
        return next(new ErrorHandler("No messages found", 400));
    }
    res.status(200).json({
        success: true,
        connectMessages
    });
});

