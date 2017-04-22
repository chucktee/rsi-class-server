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

// Create
describe('POST /api/cart', function() {
    it('respond with a 400 trap', function(done) {
    
    request(app)
        .post('/api/cart')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400, done); 
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





