const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const mongoSanitize = require('helmet');
const xss= require('xss-clean');
const hpp = require('hpp');
const globalErrorHandler = require('./controllers/errorController')
const app = express();
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const cookieParser = require('cookie-parser');
app.set('view engine' , 'pug');
app.set('views', path.join(__dirname,'views'))
//1) Global MiddleWare
//serving static files
app.use(express.static(path.join(__dirname,'public')));

// Set Securtiy Http Headers
app.use(helmet())
//Development logging
if(process.env.NODE_ENV === 'development'){
app.use(morgan('dev'));
}
//Limit requests from same api
const limiter = rateLimit({
  max: 100,
  windowMs: 60*60*1000,
  message: 'Too many requests from this IP,please try again in an hour'
});
app.use('/api',limiter);
//Body parser ,reading data from body into req.body
app.use(express.json({limit: '10kb'}));
app.use(express.urlencoded({extended: true,limit: '10kb'}))
app.use(cookieParser());
//Data sanitization against NoSQL query injection
app.use(mongoSanitize());
//Data sanitization against XSS
app.use(xss());
//Prevent parameter pollution
app.use(hpp({
  whitelist:[
    'duration','ratingsQuantity','ratingsAverage','maxGroupSize','difficulty','price'
  ]
}));
//serving static files
// app.use(express.static(`${__dirname}/public`));


//Test middleware
app.use((req,res,next) =>{
    req.requestTime = new Date().toISOString();
    //console.log(req.headers);
    console.log(req.cookies);
    
    next();

});


//Routes
app.use('/',viewRouter)
app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users',userRouter);
app.use('/api/v1/reviews' , reviewRouter);
app.all('*',(req,res,next) =>{
  
  // const err = new Error( `Cant find ${req.originalUrl} on this server`) //Built in Error() constructor
  // err.status= 'fail';
 //  err.status = 404;
   next(new AppError(`Cant find ${req.originalUrl} on this server`, 400));
});
//ERROR HANDLING MIDDLEWARE
// app.use((err,req,res,next)=>{
//     //console.log(err.stack);
//     err.statusCode = err.statusCode|| 500;
//     err.status = err.status || 'error'
// res.status(err.statusCode).json({
//     status: err.status,
//     message: err.message
//     });
// });

app.use(globalErrorHandler);
module.exports = app;