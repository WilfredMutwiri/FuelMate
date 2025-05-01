const express=require("express");
const { userSignup } = require("./controllers/auth/userSignup.js");
const { userSignin } = require("./controllers/auth/userSignin.js");
const router=express.Router();

//auth
router.post('/signup',userSignup);
router.post('/signin',userSignin);

module.exports=router;