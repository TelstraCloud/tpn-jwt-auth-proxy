'use strict';
const tpn = require('tpn');
const JWT_SECRET = 'secret';

module.exports.generatejwt = (event, context, callback) => {
  console.log('generatejwt');
  // console.log(event);
  console.log(`event.headers: ${JSON.stringify(event.headers)}`);
  console.log(`event.body: ${event.body}`);
  
  // if there is an Authorization header, get the credentials from there
  // otherwise get them from the body of the request
  let creds = null;
  if (event.headers.Authorization) {
    // remove "Bearer "
    creds = JSON.parse(event.headers['Authorization'].substring(7));
  } else {
    creds = JSON.parse(event.body);
  }
  console.log(`creds: ${JSON.stringify(creds)}`);
  const token = {
    "token_type": "bearer",
    "expires_in": 6555,
    "refresh_token": "e8995999df115d8cc67aba2c1c6d2f79",
    "access_token": "FAKE token for testing",
  };
  console.log(`token: ${JSON.stringify(token)}`);
  tpn.generatejwt(token, JWT_SECRET, function(err, jwt) {
    // TODO handle err
    console.log(`jwt: ${jwt}`);
    callback(err, {
      statusCode: 200,
      body: jwt,
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
    // TODO handle err
    // TODO handle error when creating a topology and one already exists
    callback(err, token);
  });
};
