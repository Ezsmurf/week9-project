const { MongoClient } = require('mongodb');

async function connectToDB() {
  const uri = "mongodb://localhost:27017"; // Default local MongoDB URI
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  } finally {
    await client.close();
  }
}

connectToDB();
