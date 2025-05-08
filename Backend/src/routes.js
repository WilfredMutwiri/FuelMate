const express=require("express");
const { userSignup } = require("./controllers/auth/userSignup.js");
const { userSignin } = require("./controllers/auth/userSignin.js");
const { requestPasswordReset } = require("./controllers/auth/passwordReset.js");
const { resetPassword } = require("./controllers/auth/resetPassword.js");
const router=express.Router();

//auth
router.post('/signup',userSignup);
router.post('/signin',userSignin);
router.post('/requestOTP',requestPasswordReset);
router.post('/resetPassword',resetPassword)

module.exports=router;