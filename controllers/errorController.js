const AppError = require('../utils/appError');

const sendErrorDev = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) { 
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    } else { 
        return res.status(err.statusCode).render('error.html', {
            title: 'something went wrong',
            msg: err.message
        })
    }
};

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400)
};

const handleDuplicateFieldsDB = err => {
    console.log(err)
    const message = `Duplicate field value  please use another value`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const handleJWTError = () => new AppError('invalid token please provid a valid token', 401);


const handleJWTExpiredError = () => new AppError('your token has expired please log in again to get new token', 401);


module.exports = (err, req, res, next) => {
    err.status = err.status || 'error';
    err.statusCode = err.statusCode || 500;
    if (process.env.NODE_ENV === 'development') console.log(err)
    let error = new Object(err);
    error.message = err.message;
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorDev(error, req, res)

}