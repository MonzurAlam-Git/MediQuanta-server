const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://monzuralam16:dfjJoUIa2ifReuaj@cluster0.txrvulz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("successfully connected to MongoDB!");

    const database = client.db("mediQuanta");
    const services = database.collection("services");
    const patientData = database.collection("patientData");
    const users = database.collection("users");

    // Users related Operation
    app.get("/users", async (req, res) => {
      const result = await users.find().toArray();
      res.send(result);
    });

    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await users.findOne(query);
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const data = req.body;
      const result = await users.insertOne(data);
      res.send(data);
    });

    // patient data operations
    app.get("/patientData", async (req, res) => {
      const result = await patientData.find().toArray();
      res.send(result);
    });
    app.get("/patientData/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const result = await patientData.findOne(query);
      res.send(result);
    });
    app.post("/patientData", async (req, res) => {
      const data = req.body;
      const result = await patientData.insertOne(data);
      res.send(data);
    });

    app.patch("/patientData/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;
      const result = await patientData.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData }
      );
      res.send(result);
      console.log(updatedData);
      console.log(id);
    });

    app.delete("/patientData/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await patientData.deleteOne(query);
      res.send(result);
    });
    //  services operations
    app.get("/services", async (req, res) => {
      const result = await services.find().toArray();
      res.send(result);
    });

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const result = await services.findOne();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Shob thikthak");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
// monzuralam16
// dfjJoUIa2ifReuaj

// mongodb+srv://monzuralam16:dfjJoUIa2ifReuaj@cluster0.txrvulz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

// https://mediquanta-server-1.onrender.com/
