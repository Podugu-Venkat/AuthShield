
import jwt from "jsonwebtoken";
import exp from "constants";
export const generateTokenAndSetcookie = (res, userId) => {
    const token= jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '1d', // Token expires in 1 day
    });

res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Set secure flag in production
    sameSite: 'Strict', // Prevent CSRF attacks
    maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
});
return token;
};
