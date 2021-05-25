const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController');

const coustomerRouter = require('./routers/apiRouters/coustomerRouter.js')
const productRouter = require('./routers/apiRouters/productRouter.js')
const bookingRouter = require('./routers/apiRouters/bookingRouter.js')
const viewRouter = require('./routers/viewRouters/viewRouter.js')

const app = express();


app.enable('trust proxy');

app.set('view engine', 'nunjucks');
nunjucks.configure('views', {
    autoescape: true,
    express: app
});



app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors()); // Implement CORS 
app.options('*', cors()); // Access-Control-Allow-Origin *

app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));


// Body parser, reading data from body into req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: '30kb' }));
app.use(express.urlencoded({ extended: true, limit: '30kb' }));
app.use(cookieParser());


app.use('/api/v1/coustomer', coustomerRouter)
app.use('/api/v1/product', productRouter)
app.use('/api/v1/booking', bookingRouter)

app.use('/', viewRouter)

app.all('*', (req, res, next) => { // page not found handler
    err = new AppError(`can't find ${req.originalUrl} on this server`, 404);
    next(err);
});

app.use(globalErrorHandler);


module.exports = app;