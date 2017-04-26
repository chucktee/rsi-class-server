// Load Chai
var assert = require('chai').assert;
var should = require('chai').should();
var expect = require('chai').expect;

// Load the api
var app = require('../api_server');

// Load Superagent / Supertest
const request = require('supertest');

// Test our VCRUD-L (login)
var test_email = 'test@test.com';
var test_password = 'testpassword';
var test_customer_id = '';
var test_first_name = 'First';


// Version
describe('GET /api/customer-version', function() {
    it('respond with json', function(done){
    
    request(app)
        .get('/api/cart-version')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done); 
    });
});

// Create
describe('POST /api/customer', function() {
    it('successfully create a customer', function(done) {
    
    request(app)
        .post('/api/customer')
        .set('Content-Type', 'application/json')
        .send( {'data':{'email': test_email, 'password': test_password }} )
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
            if(err) throw err;
            // We should get back
            //{result: 'success', data:{ id : id }}
            expect(res.body.result).to.equal('success');
            expect(res.body.data).to.be.an('object');
            expect(res.body.data.id.length).to.be.above(0);
            test_customer_id = res.body.data.id;
            done();
        });
    });
});

// Create - Duplicate test
describe('POST /api/customer', function() {
    it('successfully trap a duplicate on create a customer', function(done) {
    
    request(app)
        .post('/api/customer')
        .set('Content-Type', 'application/json')
        .send( {'data':{'email': test_email, 'password': test_password }} )
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400, done);
    });
});

// Successful Login
describe('POST /api/login', function() {
    it('respond with 200 and the customer id', function(done) {
    
    request(app)
        .post('/api/login')
        .set('Content-Type', 'application/json')
        .send({'email': test_email, 'password': test_password })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
            if(err) throw err;
            // We should get back
            //{result: 'success', data:{ customer : customer }}
            expect(res.body.result).to.equal('success');
            expect(res.body.data).to.be.an('object');
            expect(res.body.data.customer.length).to.be.above(0);
            done();
        });
    });
});

// Unsuccessful Login, bad password valid account
describe('POST /api/login', function() {
    it('successfully trap an unsuccessful login by returning a 403 and empty customer info', function(done) {
    
    request(app)
        .post('/api/login')
        .set('Content-Type', 'application/json')
        .send({'email': test_email, 'password': 'badpassword' })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(403)
        .end(function(err, res) {
            if(err) throw err;
            // We should get back a 403
            //{result: 'success', data:{ customer : []] }}
            expect(res.body.result).to.equal('success');
            expect(res.body.data).to.be.an('object');
            expect(res.body.data.customer.length).to.equal(0);
            done();
        });
    });
});

// Unsuccessful Login, invalid account
describe('POST /api/login', function() {
    it('successfully trap an unsuccessful login by returning a 403 and empty customer info', function(done) {
    
    request(app)
        .post('/api/login')
        .set('Content-Type', 'application/json')
        .send({'email': 'unknown@unknown.com', 'password': 'badpassword' })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(403)
        .end(function(err, res) {
            if(err) throw err;
            // We should get back a 403
            //{result: 'success', data:{ customer : []] }}
            expect(res.body.result).to.equal('success');
            expect(res.body.data).to.be.an('object');
            expect(res.body.data.customer.length).to.equal(0);
            done();
        });
    });
});

// Read
describe('GET /api/customer', function() {
    it('respond with 200 and a JSON array of customer data', function(done) {

    request(app)
        .get('/api/customer/' + test_customer_id)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
            if(err) throw err;
            // We should get back
            //{result: 'success', data:{ customer : items }}
            expect(res.body.result).to.equal('success');
            expect(res.body.data).to.be.an('object');
            expect(res.body.data.customer.length).to.be.above(0);
            //expect(res.body.data.customer.id).to.equal(test_customer_id);
            done();
        });
    });
});

// Update
describe('PUT /api/customer', function() {
    it('respond with 200 and a JSON object containing the customer id', function(done) {

    request(app)
        .put('/api/customer/')
        .set('Content-Type', 'application/json')
        .send( {'data':{'id_customer': test_customer_id, 'first_name': test_first_name }} )
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
            if(err) throw err;
            // We should get back
            //{result: 'success', data:{ id : id }}
            expect(res.body.result).to.equal('success');
            expect(res.body.data).to.be.an('object');
            expect(res.body.data.id.length).to.be.above(0);
            //expect(res.body.data.customer.id).to.equal(test_customer_id);
            done();
        });
    });
});

// Delete
describe('DELETE /api/customer', function() {
    it('respond with 200 and a JSON object with a deleted count of 1', function(done) {

    request(app)
        .delete('/api/customer/' + test_customer_id)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
            if(err) throw err;
            // We should get back
            //{result: 'success', data:{ count : n }}
            expect(res.body.result).to.equal('success');
            expect(res.body.data).to.be.an('object');
            expect(res.body.data.count).to.equal(1);
            done();
        });
    });
});





