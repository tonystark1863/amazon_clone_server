const express = require('express');
const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');
const authRouter = express.Router();


authRouter.post( '/api/signup',  async(req,res)=>{
    try{
        const {name , email,password} = req.body; 
    
        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({msg :'User with same email already exists!'});
        }

        const hashedPassword = await bcryptjs.hash(password,8);  //here 8 is salt , which can be a error added to our password

        let user = new User({
            name,
            email ,
            password : hashedPassword,
        })

        user = await user.save();
        res.json(user);
    }catch(e){
        res.status(500).json({error:e.message});
    }

    //get the data from client
    //post that data in database
    //return that data to the user
})


//sign in route

authRouter.post('/api/signin',async (req,res)=>{
    try{
        const {email,password} = req.body;

        console.log(email,password);

        const userDetails = await User.findOne({email});

        if(!userDetails){
            return  res.status(400).json({success : false , message:"user with this mail doesn't exist!"});
    
        }
        const isPasswordCorrect = await bcryptjs.compare(password,userDetails.password);
        if(!isPasswordCorrect){
            return res.status(400).json({success : false , message : "Incorrect Password"});
        }

        const token = jwt.sign({id : userDetails._id},"passwordKey");
        console.log(token);
        res.json({token,...userDetails._doc});
    }
    catch(e){
        res.status(500).json({error:e.message});
    }
})


authRouter.post('/tokenIsValid',async(req,res)=>{
    try{
        const token = req.header("x-auth-token");
        if(!token) return res.json(false);

        const verified = jwt.verify(token,"passwordKey");
        if(!verified) return res.json(false);

        const user = await User.findById(verified.id);
        if(!user) return res.json(false);

        res.json(true);
    }catch(e){
        console.log(e);
    }
  }
);

//get user data

authRouter.get("/" , auth, async(req,res) =>{
    const user = await User.findById(req.user);
    console.log(user);
    res.json({...user._doc , token : req.token});
});

module.exports = authRouter;