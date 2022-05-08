const express = require('express');
const cors = require('cors')
const app = express();

const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const res = require('express/lib/response');

// use middleware
app.use(cors())
app.use(express.json());
require('dotenv').config();



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.j1owr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// const uri = "mongodb+srv://greenorganic-food:YWb4N3A90I71rVqH@cluster0.j1owr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    try {

        await client.connect();
        console.log('db connected');
        const inventoryCollection = client.db('greenorganic').collection('inventories')

        app.get('/inventories', async (req, res) => {
            const query = {};
            const inventories = await inventoryCollection.find(query).toArray();
            console.log(inventories);
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