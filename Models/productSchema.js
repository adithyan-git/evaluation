const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productname:{
        type:String,
        require:true 
    },
    description:{
        type:String,
        require:true
    },
    price:{
        type:String,
        require:true
    },
    quantity:{
        type:String,
        require:true
    },
    uid:{
        type:String,
        require:true
    }
})

const products = mongoose.model('Product',productSchema);
module.exports = products 