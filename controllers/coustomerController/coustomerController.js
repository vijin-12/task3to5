const jwt = require('jsonwebtoken');
const {promisify} = require('util');
const crypto = require('crypto');
const Coustomer = require('../../models/coustomerSchema.js')
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const {createSendToken} = require('../../utils/jwtUtils.js');


exports.signup = catchAsync(async (req, res, next) => {
    let email = req.body.email.toLowerCase()
    const coustomer = await Coustomer.findOne({ email })
    if (coustomer) {
        return next(new AppError('There is a coustomer with this eamil please try diffirent email', 400))
    }
    const newCoustomer = await Coustomer.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        mobileNumber: req.body.mobileNumber,
        address: req.body.address
    })
    createSendToken(newCoustomer, 201, req, res)
})


exports.login = catchAsync(async (req, res, next) => {
    let { email, password } = req.body
    // 1) checking if the email and password exist
    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400))
    }
    // 2) chek if user exists and password is correct
    email = email.toLowerCase()
    let coustomer = await Coustomer.findOne({ email })
    if (!coustomer) return next(new AppError('No user found with that email', 401))
    coustomer = await Coustomer.findOne({ email }).select('+password')

    if (!coustomer || !(await coustomer.correctPassword(password, coustomer.password))) {
        return next(new AppError('Please provide correct email and password', 400))
    }
    createSendToken(coustomer, 200, req, res, next)
})

// middleware to allow only logged in Coustomer
exports.coustomerProtect = catchAsync(async (req, res, next) => {
    //1) getting token and check is there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    };
    if (!token || token === 'logout') {
        return next(new AppError('you are not logged in please log in', 401))
    }
    //2) verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    //3) checking if user still exists
    const currentCoustomer = await Coustomer.findOne({ _id: decoded.id });
    if (!currentCoustomer) { 
        return next(new AppError(' Coustomer has deleted create new user to log in ', 404));
    };
    //4) check if user changed password after the token issued
    if (currentCoustomer.changedPasswordAfter(decoded.iat)) {
        return next( new AppError('Resently changed password! please login again to get token', 401))
    };
    // authenticated success
    req.jwt_token = token;
    req.userType = decoded.userType;  // check admin or coustomer
    req.coustomer = currentCoustomer;
    res.locals.userType = decoded.userType;
    res.locals.coustomer = currentCoustomer.name; // getting data in template 'pug'
    next()
});


exports.isCoustomerLoggedIn = async (req, res, next) => {
    try{
        if (req.cookies.jwt) {//1) getting token and check is there
            token = req.cookies.jwt
            //2) verification token
            const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
            //3) checking if user still exists
            const currentCoustomer = await Coustomer.findOne({ _id: decoded.id });
            if (!currentCoustomer) { 
                res.locals.coustomer = undefined;
                return next();
            };
            //4) check if user changed password after the token issued
            if (currentCoustomer.changedPasswordAfter(decoded.iat)) {
                res.locals.coustomer = undefined;
                return next()
            };
            res.locals.userType = decoded.userType
            res.locals.coustomer = currentCoustomer.name
            res.locals.coustomerId = currentCoustomer._id
            return next()
        }
        res.locals.coustomer = undefined;
        res.locals.userType = undefined
        return next()
    }catch{
        // no user loged in block will work during log out or changing the json web token
        res.locals.coustomer = undefined;
        res.locals.userType = undefined
        return next()
    }
};

exports.logout = async (req, res) => {
    res.cookie('jwt', 'logout', {
        expires: new Date(Date.now + 10 * 1000),
        httpOnly: true
    })
    return res.status(200).json({ status: 'success'});
};


// update password api
exports.updatePassword = catchAsync(async (req, res, next) => {
    if (!req.body.passwordCurrent || !req.body.password || !req.body.passwordConfirm) {
        return next(new AppError('passwordCurrent, password and passwordConfirm fields are must', 400));
    }
  // 1) Get user from collection
  const coustomer = await Coustomer.findById(req.coustomer.id).select('+password');
  // 2) Check if POSTed current password is correct
  if (!(await coustomer.correctPassword(req.body.passwordCurrent, coustomer.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }
  // 3) If so, update password
  coustomer.password = req.body.password;
  coustomer.passwordConfirm = req.body.passwordConfirm;
  await coustomer.save();
  // 4) Log coustomer in, send JWT
  createSendToken(coustomer, 200, req, res, next)
});