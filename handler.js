'use strict';
const tpn = require('./tpn');
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
      return;
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
        return;
      }
      console.log(`jwt: ${jwt}`);
      callback(err, {
        statusCode: 200,
        body: JSON.stringify({ access_token: jwt, expires_in: token.expires_in }),
      });
      return;
    });
  });
};

// proxies the requests to TPN transforming the Authorization header
module.exports.proxyRequests = (event, context, callback) => {
  logRequest(event);
  if (!event.headers['Authorization']) {
    console.log('No Authorization header found');
    callback(null, {
      statusCode: 401,
      body: 'No authorization header provided.'
    });
    return;
  }
  const jwt = event.headers['Authorization'].substring(7);
  tpn.extractAccessToken(jwt, JWT_SECRET, function(err, token) {
    if (err) {
      console.log(`extractAccessToken err: ${JSON.stringify(err)}`);
      if (err.name === 'TokenExpiredError') {
        callback(null, {
          statusCode: 401,
          body: JSON.stringify(err),
        });
        return;
      } else if (err.name === 'JsonWebTokenError') {
        callback(null, {
          statusCode: 400,
          body: JSON.stringify(err),
        });
        return;
      } else {
        // hmmm not sure what's wrong!
        // Haven't made an upstream call yet so must be us!
        callback(null, {
          statusCode: 500,
          body: `Could not extract access token from the JWT. err: ${JSON.stringify(err)}`,
        });
        return;
      }
    } else {
      // TODO handle error when creating a topology and one already exists
      tpn.proxyRequest(event.httpMethod, event.path, token, event.body, callback);
      return;
    }
  });
};