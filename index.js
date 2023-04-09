const express = require("express");
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("hi hello")
});
app.use(cors());
app.use(express.json());
require('dotenv').config();


//////////////////////


const uri = `mongodb+srv://${process.env.BD_USER}:${process.env.BD_PASS}@cluster0.s0vwyit.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = () => {
    try {
        const phonecollection = client.db("mobileData").collection("phone");
        const phoneBookingCollection = client.db("mobileData").collection("userBooking");

        // To get the data that is in mongodb
        app.get('/phones', async(req, res)=>{
            const query = {};
            const cursor =await phonecollection.find(query).toArray();
            res.send(cursor);
        });

        app.delete('/bookings/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id :new ObjectId(id)};
            const result = await phoneBookingCollection.deleteOne(query)
            res.send(result)
        })


        app.get('/bookings', async(req, res)=>{
            let query = {};
            if(req.query.email){
                query = {
                    email : req.query.email
                }
            }
            const cursor = phoneBookingCollection.find(query);
            const booking = await cursor.toArray();
            res.send(booking)
        })

        // When adding any data to mongodb
        app.post('/bookings', async(req, res)=>{
            const user = req.body;
            const result = await phoneBookingCollection.insertOne(user);
            res.send(result)
        })

    }
    finally {

    }
}
run()



//////////////////////

app.listen(port, () => {
    console.log(`hi hello ${port}`)
});


module.exports = app;