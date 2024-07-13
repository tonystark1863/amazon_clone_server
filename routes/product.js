const express = require('express');
const productRouter = express.Router();
const auth = require('../middlewares/auth');
const {Product} = require('../models/product');


//      api/products?category=Essentials    --> this is query
productRouter.post('/api/products/',auth ,async(req,res)=>{
    try{
        console.log(req.query.category);
        const products = await Product.find({category : req.query.category});
        res.json(products);
         
    }catch(e){
        res.status(500).json({error : e.message});
    }
}
);

productRouter.post('/api/products/search/:searchItem',auth,async (req,res)=>{
    try{
        const products = await Product.find({
            name:{$regex :req.params.searchItem , $options :"i"},
        });
        console.log(req.params);
        res.json(products);

    }catch(e){
        res.status(500).json({error:e.message});
    }
});

productRouter.post('/api/rate-product',auth,async(req,res)=>{
    try{

        const {id,rating} = req.body;
        console.log(req.user);
        let product = await Product.findById(id);
        for(let i = 0;i<product.ratings.length;i++){
            console.log(product.ratings[i].userId == req.user);
            if(product.ratings[i].userId == req.user){
                console.log(i);
                product.ratings.splice(i,1);
                break;
            }
        }
        const ratingSchema = {
            userId : req.user,
            rating,
        }
        console.log(ratingSchema);
        product.ratings.push(ratingSchema);
        product = await product.save();
        res.json(product);

    }catch(e){
        res.status(500).json({error : e.message});
    }
})


productRouter.post('/api/deal-of-the-day',auth,async(req,res)=>{
    try{
        let products = await Product.find({});
        products = products.sort((a,b)=>{
            let aSum = 0;
            let bSum = 0;
            for(let i = 0;i<a.ratings.length;i++){
                aSum+=a.ratings[i];
            }
            for(let i = 0;i<b.ratings.length;i++){
                bSum+=b.ratings[i];
            }
            return aSum < bSum ? 1:-1;

        });
        res.json(products[0]);


    }catch(e){
        res.status(500).json({error : e.message});
    }

})



module.exports = productRouter;