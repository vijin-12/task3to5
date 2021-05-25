const express = require('express');
const router = express.Router();
const viewController = require('../../controllers/viewController/viewController.js');
const coustomerController = require('../../controllers/coustomerController/coustomerController.js');


router.get('/', coustomerController.isCoustomerLoggedIn, viewController.allProducts);
router.get('/coustomerSignin', viewController.coustomerSignup);
router.get('/coustomerLogin', viewController.coustomerLogin);
router.get('/productDetail/:productId', viewController.productDetail);

module.exports = router;