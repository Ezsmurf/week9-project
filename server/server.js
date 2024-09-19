const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 3000;

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
const dbName = 'mydb';

// Middleware
app.use(cors());
app.use(bodyParser.json());

let db, collection;

// Connect to MongoDB
async function connectDB() {
  try {
    await client.connect();
    db = client.db(dbName);
    collection = db.collection('products');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }
}

connectDB();

// Route 1: Get all products
app.get('/products', async (req, res) => {
  try {
    const products = await collection.find().toArray();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Route 2: Add a new product (check for duplicate 'id')
app.post('/products', async (req, res) => {
  const { id, name, description, price, units } = req.body;
  try {
    const existingProduct = await collection.findOne({ id });
    if (existingProduct) {
      return res.status(400).json({ error: 'Product with this ID already exists' });
    }
    const newProduct = { id, name, description, price, units };
    await collection.insertOne(newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// Route 3: Remove a product by _id
app.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 1) {
      res.status(200).json({ message: 'Product deleted successfully' });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Route 4: Update a product by _id
app.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price, units } = req.body;

  try {
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { name, description, price, units } }
    );
    if (result.modifiedCount === 1) {
      res.status(200).json({ message: 'Product updated successfully' });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
