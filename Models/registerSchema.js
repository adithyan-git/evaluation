const mongoose = require('mongoose');
const registerSchema = new mongoose.Schema({
    fullname:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    role:{
        type:String,
        default:'user'
    }
})

const userRegistration = mongoose.model('registerdUser',registerSchema);
module.exports = userRegistration;