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
  console.log(`extractAccessToken jwt.verify: ${jwt.verify}`);
  jwt.verify(token, secret, function(err, payload) {
    console.log(`err: ${err}`);
    console.log(`access_token: ${payload.access_token}`);
    callback(err, payload.access_token);
  });
}

// currently expects body as a string object and returns body as a string. This
// is a bit inconsistent
function proxyRequest(method, path, token, body, callback) {
  console.log('proxyRequest');
  console.log(`method ${method}`);
  console.log(`path ${path}`);
  console.log(`token ${token}`);
  console.log(`body ${body}`);
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
    console.log('=============================httpResponse=============================');
    console.log(httpResponse);
    console.log('============================= body =============================');
    console.log(body);
    const response = {
      statusCode: httpResponse.statusCode,
      body: body,
    };
    console.log('============================= response =============================');
    console.log(`response: ${JSON.stringify(response)}`);
    callback(err, response);
  });
}

module.exports = {
  generatetoken: generatetoken,
  generatejwt: generatejwt,
  proxyRequest: proxyRequest,
  extractAccessToken: extractAccessToken,
};