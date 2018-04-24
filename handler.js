'use strict';
const tpn = require('tpn');
const JWT_SECRET = 'secret';

module.exports.generatejwt = (event, context, callback) => {
  console.log('generatejwt');
  console.log(event);
  console.log(`event.body: ${event.body}`);
  // remove "Bearer"
  const creds = JSON.parse(event.body);
  console.log(`creds: ${creds}`);
  tpn.generatetoken(creds['username'], creds['password'], creds['domain'], function(err, token) {
    console.log(`token: ${token}`);
    tpn.generatejwt(token, JWT_SECRET, function(err, jwt) {
      // TODO handle err
      console.log(`jwt: ${jwt}`);
      callback(err, {
        statusCode: 200,
        body: jwt,
      });
    });
  });
};

// proxies the requests to TPN transforming the Authorization header
module.exports.proxyRequests = (event, context, callback) => {
  console.log(event);
  const jwt = event.headers['Authorization'].substring(7);
  console.log(`jwt: ${jwt}`);
  tpn.extractAccessToken(jwt, JWT_SECRET, function(err, token) {
    console.log(`token: ${token}`);
    console.log(`tpn.proxyRequest: ${tpn.proxyRequest}`);
    // TODO handle err
    // TODO handle error when creating a topology and one already exists
    tpn.proxyRequest(event.httpMethod, event.path, token, event.body, callback);
  });
};
