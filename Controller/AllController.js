const bcrypt = require('bcrypt');
const userRegistration = require('../Models/registerSchema');
const generateToken = require('../Utils/generateToken');
const { use } = require('../app');
const products = require('../Models/productSchema');
const orderdProduct = require('../Models/orderSchema');

exports.userRegistration = async (req,res,next)=>{
    const {fullname,email,password} = req.body

    if(!fullname || !email || !password){
        res.status(400).json({
            success:false,
            message:'please fill all fields'
        })
    }

    const hashedPassword = await bcrypt.hash(password,10);
    console.log('hashedPassword',hashedPassword);
    
    const registerdUser = await userRegistration.create({
        fullname,
        email,
        password:hashedPassword
    })

    res.status(201).json({
        success:true,
        message:'registration completed successfully',
        registerdUser
    })
}
exports.userLogin = async (req,res,next)=>{
    const {email,password} = req.body

    if(!email || !password){
        res.status(400).json({
            success:false,
            message:'please fill all fields'
        })
    }

    const findedUser = await userRegistration.findOne({email});
    console.log('findedUser=',findedUser);
    

    if(!findedUser){
        res.status(400).json({
            success:false,
            message:'invalid email and password'
        })
    }

    const isMatch = await bcrypt.compare(password,findedUser.password);

    if(!isMatch){
        res.status(400).json({
            success:false,
            message:'user not found'
        })
    }

    const loggeduser = {
        id:findedUser._id,
        fullname:findedUser.fullname,
        email:findedUser.email,
        role:findedUser.role
    }

    req.user = loggeduser
    generateToken(req,res)
}
exports.displayProfile = async (req,res,next)=> {
    const userId  = req.userid

    if(!userId){
        res.status(403).json({
            success:false,
            message:'please login to access this route'
        })
    }

   try {
    const findedUser = await userRegistration.findById(userId);

    if(!findedUser){
        res.status(400).json({
            success:false,
            message:'user not found'
        })
    }

    const user = {
        id:findedUser._id,
        fullname:findedUser.fullname,
        email:findedUser.email
    }

    res.status(200).json({
        success:true,
        message:' profile displayed successfully',
        user
    })
   } catch (error) {
    res.status(400).json({
        success:false,
        message:error.message
    })
   }
}
exports.deleteProfile = async (req,res,next) =>{
    const userId = req.params.id;

    if(!userId){
        res.status(401).json({
            success:false,
            message:'user not found'
        })
    }

   try {
    const deletedUser = await userRegistration.findByIdAndDelete(userId);

    if(!deletedUser){
        res.status(401).json({
            success:false,
            message:'user not found'
        })
    }

    res.status(200).json({
        success:true,
        message:'user profile deleted'
    })
   } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
   }

}
exports.updateProfile = async(req,res,next) => {
    const userId = req.params.id
    const {fullname,email} = req.body

    if(!userId){
        res.status(403).json({
            success:false,
            message:'please login to access this route'
        })
    }

    if(!fullname || !email){
        res.status(400).json({
            success:false,
            message:'please fill allfields'
        })
    }

   try {
    const findedUser = await userRegistration.findById(userId);

    if(!findedUser){
        req.status(400).json({
            success:false,
            message:'user not found'
        })
    }

    findedUser.fullname = fullname
    findedUser.email = email

    const updatedUser = await findedUser.save()
    const user={
        id:updatedUser._id,
        fullname:updatedUser.fullname,
        email:updatedUser.email
    }

    res.status(200).json({
        success:false,
        message:'userProfile updated successfully',
        user
    })
   } catch (error) {
    res.status(400).json({
        success:false,
        message:error.message
    })
   }

}
exports.addProduct = async(req,res,next)=>{
    const userId = req.userid
    const {productname,description,price,quantity} = req.body

    if(!productname || !description || !price || !quantity){
        res.status(400).json({
            success:false,
            message:'please fill allfields'
        })
    }
        try {
            const product = await products.create({
                productname,
                description,
                price,
                quantity,
                uid:userId
            })
            
                res.status(201).json({
                    success:true,
                    message:'successfully added  product',
                    product
                })
        } catch (error) {
            console.log(error.message)
        }
}
exports.updateProduct =async (req,res,next)=>{
    const productId = req.params.id
    const {productname} = req.body

    if(!productId){
        res.status(403).json({
            success:false,
            message:'please loggin to access this route'
        })
    }

    if(!productname){
        res.status(400).json({
            success:false,
            message:'please fillthis fields'
        })
    }
   try {
    const findedProduct = await products.findById(productId);

    if(!findedProduct){
        res.status(400).json({
            success:false,
            message:'user not found'
        })
    }

    findedProduct.productname = productname;
    const updateProduct = await findedProduct.save()

    const product = {
        id:updateProduct._id,
        productname : updateProduct.productname
    }
    res.status(200).json({
        success:true,
        message:'product updation completed',
        product
    })
   } catch (error) {
    console.log(error.message);
    
   }
}
exports.deleteProduct = async (req,res,next) =>{
    const productId = req.params.id
    const uid = req.userid
    console.log('produid',productId);
    
    if(!productId){
        res.status(401).json({
            success:false,
            message:'product not found'
        })
    }

   try {
    const product = await products.findById(productId)
    console.log(product);
    
    if(uid !== product.uid){
       res.status(403).json({
        success:false,
        message:'you donot have an authority'
       })
    }

    const deletedProduct = await products.findByIdAndDelete(productId);

    if(!deletedProduct){
        res.status(401).json({
            success:false,
            message:'product not found'
        })
    }

    res.status(200).json({
        success:true,
        message:'product deleted'
    })
   } catch (error) {
    console.log(error.message);
    
   }
  
   

}
exports.displayRegisterdUser = async (req,res,next)=>{
    const allUsers = await userRegistration.find();

    if(!allUsers){
        res.status(403).json({
            success:false,
            message:'users not found'
        })
    }

    res.status(200).json({
        success:true,
        allUsers
    })
}
exports.buyProduct = async (req,res,next)=>{

    const productid = req.params.id
    const {quantity} = req.body
    const userId = req.userid 

    if(!productid){
        res.status(400).json({
            success:false,
            message:'product not found'
        })
    }

    if(!quantity){
        res.status(400).json({
            success:false,
            message:'please add quantity number'
        })
    }

    const foundedProduct = await products.findById(productid)

    if(!foundedProduct){
        res.status(400).json({
            success:false,
            message:'product not found'
        })
    }

    const totalPrice = foundedProduct.price * quantity ;

     

    const buyProduct = await orderdProduct.create({
        productname:foundedProduct.productname,
        productId:foundedProduct._id,
        quantity:quantity,
        userid:userId
    })

    res.status(200).json({
        success:true,
        message:'you buy product successfully',
        product:{
            productname:foundedProduct.productname,
            quantity:quantity,
            totalprice:totalPrice,
            status:buyProduct.status
            
        }
    })

}
exports.showSaledProducts = async (req,res,next)=>{
    const showallsaledProducts = await orderdProduct.find();

    if(!showallsaledProducts){
        res.status(400).json({
            success:false,
            message:'no products saled'
        })
    }


    res.status(200).json({
        success:true,
        showallsaledProducts
    })
}
exports.showStatus = async (req,res,next)=>{
        const orderid = req.params.id
        if(!orderid){
            res.status(400).json({
                success:false,
                message:'product not found'
            })
        }

        const foundedProduct = await orderdProduct.findById(orderid)
        if(!foundedProduct){
            res.status(400).json({
                success:false,
                message:'productnotfound'
            })
        }

        res.status(200).json({
            success:true,
            product:{
               status : foundedProduct.status
            }
        })
}
exports.updateStatus = async (req,res,next) => {
    const orderid = req.params.id
    const status = req.body.status
    if(!orderid){
        res.status(404).json({
            success:false,
            message:'id not found'
        })
    }

    const foundedOrder = await orderdProduct.findById(orderid);

    if(!foundedOrder){
        res.status(404).json({
            success:false,
            message:'no order found'
        })
    }

    foundedOrder.status = status

    foundedOrder.save();

    res.status(200).json({
        success:true,
        status:foundedOrder.status
    })
}