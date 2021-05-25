const express = require('express');
const router = express.Router();
const productController = require('../../controllers/productController/productController.js');
const productImageController = require('../../controllers/productController/multerController.js');


router.post('/createProduct', productImageController.uploadProductImage, productController.createProduct);
router.get('/getProduct/:productId', productController.getProduct);
router.get('/allProducts', productController.allProducts);

module.exports = router;