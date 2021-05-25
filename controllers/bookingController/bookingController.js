const Booking = require('../../models/bookingSchema.js')
const AppError = require('../../utils/appError')
const catchAsync = require('../../utils/catchAsync')

exports.createBooking = catchAsync(async (req, res, next) => {
    console.log(req.body.productId)
    console.log(req.body.coustomerId)
    console.log(req.body.price)
    let newBooking = await Booking.create({
        product: req.body.productId,
        price: req.body.price,
        coustomer: req.body.coustomerId
    })

    res.status(201).json({
        status: "success",
        booking: newBooking
    });
});