const express = require('express');
const { userRegistration, userLogin, displayProfile, deleteProfile, updateProfile, addProduct, updateProduct, deleteProduct, displayRegisterdUser, buyProduct, showSaledProducts, showStatus, updateStatus } = require('../Controller/AllController');
const { authentication, authorizedRole } = require('../Authentication/authentication');

const router = express.Router();
router.route('/register').post(userRegistration)
router.route('/displayuser').get(displayRegisterdUser)
router.route('/login').post(userLogin)
router.route('/profile/:id').get(authentication,displayProfile).delete(authentication,deleteProfile).put(authentication,updateProfile)
router.route('/addproduct').post(authentication,authorizedRole('seller'),addProduct)
router.route('/viewproduct/:id').put(authentication,authorizedRole('seller'),updateProduct).delete(authentication,authorizedRole('seller'),deleteProduct)
router.route('/buyproduct/:id').post(authentication,buyProduct)
router.route('/showallsaledproduct').get(authentication,authorizedRole('admin'),showSaledProducts)
router.route('/showstatus/:id').get(showStatus)
router.route('/updateStatus/:id').put(authentication,authorizedRole('admin'),updateStatus)



module.exports = router