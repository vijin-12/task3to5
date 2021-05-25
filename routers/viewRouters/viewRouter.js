const express = require('express');
const router = express.Router();
const viewController = require('../../controllers/viewController/viewController.js');


router.get('/', viewController.allProducts);


module.exports = router;