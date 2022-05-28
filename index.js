const express = require('express');
const cors = require('cors')
const app = express();
require('dotenv').config()
const jwt = require('jsonwebtoken');

const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


// use middleware
app.use(cors())
app.use(express.json());
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.j1owr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {

try {

        await client.connect();
    const inventoryCollection = client.db('greenorganic').collection('inventories')
    
    // auth
    app.post('/login', async (req, res) => {
        const user=req.body
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN, {
            expiresIn:"1d"
        })
        res.send({accessToken})
    })

        app.get('/inventories', async (req, res) => {
            const query = {};
            const inventories = await inventoryCollection.find(query).toArray();
             res.send(inventories)
        });
        app.get('/inventories/:id', async(req,res)=>{
            const id=req.params.id;
            const query={_id: ObjectId(id)}
            const inventory=await inventoryCollection.findOne(query)
            res.send(inventory);
        });
        //POST
        app.post('/inventories', async(req,res)=>{
            const newItem=req.body;
            const result=await inventoryCollection.insertOne(newItem)
            res.send(result)
        })
        //DELETE
        app.delete('/inventories/:id', async (req, res) => {
            const id = req.params.id;
            const qrl = { _id: ObjectId(id) };
            const result = await inventoryCollection.deleteOne(qrl);
            res.send(result);
        })
        //
        app.put('/update-inventories/:id', async (req, res) => {
            const id = req.params.id;
            const updatedInventoriesInfo = req.body;
          
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity: updatedInventoriesInfo.quantity,

                }
            }
            const result = await inventoryCollection.updateOne(filter, updatedDoc, options);
            res.send(result)
        });

    app.get('/myitems', async (req, res) => {
        const email=req.query.email
        const query={email:email}
        const cursor=inventoryCollection.find(query)
        const myItems=await cursor.toArray()
        res.send(myItems)
    })

    }
    finally {

    }

}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('hello nodemon js')
});

app.listen(port, () => {
    console.log('Listening to port', port);
})