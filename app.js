const express=require('express');
const cors=require('cors');
const app=express();
// const corsOptions ={
//     origin:'http://localhost:3000/', 
//     credentials:true,            //access-control-allow-credentials:true
//     optionSuccessStatus:200
// }
app.use(cors());
const errorMiddleware=require('./Middleware/Error')

const bodyParser=require('body-parser')
const dotenv=require('dotenv');
const cookieParser = require('cookie-parser');
// const cloudinary=require('cloudinary')
// const fileUpload =require('express-fileupload')

app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieParser());


// app.use(fileUpload());


dotenv.config({path:'F:\\Ecommerce\\config\\config.env'}); 


//importes all routes
const productRoute=require('./Routes/Product');
const authRoute=require('./Routes/auth');
const orderRoute=require('./Routes/orderRoute');


app.use('/api/v1',productRoute);
app.use('/api/v1',authRoute);
app.use('/api/v1',orderRoute);


    // app.use(express.static(path.join(__dirname,'../front-end',)))
    // app.get('*',(req,res)=>{
    // res.sendFile(path.resolve(__dirname, '../front-end/build/index.html'))

    // })

//Middleware to handle erros
app.use(errorMiddleware)

module.exports=app;