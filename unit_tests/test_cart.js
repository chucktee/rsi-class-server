// Load Chai
var assert = require('chai').assert;
var should = require('chai').should();
var expect = require('chai').expect;

// Load the api
var app = require('../api_server');

// Load Superagent / Supertest
const request = require('supertest');

// Setup 2 vars to begin test
var test_id_customer = '123';
var test_id_prpoduct = '871c7ad9-1f7e-471a-a52c-fe86c6db7f74';
var id_cart_record;
var quantity_in_cart;

// Test our VCRUD

// Version
describe('GET /api/cart-version', function() {
    it('respond with json', function(done){
    
    request(app)
        .get('/api/cart-version')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done); 
    });
});


// Create - no customer id will fail
describe('POST /api/cart', function() {
    it('respond with a 400 trap', function(done) {
    
    request(app)
        .post('/api/cart')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400, done); 
    });
});


// Create - succeed
describe('POST /api/cart', function() {
    it('respond with 200', function(done) {
    
    request(app)
        .post('/api/cart')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send( {'id_customer': test_id_customer, 'quantity': 1, 'id_product': test_id_prpoduct } )
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
            if(err) throw err;
            // We should get back
            //{result: 'success', data:{ id : id, quantity: quantity ...
            expect(res.body.result).to.equal('success');
            expect(res.body.data).to.be.an('object');
            expect(res.body.data.id).to.exist;
            expect(res.body.data.quantity).to.exist;
            expect(res.body.data.quantity).to.be.above(0);
            quantity_in_cart = res.body.data.quantity;
            id_cart_record = res.body.data.id;
            done();
        }); 
    });
});

// Add same item, check that quantity is incremented
// And that the id returned matches from the previous add
describe('POST /api/cart', function() {
    it('respond with 200, the id will be equal to the previous cart line edited and the quantity will be existing quantity plus 1', function(done) {
    
    request(app)
        .post('/api/cart')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send( {'id_customer': test_id_customer, 'quantity': 1, 'id_product': test_id_prpoduct } )
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
            if(err) throw err;
            // We should get back
            //{result: 'success', data:{ id : id, quantity: quantity ...
            expect(res.body.result).to.equal('success');
            expect(res.body.data).to.be.an('object');
            expect(res.body.data.id).to.exist;
            expect(res.body.data.id).to.equal(id_cart_record);
            expect(res.body.data.quantity).to.exist;
            expect(res.body.data.quantity).to.equal(quantity_in_cart + 1);
            done();
        }); 
    });
});

// Read
describe('GET /api/cart', function() {
    it('respond with 200 and a JSON array of items', function(done) {

    request(app)
        .get('/api/cart/' + test_id_customer)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
            if(err) throw err;
            // We should get back
            //{result: 'success', data:{ items : items }}
            expect(res.body.result).to.equal('success');
            expect(res.body.data).to.be.an('object');
            expect(res.body.data.items.length).to.be.above(0);
            done();
        });
    });
});

// Update Quantity directly
// Add same item, check that quantity is incremented
// And that the id returned matches from the previous add
describe('POST /api/cart', function() {
    it('respond with 200', function(done) {
    
    request(app)
        .put('/api/cart')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send( {'id': id_cart_record, 'quantity': 77 } )
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
});

// Add same item, check that quantity is incremented
// And that the id returned matches from the previous add
describe('POST /api/cart', function() {
    it('respond with 200, the id will be equal to the previous cart line edited and the quantity will be 78 to test that the update made it 77', function(done) {
    
    request(app)
        .post('/api/cart')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send( {'id_customer': test_id_customer, 'quantity': 1, 'id_product': test_id_prpoduct } )
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
            if(err) throw err;
            // We should get back
            //{result: 'success', data:{ id : id, quantity: quantity ...
            expect(res.body.result).to.equal('success');
            expect(res.body.data).to.be.an('object');
            expect(res.body.data.id).to.exist;
            expect(res.body.data.id).to.equal(id_cart_record);
            expect(res.body.data.quantity).to.exist;
            expect(res.body.data.quantity).to.equal(78);
            done();
        }); 
    });
});

// Delete
describe('DELETE /api/cart', function() {
    it('respond with 200 and a JSON object with a deleted count of 1', function(done) {

    request(app)
        .delete('/api/cart/' + id_cart_record)
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





