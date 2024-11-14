const mongoose = require('mongoose');
const products = require('./productSchema');

const orderSchema = new mongoose.Schema({
    productname:{
        type:String,
        require:true
    },
    productId:{
        type:String,
        require:true
    },
    userid:{
        type:String,
        require:true
    },
    quantity:{
        type:String,
        require:true
    },
    status:{
        type:String,
        default:'pending'
    }
})

const orderdProduct = mongoose.model('orderdProduct',orderSchema);
module.exports = orderdProduct;