import mongoose from "mongoose";
import validator from 'validator';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter name"],
      minLength: [3, "Name must contain atleast 3 characters"],
      maxLength: [30, "Name must contain maximum 30 characters"],
      validate : [validator.isAlpha, "Please enter characters only"],
      trim:true,
    },
    gender: {
      type: String,
      required: true,
      enum: {
        values: ["Male", "Female", "Other"],
        message: "Please select gender",
      },
      validate:[validator.isAlpha,"Enter valid entity"],
    },
    avatar: {
      public_id: String,
      url: String,
    },
    phone: {
      type: String,
      required: [true, "Enter Phone Number"],
      minLength: [10, "Phone Number must be 10 digit"],
      validate:[validator.isInt,"enter a valid entity"],
      validate:[validator.isMobilePhone,"Enter a valid phone Number"],
      validator: ((value)=>{
        return value=10;
      }),
    },
    email: {
      type: String,
      required: [true, "Please enter email"],
      unique: true,
      validate: [validator.isEmail, "Please enter valid email"],
    },
    password: {
      type: String,
      minLength: [8, "Password must be atleast 8 characters"],
      required: [true, "Please enter password"],
      select:false,
      validate:[validator.isStrongPassword,"Enter a strong Password"],
    },
    token: {
      type: String,
    },
    role: {
      type: String,
      enum: {
        values: ["User", "Admin"],
        message: "Please select role",
      },
      required:true,
      validate:[validator.isAlpha,"Enter a valid entity"],
    
    },
    profileCreatedAt:{
      type:String,
    },
    profileCreatedEnd:{
      type:String,  
    },
    time:{
      type:String,
    }
  },
  { timestamps: true }
);



const user = mongoose.model("User", userSchema);
export default user;
