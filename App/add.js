const axios = require('axios');

async function addProducts() {
  const products = [
    { id: 1, name: 'Product 1', description: 'First product', price: 19.99, units: 100 },
    { id: 2, name: 'Product 2', description: 'Second product', price: 29.99, units: 50 },
    { id: 3, name: 'Product 3', description: 'Third product', price: 9.99, units: 200 }
  ];

  for (const product of products) {
    try {
      // Send a POST request to the Express server's /products endpoint
      const response = await axios.post('http://localhost:3000/products', product);
      console.log('Added:', response.data);
    } catch (error) {
      console.error('Error adding product:', error.response ? error.response.data : error.message);
    }
  }
}

addProducts();
