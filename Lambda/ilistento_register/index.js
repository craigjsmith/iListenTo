const AWS = require('aws-sdk');
var axios = require('axios');
var qs = require('qs');

const docClient = new AWS.DynamoDB.DocumentClient({region:'us-east-2'});

exports.handler = async function(event) {
    var token;
    var refresh;
    var uri;
    console.log(event.queryStringParameters.code)
    
//Get Access Token
  const data = {
        grant_type: "authorization_code",
        code : event.queryStringParameters.code,
        redirect_uri : "https://v0xce7s8uk.execute-api.us-east-2.amazonaws.com/live/token",
        client_id : process.env.CLIENT_ID,
        client_secret : process.env.CLIENT_SECRET,
  };

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      qs.stringify(data), {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    });
    
    token = response.data.access_token;
    refresh = response.data.refresh_token;
    console.log("ACCESS TOKEN" + token);
    console.log("REFRESH TOKEN" + refresh);
  }
  catch(e) {
    console.log("ERROR" + e);  
  }
   
  // Use Access Token
  try {
    const response = await axios.get(
      "https://api.spotify.com/v1/me", {
      headers: {
        "Authorization": "Bearer " + token
      }
    });
      
    uri = response.data.uri;
    console.log("URI" + uri);
  }
  catch(e) {
    console.log("ERROR" + e);  
  }

  //Put Params
  var putParams = {
      TableName: 'ilistento_accounts',
      Item:{
          "uri" : uri,
          "refresh_token" : refresh
      }
  }

  await docClient.put(putParams).promise();

}