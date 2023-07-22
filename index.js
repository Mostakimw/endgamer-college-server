const express = require("express");
require("dotenv").config();
const cors = require("cors");

const app = express();

const port = process.env.PORT || 5000;

// ! middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eh4qdyd.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const collegesCollection = client.db("endgamerCollege").collection("colleges");
const candidatesCollection = client
  .db("endgamerCollege")
  .collection("candidates");

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // ! getting colleges data
    app.get("/colleges", async (req, res) => {
      const result = await collegesCollection.find().toArray();
      res.send(result);
    });

    // ! getting single college data
    app.get("/colleges/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await collegesCollection.findOne(query);
      res.send(result);
    });

    //! getting college by their college id
    app.get("/college/:collegeId", async (req, res) => {
      const collegeId = req.params.collegeId;
      const query = { collegeId: collegeId };
      const result = await collegesCollection.findOne(query);
      res.send(result);
    });

    // ! post candidates data
    app.post("/candidates", async (req, res) => {
      const candidate = req.body;
      console.log(candidate);
      const result = await candidatesCollection.insertOne(candidate);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server is running");
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
