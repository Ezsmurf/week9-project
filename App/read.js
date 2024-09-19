const axios = require('axios');

async function fetchProducts() {
  try {
    const response = await axios.get('http://localhost:3000/products');
    console.log('Products:', response.data);
  } catch (error) {
    console.error('Error fetching products:', error.response ? error.response.data : error.message);
  }
}

fetchProducts();
