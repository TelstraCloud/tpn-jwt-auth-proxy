<!--
title: TPN JWT Authentication Proxy
description: This example demonstrates how to use AWS lambda and the Serverless framework to create a JWT authentication compatibility layer for TPN.
layout: Doc
-->
# TPN JWT Authentication Proxy

This example demonstrates how to use AWS lambda and the Serverless framework
to create a JWT authentication compatibility layer for TPN.

The key benefit for consuming applications is that the JWT contains the token
expiry enabling clients to request a new JWT prior to expiry.

## Deploy

In order to deploy the you endpoint simply run

```bash
npm install
serverless deploy
```

The expected result should be similar to:

```bash
Serverless: Packaging service...
Serverless: Excluding development dependencies...
Serverless: Uploading CloudFormation file to S3...
Serverless: Uploading artifacts...
Serverless: Uploading service .zip file to S3 (1.6 MB)...
Serverless: Validating template...
Serverless: Updating Stack...
Serverless: Checking Stack update progress...
..................................................................
Serverless: Stack update finished...
Service Information
service: tpn-jwt-auth-proxy
stage: dev
region: us-east-1
stack: tpn-jwt-auth-proxy-dev
api keys:
  None
endpoints:
  POST - https://k7lb3fxxxx.execute-api.us-east-1.amazonaws.com/dev/1.0.0/auth/generatejwt
  GET - https://k7lb3fxxxx.execute-api.us-east-1.amazonaws.com/dev/1.0.0/auth/generatejwt
  ANY - https://k7lb3fxxxx.execute-api.us-east-1.amazonaws.com/dev/{proxy+}
functions:
  generateJWT: tpn-jwt-auth-proxy-dev-generateJWT
  proxyRequests: tpn-jwt-auth-proxy-dev-proxyRequests
```
`https://k7lb3fxxxx.execute-api.us-east-1.amazonaws.com/dev` is the proxy
endpoint to be used for TPN API calls.

## Usage

You can now authenticate against the jwt endpoint and receive a JWT instead of
an access token. Replace the strings [X] with your values.

```bash
curl -d '{"username":"[username]","password":"[password]","domain":"[domain]"}' \
  https://k7lb3fxxxx.execute-api.us-east-1.amazonaws.com/dev/1.0.0/auth/generatejwt
```

The api key can also be sent as an Authorization header.

```bash
curl -H 'Authorization: Bearer {"username":"[username]","password":"[password]","domain":"[domain]"}' \
  https://k7lb3fxxxx.execute-api.us-east-1.amazonaws.com/dev/1.0.0/auth/generatejwt
```

The response will be JSON containing:
- the JWT as a field called `access_token`.
- how long until the token expires in seconds called `expires_in`. 

```bash
{ 
  access_token: [your JWT]
  expires_in: [seconds until JWT expiry]
}
```

The JWT contains the access token as a field. https://jwt.io can be used to
decode the token.

```json
{
  "access_token": "13d29b20cd68ff60f2b74c6b735exxxx",
  "iss": "issuer",
  "sub": "subject",
  "aud": "audience",
  "iat": 1524525932,
  "exp": 1524532600
}
```

You can now make requests for other TPN resources and pass the JWT instead of
the access token. E.g. to get a list of all Topologies:

```bash
curl -X GET \
  https://k7lb3fxxxx.execute-api.us-east-1.amazonaws.com/dev/ttms/1.0.0/topology_tag \
  -H 'Authorization: Bearer [your JWT]'
```

Aside from the change of endpoint (to your Lambda's API Gateway endpoint)
and the access token being replaced by the JWT using the TPN API is identical
to using it directly.