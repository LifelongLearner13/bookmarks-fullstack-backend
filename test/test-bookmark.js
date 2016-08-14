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
      });
  });
  it('should return an empty list initally for folder', function () {
    return chai.request(app)
      .get('/folders')
      .then(function (res) {
        console.log(res.body);
      });
  })
});
