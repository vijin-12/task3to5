const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');


dotenv.config({ path: './config.env' });



let DB = process.env.DATABASE

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
    .then(() => console.log('DB connection successful!'))
    .catch(()=> console.log("Database connection failed"))
  
const port = process.env.PORT || 8820;
const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
  

process.on('unhandledRejection', err => { // shutdown the server if any unhandle promise
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    console.log(err)
    server.close(() => {
      process.exit(1);
    });
});


process.on('SIGTERM', () => {  // shutdown during heroku SIGTERM signal
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});