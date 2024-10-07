// test/productRoutes.test.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const { MongoClient } = require('mongodb');

chai.use(chaiHttp);
const expect = chai.expect;

const app = 'http://localhost:3000'; // Base URL for your API

// MongoDB connection details
const uri = 'mongodb://localhost:27017';
const dbName = 'mydb';
let db, collection;

before(async function() {
  // Connect to MongoDB before running tests
  const client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);
  collection = db.collection('products');
});

beforeEach(async function() {
  // Clear the products collection before each test
  await collection.deleteMany({});
});

describe('Product API Integration Tests', function() {

  // Add Product Test Cases
  describe('POST /products', function() {
    it('should add a product successfully', function(done) {
      const product = { id: 1, name: 'Test Product 1', description: 'A test product', price: 19.99, units: 100 };
      chai.request(app)
        .post('/products')
        .send(product)
        .end(function(err, res) {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('name', 'Test Product 1');
          done();
        });
    });

    it('should not add a product with duplicate ID', function(done) {
      const product = { id: 1, name: 'Test Product 1', description: 'A test product', price: 19.99, units: 100 };
      chai.request(app)
        .post('/products')
        .send(product)
        .end(function() {
          chai.request(app)
            .post('/products')
            .send(product) // Attempt to add the same product again
            .end(function(err, res) {
              expect(res).to.have.status(400);
              expect(res.body).to.have.property('error', 'Product with this ID already exists');
              done();
            });
        });
    });
  });

  // Fetch Products Test Cases
  describe('GET /products', function() {
    it('should fetch all products', function(done) {
      const products = [
        { id: 1, name: 'Product 1', description: 'First product', price: 19.99, units: 100 },
        { id: 2, name: 'Product 2', description: 'Second product', price: 29.99, units: 50 }
      ];

      collection.insertMany(products).then(() => {
        chai.request(app)
          .get('/products')
          .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body.length).to.equal(2);
            done();
          });
      });
    });

    it('should return an empty array if no products exist', function(done) {
      chai.request(app)
        .get('/products')
        .end(function(err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array').that.is.empty;
          done();
        });
    });
  });

  // Update Product Test Cases
  describe('PUT /products/:id', function() {
    it('should update a product successfully', function(done) {
      const product = { id: 1, name: 'Test Product', description: 'A product', price: 19.99, units: 100 };

      collection.insertOne(product).then(() => {
        const updatedProduct = { name: 'Updated Product', price: 25.99, units: 150 };
        chai.request(app)
          .put('/products/1') // Assuming product with ID 1 exists
          .send(updatedProduct)
          .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message', 'Product updated successfully');
            done();
          });
      });
    });

    it('should return 404 if product not found', function(done) {
      const updatedProduct = { name: 'Updated Product', price: 25.99, units: 150 };
      chai.request(app)
        .put('/products/9999') // Non-existent product ID
        .send(updatedProduct)
        .end(function(err, res) {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('error', 'Product not found');
          done();
        });
    });
  });

  // Delete Product Test Cases
  describe('DELETE /products/:id', function() {
    it('should delete a product successfully', function(done) {
      const product = { id: 1, name: 'Test Product', description: 'A product', price: 19.99, units: 100 };

      collection.insertOne(product).then(() => {
        chai.request(app)
          .delete('/products/1') // Assuming product with ID 1 exists
          .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message', 'Product deleted successfully');
            done();
          });
      });
    });

    it('should return 404 if product to delete is not found', function(done) {
      chai.request(app)
        .delete('/products/9999') // Non-existent product ID
        .end(function(err, res) {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('error', 'Product not found');
          done();
        });
    });
  });

});
