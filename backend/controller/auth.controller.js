import e from "express";
import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { generateTokenAndSetcookie } from "../utils/generateTokenAndSetcookie.js";
import { sendVerificationEmail } from "../mailtrap/emails.js";
import { sendWelcomeEmail } from "../mailtrap/emails.js";
import { sendPasswordResetEmail } from "../mailtrap/emails.js";
import { sendResetSuccessEmail } from "../mailtrap/emails.js";
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
   const {email, password} = req.body;
   try{
      const user=await User.findOne({email});
      if(!user){
         return res.status(400).json({success:false,message: 'User not found'});
      }
      const isPasswordValid = await bcryptjs.compare(password, user.password);
      if(!isPasswordValid){
         return res.status(400).json({success:false,message: 'Invalid password'});
      }
      generateTokenAndSetcookie(res, user._id);
      user.lastLogin = Date.now(); // Update last login time
      await user.save();
      res.status(200).json({
         success: true,
         message: 'Login successful',
         user: {
            ...user._doc,
            password: undefined, // Exclude password from response
         },
      });
   }
   catch(error){
      console.error("Error during login:", error);
      res.status(400).json({success:false,message: error.message});
   }
}

export const logout = async(req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Set secure flag in production
        sameSite: 'Strict', // Prevent CSRF attacks
    });
   res.status(200).json({success: true, message: 'Logged out successfully'});
}
export const forgotPassword = async(req, res) => {
   const {email} = req.body;
   try{
      const user=await User.findOne({email});
      if(!user){
         return res.status(400).json({success:false,message: 'User not found'});
      }
      const resetToken =crypto.randomBytes(32).toString('hex');
      const resetExpires = Date.now() + 15 * 60 * 1000; // 15 minute
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = resetExpires; // Set expiration time
      await user.save();
      await sendPasswordResetEmail(user.email,`${process.env.CLIENT_URL}/reset-password/${resetToken}`); 
      res.status(200).json({success:true,message: 'Password reset email sent successfully'});
   }
   catch(error){
      res.status(400).json({success:false,message: error.message});
   }} 

export const resetPassword = async(req, res) => {
   try{
       const {token} = req.params;
       const {password} = req.body;
       const user = await User.findOne({
           resetPasswordToken: token,
           resetPasswordExpires: { $gt: Date.now() } // Check if token is still valid
       });
       if(!user){
           return res.status(400).json({success:false,message: 'Invalid or expired password reset token'});
       }
         const hashedPassword = await bcryptjs.hash(password, 10);
         user.password = hashedPassword;
         user.resetPasswordToken = undefined; // Clear reset token
         user.resetPasswordExpires = undefined; // Clear reset expiration
         await user.save();
         await sendResetSuccessEmail(user.email); // Assuming you have a function to send reset success email
         res.status(200).json({success:true,message: 'Password reset successfully'});
   }
   catch(error){
         res.status(400).json({success:false,message: error.message});
   }
}
export const checkAuth = async(req, res) => {
   try{
      const user = await User.findById(req.userId).select('-password'); // Exclude password from response
      if(!user){
         return res.status(404).json({success:false,message: 'User not found'});
      }
      res.status(200).json({success:true,message: 'User authenticated successfully', user});
   }
   catch(error){
      console.error("Error during authentication check:", error);
      res.status(500).json({success:false,message: 'Internal server error'});
   }
};
   