const mongoose=require('mongoose');
// const dotenv = require("dotenv");
const getDB = require('./config')
// dotenv.config({ path: "./config/config.env" });
const conncectDatabase=()=>{
    const DB=getDB();
mongoose.connect(process.env.DB_URL,{
    
}).then(con=>{
    console.log(`MongoDB host:${con.connection.host}`); 
}).catch((e)=>console.log(e))
}

module.exports=conncectDatabase;