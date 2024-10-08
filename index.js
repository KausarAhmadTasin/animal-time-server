const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://animal-time.vercel.app"],
    credentials: true,
  })
);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dqs9o84.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();

    const categoryCollection = client
      .db("animal_time")
      .collection("categoryCollection");
    const animalCollection = client
      .db("animal_time")
      .collection("animalCollection");

    // Category related api
    app.get("/categories", async (req, res) => {
      const categories = await categoryCollection.find().toArray();
      res.send(categories);
    });

    app.post("/categories", async (req, res) => {
      let categoryName = req.body.category_name;

      categoryName =
        categoryName.charAt(0).toUpperCase() +
        categoryName.slice(1).toLowerCase();

      const category = { ...req.body, category_name: categoryName };

      const query = { category_name: new RegExp(`^${categoryName}$`, "i") };

      const existingCategory = await categoryCollection.findOne(query);

      if (existingCategory) {
        return res.status(400).send({ message: "Category already exists" });
      }

      const result = await categoryCollection.insertOne(category);
      res.send(result);
    });

    // Animal realated api
    app.get("/animals", async (req, res) => {
      const category = req.query.category;
      let query = {};

      query = { animal_category: category };

      if (query.animal_category === "All") {
        const animals = await animalCollection.find().toArray();
        return res.send(animals);
      }

      const animals = await animalCollection.find(query).toArray();
      res.send(animals);
    });

    app.post("/animals", async (req, res) => {
      const animal = req.body;
      const result = await animalCollection.insertOne(animal);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Animal time server is running");
});

app.listen(port, () => {
  console.log(`Animal server is running on port: ${port}`);
});
