require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.19nebqa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Collection
    const database = client.db("iqIntern_DB");
    const feedbackCollection = database.collection("feedbacks");
    const messageCollection = database.collection("messages");

    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    /***********************
      Message related API
    ************************/
    app.get("/messages", async (req, res) => {
      const result = await messageCollection.find().toArray();
      res.send(result);
    });

    app.post("/messages", async (req, res) => {
      const message = req.body;
      const result = await messageCollection.insertOne(message);
      res.send(result);
    });

    /***********************
      Feedback related API
    ************************/
    app.get("/feedbacks", async (req, res) => {
      const result = await feedbackCollection.find().toArray();
      res.send(result);
    });

    app.post("/feedbacks", async (req, res) => {
      const feedback = req.body;
      const result = await feedbackCollection.insertOne(feedback);
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
  res.send("IQIntern server is running"); //message for api
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`); //message for terminal
});
