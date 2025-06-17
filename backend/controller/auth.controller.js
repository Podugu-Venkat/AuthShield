import e from "express";
import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetcookie } from "../utils/generateTokenAndSetcookie.js";
import { sendVerificationEmail } from "../mailtrap/emails.js";
import { sendWelcomeEmail } from "../mailtrap/emails.js";
export const signup = async(req, res) => {
   const {name, email, password} = req.body;
   try{
      if(!name || !email || !password){
         throw new Error('Please fill all the fields');
      }
      const userAlreadyexists=await User.findOne({email});
      if(userAlreadyexists){
         return res.status(400).json({success:false,message: 'User already exists'});
      }
      const hashedPassword = await bcryptjs.hash(password, 10);
      const verificationToken=Math.floor(100000 + Math.random() * 900000).toString();
      const user =new User({
            name,
            email,
            password: hashedPassword,
            verificationToken,
            verificationExpires: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        });
        await user.save();
        generateTokenAndSetcookie(res, user._id);
        await sendVerificationEmail(user.email, verificationToken);
        res.status(201).json(
            {success:true,message: 'User created successfully', user,
                user: {
                   ...user._doc,
                   password: undefined, // Exclude password from response
                },
            });
   }
   catch(error){
         res.status(400).json({success:false,message: error.message});
   }
}
export const verifyEmail = async(req, res) => {
   const {code}=req.body;
   try{
      const user= await User.findOne({
         verificationToken: code,
         verificationExpires: { $gt: Date.now() } // Check if token is still valid
      });
      if(!user){
         return res.status(400).json({success:false,message: 'Invalid or expired verification code'});
      }
      user.isVerified = true;
      user.verificationToken = undefined; // Clear verification token
      user.verificationExpires = undefined; // Clear verification expiration
      await user.save();
      await sendWelcomeEmail(user.email,user.name);
      res.status(200).json({success:true,message: 'Email verified successfully', user: {
         ...user._doc,
         password: undefined, // Exclude password from response
      }});
   }
   catch(error){
      res.status(400).json({success:false,message: error.message});
   }
};
export const login = async(req, res) => {
    res.send('login Page');
}

export const logout = async(req, res) => {
    res.send('Logout Page');
}
  