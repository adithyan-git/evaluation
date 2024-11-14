const jwt = require('jsonwebtoken')
exports.authentication = (req,res,next)=>{
    const {token} = req.cookies

    if(!token){
        res.status(403).json({
            success:false,
            message:'please login'
        })
    }

    jwt.verify(token,process.env.SECRET_KEY,(err,decode)=>{
        if(err){
            res.status(404).json({
                success:false,
                message:'invalid token ,please login'
            })
        }
        console.log('decode=>',decode);
        
        req.userid = decode.id
        req.role = decode.role
    next();
    })

}
exports.authorizedRole = (...roles)=>{

    return (req,res,next)=>{
        const userRole = req.role
        if(!roles.includes(userRole)){
            res.status(403).json({
                success:false,
                message:'unauthorized access'
            })
        }
        next()
    }
}