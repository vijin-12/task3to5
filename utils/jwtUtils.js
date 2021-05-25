const jwt = require('jsonwebtoken');
const {promisify} = require('util');
const AppError = require('./appError');


const signToken_ = function(user) {
    return jwt.sign({ id: user._id, userType: user.userType },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    )
}

exports.signToken = signToken_

exports.createSendToken = function (user, statusCode, req, res){
    const token = signToken_(user);
    res.cookie('jwt', token, {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
    });
  
    // Remove password from output
    user.password = undefined;
  
    return res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user
      }
    });
};


exports.createSendTokenAndRedirect = function (user, statusCode, req, res){
    const token = signToken_(user);
  
    res.cookie('jwt', token, {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
    });
  
    // Remove password from output
    user.password = undefined;
  
    res.status(statusCode).redirect('/accountActivated')
};