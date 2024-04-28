const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r90hnej.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("craftyfiber");
    const crafts = database.collection("crafts");
    const categories = database.collection("categories");

    app.get("/craft", async (req, res) => {
      const cursor = crafts.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/categories", async (req, res) => {
      const cursor = categories.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/craft/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await crafts.findOne(query);
      res.send(result);
    });

    app.get("/usercraft/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const cursor = crafts.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/craft", async (req, res) => {
      const newCraft = req.body;
      console.log(newCraft);
      const result = await crafts.insertOne(newCraft);
      res.send(result);
    });

    app.put("/craft/:id", async (req, res) => {
      const id = req.params.id;
      const updatedCraft = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const Craft = {
        $set: {
          image: updatedCraft.image,
          Item_name: updatedCraft.Item_name,
          category: updatedCraft.category,
          price: updatedCraft.price,
          rating: updatedCraft.rating,
          customization: updatedCraft.customization,
          processing_time: updatedCraft.processing_time,
          stock: updatedCraft.stock,
          short_description: updatedCraft.short_description,
        },
      };
      const result = await crafts.updateOne(filter, Craft, options);
      res.send(result);
    });

    app.delete("/craft/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await crafts.deleteOne(query);
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
  res.send("CrafyFiber Server Is Running");
});

app.listen(port, () => {
  console.log(`CraftyFiber server is running on ${port}`);
});
