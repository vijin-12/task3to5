const Product = require('../../models/productSchema.js')
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');


exports.allProducts = catchAsync(async (req, res, next) => {
    const products = await Product.find()

    res.status(200).render('index.html', {products})  
});