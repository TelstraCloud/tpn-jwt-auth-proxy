const assert = require('assert');
const tpn = require('../tpn');

describe('TPN', function() {
  // describe('login to TPN', function() {
  //   it('should login and get token', function(done) {
  //     domain = 'xxxx';
  //     username = 'yyyy';
  //     password = 'zzzz';
  //     tpn.generatetoken(username, password, domain, function(err, token) {
  //       if (err) done(err);
  //       assert.equal(token.token_type, 'bearer');
  //       assert('expires_in' in token);
  //       assert('access_token' in token);
  //       done();
  //     });
  //   });
  // });
  // describe('generatejwt', function() {
  //   it('creates a jwt from a tpn token', function(done) {
  //     const token = {
  //       token_type: 'bearer',
  //       expires_in: 1608,
  //       refresh_token: 'e8995999df115d8cc67aba2c1c6dxxxx',
  //       access_token: 'aaedf388bc5ac5936454476f1a3dxxxx',
  //     };
  //     const secret = 'secret';
  //     tpn.generatejwt(token, secret, function(err, token) {
  //       console.log(token);
  //       done();
  //     });
  //   });
  // });
  // describe('proxyRequest', function() {
  //   it('proxy get topologies', function(done) {
  //     token = '2f91e4dcd1138452977f5c3db1xxxx';
  //     tpn.proxyRequest('GET', '/ttms/1.0.0/topology_tag', token, null, function(err, response) {
  //       console.log(response);
  //       done();
  //     });
  //   });
  //   it('proxy post topology', function(done) {
  //     token = '2f91e4dcd1138452977f5c3db1xxxx';
  //     body = {
  //       "name": "DS Test",
  //       "description": "David Sackett API testing"
  //     };
  //     tpn.proxyRequest('POST', '/ttms/1.0.0/topology_tag', token, body, function(err, response) {
  //       console.log(response);
  //       done();
  //     });
  //   });
  // });
});