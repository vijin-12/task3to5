const express = require('express');
const router = express.Router();
const viewController = require('../../controllers/viewController/viewController.js');
const coustomerController = require('../../controllers/coustomerController/coustomerController.js');

router.use(coustomerController.isCoustomerLoggedIn)

router.get('/',  viewController.allProducts);
router.get('/coustomerSignin', viewController.coustomerSignup);
router.get('/coustomerLogin', viewController.coustomerLogin);
router.get('/productDetail/:productId', coustomerController.coustomerProtect, viewController.productDetail);
router.get('/bookedProducts', coustomerController.coustomerProtect, viewController.bookedProducts);
router.get('/createProduct',  viewController.createProduct);

module.exports = router;