const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.6bdcv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run (){
    try{
        await client.connect();
        const database = client.db('hunter-watch');
        const userCollection =  database.collection('user');
        const orderCollection =  database.collection('order');
        const productsCollection = database.collection('products')
        const reviewCollection = database.collection('review')
        
        app.get('/', (req, res)=>{
            res.send('Runing hunter watch server....')
        })
        
        app.get('/products', async (req,res)=>{
            const cursor = productsCollection.find({});
            const products = await cursor.toArray()
            res.json(products)
        })
        //add user
        app.post('/user', async (req, res)=>{
            const user = req.body;
            const result = await userCollection.insertOne(user)
            res.json(result)
        })
        //update user
        app.put('/user:id', async(req,res)=>{
            const id = req.params.id;
              const updated = req.body;
              const filter ={_id: ObjectId(id)}
              const options = { upsert: true };
              const updateDoc = {
                $set: {
                    name:updated.name,
                    email:updated.email,
                    role:'admin'
                }   
              }; 
              const result = await userCollection.updateOne(filter, updateDoc, options);
            res.json(result)                   
        })
        //update order
        app.put('/order:id', async(req,res)=>{
            const id = req.params.id;
              const updated = req.body;
              const filter ={_id: ObjectId(id)}
              const options = { upsert: true };
              const updateDoc = {
                $set: updated 
              }; 
              const result = await orderCollection.updateOne(filter, updateDoc, options);
            res.json(result)                   
        })
        //load user
        app.get('/user', async (req, res)=>{
            const cursor = userCollection.find({});
            const users = await cursor.toArray()
            res.json(users)
        })

        //add order
        app.post('/order', async (req, res)=>{
            const order = req.body;
            const result = await orderCollection.insertOne(order)
            res.json(result)
        })
        //add review
        app.post('/review', async (req, res)=>{
            const review = req.body;
            console.log(review)
            const result = await reviewCollection.insertOne(review)
            res.json(result)
        })

        //load review
        app.get('/review', async (req,res)=>{
            const cursor = reviewCollection.find({})
            const result = await cursor.toArray()
            res.json(result)
        })
        //delete order
        app.delete('/order:id', async (req, res)=>{
            const id = req.params.id;
            const filter ={_id: ObjectId(id)}  
            const result = await orderCollection.deleteOne(filter)
            res.json(result)
        })
        //delete products
        app.delete('/products:id', async (req, res)=>{
            const id = req.params.id;
            const filter ={_id: ObjectId(id)}  
            const result = await productsCollection.deleteOne(filter)
            res.json(result)
        })
        //add products
        app.post('/products', async (req, res)=>{
            const user = req.body;
            const result = await productsCollection.insertOne(user)
            res.json(result)
        })
        app.get('/order', async (req, res)=>{
            const cursor = orderCollection.find({})
            const order = await cursor.toArray()
            res.json(order)
        })
    
      
        
       
    }
    finally{
            // await client.close()

    }
}
run().catch(console.dir())



app.listen(port, ()=>{
    console.log('listening to port:', port)
})