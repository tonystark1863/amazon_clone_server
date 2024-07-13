//importing from packages
const express = require('express'); 
const mongoose = require('mongoose');
const cors = require('cors');

//importing from other files
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const productRouter = require('./routes/product');
const userRouter = require('./routes/user');

// init
const app = express();  
app.use(cors());
const PORT = process.env.PORT || 3000;
const DB = "mongodb+srv://abhivardhan:ItachiUchiha18@atlascluster.e73tl67.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster";


//middleware    ( CLIENT ---sends data---> SERVER ---returns data to---> CLIENT ) it's not continuous listening type .  for continous listening use Socket IO

// if sender data i unknown and u need to categorise we use middle ware  --- app.use(authRouter);

app.use(express.json());
app.use(authRouter);
app.use(adminRouter);
app.use(productRouter);
app.use(userRouter);


// Connections

mongoose.connect(DB).then(()=>{
    console.log("MongoDB connection Successful");
}).catch((e)=>{
    console.log(e);
})


//CREATING AN API
app.get(
    "/hello",
    (req , res)=>{
        res.json([{"data":"value"}]);
    }
)



// API has CRUD operations i.e GET , PUT , POST , DELETE , UPDATE
app.listen(
    PORT ,                                                 //port
    "0.0.0.0" ,                                           //IP address
    ()=>{ console.log(`connected at port ${PORT}`);}     //callback function
);                


