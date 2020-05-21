 const mongoose = require('mongoose');
 const dotenv = require('dotenv');
 dotenv.config({path: './config.env'});
 const app = require('./app');
console.log(process.env.NODE_ENV);
 const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);
 mongoose.connect(DB,{
     useNewUrlParser:true,
     userCreateIndex:true,
     useFindAndModify:false,
     useNewUrlParser: true,
      useUnifiedTopology: true
 }).then(() => console.log('DB Conncetion Succesfull'));
 mongoose.set('useCreateIndex', true);

 const port = process.env.PORT || 3000;
 app.listen(port ,() =>{
     console.log(`App running on port ${port}.....`);
 });

// const mongoose = require('mongoose');
 //const dotenv = require('dotenv');

// process.on('uncaughtException', err => {
//   console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
//   console.log(err.name, err.message);
//   process.exit(1);
// });

// dotenv.config({ path: './config.env' });
// const app = require('./app');

// const DB = process.env.DATABASE.replace(
//   '<PASSWORD>',
//   process.env.DATABASE_PASSWORD
// );

// mongoose
//   .connect(DB, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false
//   })
//   .then(() => console.log('DB connection successful!'));

// const port = process.env.PORT || 3000;
// const server = app.listen(port, () => {
//   console.log(`App running on port ${port}...`);
// });

// process.on('unhandledRejection', err => {
//   console.log('UNHANDLED REJECTION! 💥 Shutting down...');
//   console.log(err.name, err.message);
//   server.close(() => {
//     process.exit(1);
//   });
// });
