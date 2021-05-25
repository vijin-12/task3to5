const Product = require('../../models/productSchema.js')
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');


exports.allProducts = catchAsync(async (req, res, next) => {
    const products = await Product.find()

    res.status(200).render('index.html', {products})  
});

exports.coustomerSignup = catchAsync(async (req, res, next) => {
    res.status(200).render('coustomerSignup.html')  
});

exports.coustomerLogin = catchAsync(async (req, res, next) => {
    res.status(200).render('coustomerLogin.html')  
});

exports.productDetail = catchAsync(async (req, res, next) => {
    let productId = req.params.productId
    let product = await Product.findOne({_id: productId})
    res.status(200).render('productDetail.html', {product})  
});