const axios = require('axios');

async function updateProduct() {
  const updatedProduct = {
    name: 'Updated Product 1',
    description: 'Updated description',
    price: 25.99,
    units: 150
  };

  const productId = '<MongoObjectId>'; // Replace with actual ObjectId

  try {
    const response = await axios.put(`http://localhost:3000/products/${productId}`, updatedProduct);
    console.log('Updated:', response.data);
  } catch (error) {
    console.error('Error updating product:', error.response ? error.response.data : error.message);
  }
}

updateProduct();
