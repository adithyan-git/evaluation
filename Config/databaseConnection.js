const mongoose = require('mongoose');

const databaseConnection = (req,res,next)=>{
    mongoose.connect(process.env.DB_URI)
    .then((data)=>console.log(`database connected with ${data.connection.host}`))
    .catch((err)=>{
        console.log(err.message);
        
    })
}

module.exports = databaseConnection;