const mongoose=require('mongoose');
const dotenv = require("dotenv");
const getDB = require('./config')
dotenv.config({ path: "./config/config.env" });
const config = {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    useUnifiedTopology: true,
  };
const conncectDatabase=()=>{
    const DB=getDB();
    console.log(DB)
mongoose.connect(DB,config).then(con=>{
    console.log(`MongoDB is connected`); 
}).catch((e)=>console.log(e))
}

module.exports=conncectDatabase;