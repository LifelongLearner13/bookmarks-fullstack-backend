global.databaseUrl = 'postgres://localhost:5432/bookmarks-dev';

var chai = require('chai');
var chaiHttp = require('chai-http');
var mocha = require('mocha');
var app = require('../server');
var pg = require('pg');

var should = chai.should();

chai.use(chaiHttp);

describe('Bookmark Endpoints', function () {
  it('should return an empty list initially', function() {
    return chai.request(app)
      .get('/bookmarks')
      .then(function (res) {
        res.should.have.status(200);
        res.type.should.equal('application/json');
        res.charset.should.equal('utf-8');
        res.body.should.be.an('array');
        res.body.length.should.equal(0);
      });
  });
  it('should return an empty list initally for folder', function () {
    return chai.request(app)
      .get('/folders')
      .then(function (res) {
        res.should.have.status(200);
        res.type.should.equal('application/json');
        res.charset.should.equal('utf-8');
        res.body.should.be.an('array');
        res.body.length.should.equal(0);
      });
  });
});
