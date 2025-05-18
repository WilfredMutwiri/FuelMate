const express=require("express");
const { userSignup } = require("./controllers/auth/userSignup.js");
const { userSignin, userSignout } = require("./controllers/auth/userSignin.js");
const { requestOTP } = require("./controllers/auth/requestOTP.js");
const { resetPassword } = require("./controllers/auth/resetPassword.js");
const { stationSignin } = require("./controllers/auth/stationSignin.js");
const { stationSignup, getAllStations,getStationById} = require("./controllers/auth/stationSignup.js");
const router=express.Router();

//auth
router.post('/signup',userSignup);
router.post('/signin',userSignin);
router.post('/signout',userSignout);
router.post('/requestOTP',requestOTP);
router.post('/resetPassword',resetPassword)

//station
router.post('/station/signin',stationSignin)
router.post('/station/signup',stationSignup)
router.get('/station/all',getAllStations)
router.get('/station/:id',getStationById)


module.exports=router;