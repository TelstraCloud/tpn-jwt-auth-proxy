'use strict';
const tpn = require('tpn');
const JWT_SECRET = 'secret';

function logRequest(event) {
  console.log('Request:')
  console.log(`  method: ${event.requestContext.httpMethod}`)
  console.log(`  path: ${event.requestContext.path}`);
  console.log(`  headers: ${JSON.stringify(event.headers)}`);
  console.log(`  body: ${event.body}`);
}

module.exports.generatejwt = (event, context, callback) => {
  logRequest(event);
  
  // if there is an Authorization header, get the credentials from there
  // otherwise get them from the body of the request
  let creds = null;
  if (event.headers.Authorization) {
    // remove "Bearer "
    creds = JSON.parse(event.headers['Authorization'].substring(7));
  } else {
    creds = JSON.parse(event.body);
  }
  console.log(`TPN creds: ${JSON.stringify(creds)}`);
  tpn.generatetoken(creds['username'], creds['password'], creds['domain'], function(err, token) {
    if (err) {
      console.log(`generatetoken err: ${err}`);  
      const response = {
        statusCode: 500,
        body: `Could not generate access token from the JWT. err: ${err}`,
      };
      callback(err, response);
    }
    console.log(`TPN token: ${JSON.stringify(token)}`);

    tpn.generatejwt(token, JWT_SECRET, function(err, jwt) {
      if (err) {
        console.log(`generatejwt err: ${err}`);  
        const response = {
          statusCode: 500,
          body: `Could not generate JWT. err: ${err}`,
        };
        callback(err, response);
      }
      console.log(`jwt: ${jwt}`);
      callback(err, {
        statusCode: 200,
        body: JSON.stringify({ access_token: jwt }),
      });
    });
  });
};

// proxies the requests to TPN transforming the Authorization header
module.exports.proxyRequests = (event, context, callback) => {
  logRequest(event);
  const jwt = event.headers['Authorization'].substring(7);
  tpn.extractAccessToken(jwt, JWT_SECRET, function(err, token) {
    if (err) {
      console.log(`extractAccessToken err: ${err}`);
      const response = {
        statusCode: 500,
        body: `Could not extract access token from the JWT. err: ${err}`,
      };
      callback(err, response);
    }
    // TODO handle error when creating a topology and one already exists
    tpn.proxyRequest(event.httpMethod, event.path, token, event.body, callback);
  });
};