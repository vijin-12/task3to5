const express = require('express');
const router = express.Router();
const viewController = require('../../controllers/viewController/viewController.js');
const coustomerController = require('../../controllers/coustomerController/coustomerController.js');


router.get('/', coustomerController.isCoustomerLoggedIn, viewController.allProducts);
router.get('/coustomerSignin', viewController.coustomerSignup);


module.exports = router;