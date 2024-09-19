const axios = require('axios');

async function removeProduct() {
  const productId = '66eb9adc83fe27aa00246e9a'; // Replace with actual ObjectId

  try {
    const response = await axios.delete(`http://localhost:3000/products/${productId}`);
    console.log('Deleted:', response.data);
  } catch (error) {
    console.error('Error deleting product:', error.response ? error.response.data : error.message);
  }
}

removeProduct();
