const express = require('express')
const app = express();
const cors = require('cors');
app.use(cors()); 
 app.use(express.json());
 const ObjectId = require('mongodb').ObjectId ;

const port = 5000;
require('dotenv').config()

const MongoClient = require('mongodb').MongoClient;
const { ObjectID } = require('bson');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.moazf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("freshValleyNetwork").collection("products");
  const checkoutCollection = client.db("freshValleyNetwork").collection("orderedProducts");

  
  // perform actions on the collection object
//  console.log(err);
app.get('/products',(req,res)=>{
    productsCollection.find({})
    .toArray((err,documents)=>{
        res.send(documents);
      })

   })
app.get('/product/:id',(req,res)=>{
  const id = req.params.id;
    productsCollection.find({_id:ObjectId(id)})
    .toArray((err,documents)=>{
        res.send(documents[0]);
      })

   })

   app.post('/addCheckout', (req,res)=>{
    const checkout = req.body;
    checkoutCollection.insertOne(checkout,(err,result)=>{
   
     res.send({count: result.insertedCount});
    })
  })

  app.get('/orders',(req,res)=>{
    checkoutCollection.find({})
    .toArray((err,documents)=>{
        res.send(documents);
      })
  
   })
  app.get('/order/:email',(req,res)=>{
    const email = req.params.email;
    checkoutCollection.find({email: email})
    .toArray((err,documents)=>{
        res.send(documents);
      })

   })

   app.post('/addProduct', (req,res)=>{
    const product = req.body;
    productsCollection.insertOne(product,(err,result)=>{
   
     res.send({count: result.insertedCount});
    })
  })

  app.delete('/deleteCheckout/:id',(req, res)=>{
    const id = req.params.id;
    checkoutCollection.deleteOne({_id: ObjectId(id)},(err)=>{
      // console.log(result.deletedCount);
      // res.send({count: result.deletedCount});
      if(!err){
        res.send({count: 1})
      }


    })

  })

  //  app.post('/addProducts', (req,res)=>{
  //    const products = req.body;
  //    productsCollection.insertMany(products,(err,result)=>{
    
  //     res.send({count: result.insertedCount});
  //    })
  //  })


   app.get('/', (req, res) => {
    res.send('Hello World!')
  })

});










app.listen( process.env.PORT || port);