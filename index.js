const express = require("express");
const cors = require("cors");
var jwt = require("jsonwebtoken");

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

const createToken = (user) => {
  const token = jwt.sign(
    {
      email: user.email,
    },
    "secret",
    { expiresIn: "7d" }
  );
  return token;
};

// verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  console.log("token from headers", token);
  const isVerified = jwt.verify(token, "secret");
  // console.log(isVerified);
  console.log("is Verified =>", isVerified);
  if (!isVerified?.email) {
    res.send("Unauthorized Access");
  }
  req.user = isVerified.email;
  next();
};

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

    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      // const id = req.params.id;
      // const query = { _id: new ObjectId(id) };
      const result = await users.findOne(query);
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const data = req.body;
      const token = createToken(data);
      const usersExist = await users.findOne({ email: data?.email });
      if (usersExist?._id) {
        return res.send({
          status: "success",
          message: "Login success",
          token,
        });
      }
      await users.insertOne(data);
      return res.send({ token });
    });

    // Update User
    app.patch("/users/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const updateData = req.body;
      const result = await users.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );
      console.log(result);
    });

    // app.post("/users", async (req, res) => {
    //   const data = req.body;
    //   const token = createToken(data);
    //   console.log("data", data);
    //   console.log("token ^", token);

    //   const usersExist = await users.findOne({ email: data?.email });
    //   if (usersExist?._id) {
    //     return res.send(token);
    //   }

    //   await users.insertOne(data);
    //   console.log("token ", token);
    //   return res.send(token);
    // });

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

    app.patch("/patientData/:id", verifyToken, async (req, res) => {
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

// Server : https://mediquanta-server-1.onrender.com/
// Client : https://medi-quanta.vercel.app/
