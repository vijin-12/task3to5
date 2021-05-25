const mongoose = require('mongoose');


const bookingSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: [true, 'Bookings must belong to a Product']
    },
    coustomer: {
        type: mongoose.Schema.ObjectId,
        ref: 'Coustomer',
        required: [true, 'Booking must belong to a coustomer']
    },
    price: {
        type: Number,
        required: [true, 'Bookings must have a price']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    paid: {
        type: Boolean,
        default: true
    }
});

bookingSchema.pre('find', function (next) {
    this.populate('coustomer').populate('product');
    next()
});

bookingSchema.pre('findOne', function (next) {
    this.populate('coustomer').populate('product');
    next()
});


const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;