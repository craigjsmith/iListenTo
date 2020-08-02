const AWS = require('aws-sdk');
var axios = require('axios');
var qs = require('qs');

const docClient = new AWS.DynamoDB.DocumentClient({region:'us-east-2'});
var list = [];
var token;

let refresh_token = process.env.REFRESH_TOKEN

exports.handler = async function(event) {
  
  // Get Access Token using Refresh Token
  const data = {
        grant_type: "refresh_token",
        refresh_token: refresh_token,
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
    
    console.log("ACCESS TOKEN" + response.data.access_token);
    token = response.data.access_token;
  }
  catch(err) {
    console.log("ERROR" + err);
  }
  
  
// Use Access Token to get recently played songs
  try {
    const response = await axios.get(
      "https://api.spotify.com/v1/me/player/recently-played?limit=50", {
      headers: {
        "Authorization": "Bearer " + token
      }
    });
    
    var i = 0
    // Add all recently played songs to array
    while(response.data.items[i] != undefined) {
        list.push(response.data.items[i].track.name);
        i = i + 1;
    }
  }
  catch(e) {
    console.log("ERROR " + e);
  }
    
  // Append recently played songs to db
  var updateParams = {
    TableName: 'ilistento_test',
    Key: { "user": "craig" },
    UpdateExpression: 'set #playlist = list_append(if_not_exists(#playlist, :empty_list), :location)',
    ExpressionAttributeNames: {
      '#playlist': 'playlist'
    },
    ExpressionAttributeValues: {
      ':location': list,
      ':empty_list': []
    }
  }
            
  try {
    await docClient.update(updateParams).promise()
  }
  catch(error) {
      console.error("Error:", error);
  }

}