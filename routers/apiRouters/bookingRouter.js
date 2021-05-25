const express = require('express');
const router = express.Router();
const coustomerController = require('../../controllers/coustomerController/coustomerController.js');
const bookingController = require('../../controllers/bookingController/bookingController.js');


router.post('/createBooking', coustomerController.coustomerProtect, bookingController.createBooking);


module.exports = router;