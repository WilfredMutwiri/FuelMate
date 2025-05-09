const express=require("express");
const { userSignup } = require("./controllers/auth/userSignup.js");
const { userSignin, userSignout } = require("./controllers/auth/userSignin.js");
const { requestOTP } = require("./controllers/auth/requestOTP.js");
const { resetPassword } = require("./controllers/auth/resetPassword.js");
const router=express.Router();

//auth
router.post('/signup',userSignup);
router.post('/signin',userSignin);
router.post('/signout',userSignout);
router.post('/requestOTP',requestOTP);
router.post('/resetPassword',resetPassword)

module.exports=router;