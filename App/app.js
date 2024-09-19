const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
const dbName = 'mydb';

async function run() {
  try {
    await client.connect();
    console.log('Connected to MongoDB!');
    const db = client.db(dbName);
    
    // Drop the "products" collection if it exists
    await db.collection('products').drop().catch(() => {
      console.log('No collection to drop. Skipping.');
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

run();
