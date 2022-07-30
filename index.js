const app= require('./app');
const conncectDatabase=require('./config/database');
const dotenv=require('dotenv');


//handle uncaught exceptions
process.on('uncaughtException',err=>{
    console.log(`ERROR:${err.message}`);
    console.log('Server down beacuse of unhandled Promise Rejection');
    
        process.exit(1)
    }) 
//setting up config files
dotenv.config({path:'F:\\Icche\\config\\config.env'}); 

//connecting to Database
conncectDatabase();

//setting up cloudinary configuration

const server=app.listen(process.env.PORT,()=>{
    console.log(`Server is Running on port:${process.env.PORT}`);
})

//unhandled Promises rejection error 
process.on('unhandledRejection',err=>{
    console.log(`ERROR:${err.message}`);
    console.log('Server down beacuse of unhandled Promise Rejection');
    server.close(()=>{
        process.exit(1)
    })
})
