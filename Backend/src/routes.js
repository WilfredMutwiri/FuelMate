const express=require("express");
const { userSignup } = require("./controllers/auth/userSignup.js");
const { userSignin, userSignout } = require("./controllers/auth/userSignin.js");
const { requestOTP } = require("./controllers/auth/requestOTP.js");
const { resetPassword } = require("./controllers/auth/resetPassword.js");
const { stationSignin } = require("./controllers/auth/stationSignin.js");
const { stationSignup, getAllStations,getStationById, updateStationStatus} = require("./controllers/auth/stationSignup.js");
const {fileUpload} = require("./controllers/auth/fileUpload.js");
const {profileUpload,certUpload} = require("./middlewares/multer.js");
const { placeOrder, getAllOrders, getOrderById, updateOrder, getOrdersByStation } = require("./controllers/auth/order.js");
// const fileUpload = require("./fileUpload.js");
const router=express.Router();

//auth
router.post('/user/signup/',userSignup);
router.post('/user/signin/',userSignin);
router.post('/signout',userSignout);
router.post('/requestOTP',requestOTP);
router.post('/resetPassword',resetPassword)

//station
router.post('/station/signin/',stationSignin)
router.post('/station/signup/',stationSignup)
router.get('/station/all',getAllStations)
router.get('/station/:id',getStationById)
router.patch('/station/update/:id',updateStationStatus)

// file uploads
router.post('/upload/images/',profileUpload.single('file'),fileUpload);
router.post('/upload/docs/',certUpload.single('file'),fileUpload);

// orders
router.post('/order/create/:stationId',placeOrder);
router.get('/order/all/',getAllOrders);
router.get('/order/:id',getOrderById);
router.patch('/order/update/:id',updateOrder);
router.get('/order/station/:id',getOrdersByStation)

module.exports=router;