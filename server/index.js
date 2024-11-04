import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://teandaichaka:4ot6zfgD89MU5BBc@cluster0.godtpso.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

connectDB();

const db = client.db("zimex");
const productsCollection = db.collection("products");
const usersCollection = db.collection("users_zx");

// Products endpoints
app.get('/api/products', async (req, res) => {
  try {
    const products = await productsCollection.find({}).toArray();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const product = {
      ...req.body,
      createdAt: new Date().toISOString()
    };
    const result = await productsCollection.insertOne(product);
    res.status(201).json({ ...product, _id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products/seller/:sellerId', async (req, res) => {
  try {
    const products = await productsCollection.find({
      sellerId: req.params.sellerId
    }).toArray();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Auth endpoints
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await usersCollection.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (password === user.password) {
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await usersCollection.findOne({ email });
    
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    
    const newUser = {
      ...req.body,
      createdAt: new Date().toISOString()
    };
    
    const result = await usersCollection.insertOne(newUser);
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({ ...userWithoutPassword, _id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});