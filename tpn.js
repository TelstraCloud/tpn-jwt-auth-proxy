var request = require('request');
var jwt = require('jsonwebtoken');
// request.debug = true;
// require('request-debug')(request);

const TPN_BASE = 'https://penapi.pacnetconnect.com';

function generatetoken(username, password, domain, callback) {
  request.post(
    {
      url:`${TPN_BASE}/1.0.0/auth/generatetoken`,
      form: {
        username: `${domain}/${username}`,
        password: password,
        grant_type: 'password',
      }
    },
    function(err, httpResponse, body) {
      var token = JSON.parse(body);
      callback(err, token);
    }
  );
}

function generatejwt(token, secret, callback) {
  const payload = {
    access_token: token.access_token,
    iss: 'issuer',
    sub: 'subject',
    aud: 'audience',
  };
  jwt.sign(payload, secret, { expiresIn: token.expires_in }, callback);
}

// Validate jwt signature and return the access token
function extractAccessToken(token, secret, callback) {
  jwt.verify(token, secret, function(err, payload) {
    if (err) {
      console.log(`extractAccessToken err: ${err}`);  
      const response = {
        statusCode: 500,
        body: `Could not verify JWT. err: ${err}`,
      };
      callback(err, response);
    }
    console.log(`access_token: ${payload.access_token}`);
    callback(err, payload.access_token);
  });
}

// currently expects body as a string object and returns body as a string. This
// is a bit inconsistent
function proxyRequest(method, path, token, body, callback) {
  console.log('Request to TPN:');
  console.log(`  host: ${TPN_BASE}`);
  console.log(`  method: ${method}`);
  console.log(`  path: ${path}`);
  console.log(`  token: ${token}`);
  console.log(`  body: ${body}`);
  request({
    method: method,
    uri: `${TPN_BASE}${path}`,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body,
  },
  function (err, httpResponse, body) {
    const response = {
      statusCode: httpResponse.statusCode,
      body: body,
    };
    console.log('Response from TPN:');
    console.log(`  response: ${JSON.stringify(response)}`);
    callback(err, response);
  });
}

module.exports = {
  generatetoken: generatetoken,
  generatejwt: generatejwt,
  proxyRequest: proxyRequest,
  extractAccessToken: extractAccessToken,
};