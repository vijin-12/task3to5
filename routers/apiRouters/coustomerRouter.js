const express = require('express');
const router = express.Router();
const coustomerController = require('../../controllers/coustomerController/coustomerController.js');


router.post('/signup', coustomerController.signup);
router.post('/login', coustomerController.login);
router.get('/logout', coustomerController.logout)

router.post('/updatePassword', coustomerController.coustomerProtect, coustomerController.updatePassword);


module.exports = router;