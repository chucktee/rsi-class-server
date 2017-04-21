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







