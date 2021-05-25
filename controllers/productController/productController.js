const Product = require('../../models/productSchema.js')
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');


exports.createProduct = catchAsync(async (req, res, next) => {
    let newProduct = await Product.create({
        productName: req.body.productName,
        price: req.body.price,
        description: req.body.description,
        image: req.file.filename
    })

    res.status(201).json({
        status: "success",
        product: newProduct
    });
});

exports.getProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findById(req.params.productId)

    if (!product) {
        return next(new AppError('no product found with that id', 404));
    };
    res.status(200).json({
        status: "success",
        product
    });   
});

exports.allProducts = catchAsync(async (req, res, next) => {
    const products = await Product.find()

    res.status(200).json({
        status: "success",
        products
    });   
});