const express = require('express')
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const objectId = require('mongodb').ObjectId;
const jwt = require('jsonwebtoken');
const { ObjectID } = require('bson');
const stripe = require('stripe')(process.env.STRIP_SECRET_KEY);
const app = express();
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to Car Service Tools website')
})
// ======= middleware jwt ========
function verifyJWT(req, res, next){
  const authorization = req.headers.authorization;
  if(!authorization){
    return res.status(401).send({message: 'Unauthorized access'})
  }
  const token = authorization.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
    if(err){
      return res.status(403).send({message: 'Forbidden access'})
    } 
    req.decoded = decoded;
    next();
  });
}


// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xwe6b.mongodb.net/?retryWrites=true&w=majority`;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.i5guk.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// console.log(client)

async function run(){
  try{
    await client.connect();
    const userCollection = client.db("car-service-tools").collection("users");
    const productCollection = client.db("car-service-tools").collection("product");
    const orderCollection = client.db("car-service-tools").collection("orders");
    const reviewCollection = client.db("car-service-tools").collection("reviews");
    const paymentCollection = client.db("car-service-tools").collection("payment");

    // 


  

    //



    // =====get method====
    app.get('/user', verifyJWT, verifyAdmin, async (req, res) => {
      const users = await userCollection.find().toArray();
      res.send(users);
    })

    app.get('/admin/:email', async (req, res) => {
      const email = req.params.email;
      const user = await userCollection.findOne({email: email});
      const isAdmin = user.role === "admin"
      res.send({admin: isAdmin});
    })

    app.get('/product', async (req, res) => {
      const result = await productCollection.find().toArray();
      res.send(result.reverse());
    });

    app.get('/order', async (req, res) => {
      const result = await orderCollection.find().toArray();
      res.send(result);
    });

    app.get('/myOrder', async (req, res) => {
      const email = req.query.email
      const query = { email: email };
      const result = await orderCollection.find(query).toArray();
      res.send(result);
    });

    app.get('/review', async (req, res) => {
      const result = await reviewCollection.find().toArray();
      res.send(result.reverse());
    });

    app.get('/product/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: objectId(id)}
      const product = await productCollection.findOne(query);
      res.send(product);
    })

    app.get('/payProduct/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: objectId(id)}
      const product = await orderCollection.findOne(query);
      res.send(product);
    })

    // ===== Post method =======
    app.post('/product', verifyJWT, verifyAdmin, async (req, res) => {
      const product = req.body;
      const result = await productCollection.insertOne(product);
      res.send(result);
    })
    app.post('/review', verifyJWT, async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    })

    app.post('/order', async (req, res) => {
      const product = req.body;
      const result = await orderCollection.insertOne(product);
      res.send(result);
    })




    //
    
    //


  }finally{

  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`Car Service Tools Server is running at port ${port}`)
})





// const { MongoClient, ServerApiVersion } = require('mongodb');

// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });