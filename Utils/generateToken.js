const jwt = require('jsonwebtoken')
const generateToken = (req,res,next) =>{
    const options = {
        id:req.user.id,
        role:req.user.role
    }

    const token = jwt.sign(options,process.env.SECRET_KEY,{expiresIn:'30m'});
    console.log('token=>',token);
    

    if(!token){
        res.status(401).json({
            success:false,
            message:'please login'
        })
    }
    const loggedUser  = req.user
    res.status(201).cookie('token',token).json({
        success:true,
        message:'login completed successfully',
        loggedUser
    })
}

module.exports = generateToken