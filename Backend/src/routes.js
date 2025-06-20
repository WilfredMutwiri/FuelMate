const express=require("express");
const { userSignup } = require("./controllers/auth/userSignup.js");
const { userSignin, userSignout, getUserInfo } = require("./controllers/auth/userSignin.js");
const { requestOTP } = require("./controllers/auth/requestOTP.js");
const { resetPassword } = require("./controllers/auth/resetPassword.js");
const { stationSignin } = require("./controllers/auth/stationSignin.js");
const { stationSignup, getAllStations,getStationById, updateStationStatus, getAllApprovedStations, getAllNotApprovedStations, deleteStation} = require("./controllers/auth/stationSignup.js");
const {fileUpload} = require("./controllers/auth/fileUpload.js");
const {profileUpload,certUpload} = require("./middlewares/multer.js");
const { placeOrder, getAllOrders, getOrderById, updateOrder, getOrdersByStation, getOrdersByCustomer, getDeliveredOrdersByStation, getCanceledOrdersByStation, getApprovedOrdersByStation, getTotalAmountByStation, getTotalVolumeDeliveredByStation, getOrdersByMonth } = require("./controllers/auth/order.js");
const { paystackInit, verifyPayment } = require("./controllers/auth/paystack.js");
const { adminSignup } = require("./controllers/auth/adminSignup.js");
const { adminSignin } = require("./controllers/auth/adminSignin.js");
// const fileUpload = require("./fileUpload.js");
const router=express.Router();

//auth
router.post('/user/signup/',userSignup);
router.post('/user/signin/',userSignin);
router.post('/signout',userSignout);
router.post('/requestOTP',requestOTP);
router.post('/resetPassword',resetPassword);
router.get('/user/info/:userId',getUserInfo);
router.post('/admin/signup/',adminSignup);
router.post('/admin/signin/',adminSignin);

//station
router.get('/station/approved/',getAllApprovedStations);
router.get('/station/not-approved/',getAllNotApprovedStations);
router.post('/station/signin/',stationSignin)
router.post('/station/signup/',stationSignup)
router.get('/station/all',getAllStations)
router.get('/station/:id',getStationById)
router.patch('/station/update/:id',updateStationStatus);
router.delete('/station/delete/:id',deleteStation);

// file uploads
router.post('/upload/images/',profileUpload.single('file'),fileUpload);
router.post('/upload/docs/',certUpload.single('file'),fileUpload);

// orders
router.post('/order/create/:stationId',placeOrder);
router.get('/order/all/',getAllOrders);
router.get('/order/:id',getOrderById);
router.patch('/order/update/:id',updateOrder);
router.get('/order/station/:id',getOrdersByStation);
router.get('/order/customer/:id',getOrdersByCustomer);
router.get('/order/delivered/station/:id',getDeliveredOrdersByStation);
router.get('/order/canceled/station/:id',getCanceledOrdersByStation);
router.get('/order/approved/station/:id',getApprovedOrdersByStation);
router.get('/order/revenue/station/:id',getTotalAmountByStation);
router.get('/order/fuelVolume/station/:id',getTotalVolumeDeliveredByStation);
router.get('/order/getOrdersByMonth/:stationId/:month/:year',getOrdersByMonth);

// paystack
router.post('/paystack/Init/',paystackInit)
router.post('/paystack/verify/:reference', verifyPayment);


module.exports=router;