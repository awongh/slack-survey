const PORT = 80;

var path = require('path');

var express = require('express');
var bodyParser = require('body-parser')

var OAuth = require('oauth');
var OAuth2 = OAuth.OAuth2;

var app = express();

app.use(express.static('public'));

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/gettoken', function (req, res) {

    var twitterConsumerKey = '3nfexeMqFXFbpjxlRAeA38cV7';

    var twitterConsumerSecret = 'Cfm8l81E8NewfIY4yvq2PNwh0ipaBXajARkDivZRoU0QXp9JCl';

    var oauth2 = new OAuth2(twitterConsumerKey,
      twitterConsumerSecret,
      'https://api.twitter.com/', 
      null,
      'oauth2/token', 
      null);

    oauth2.getOAuthAccessToken(
      '',
      {'grant_type':'client_credentials'},
      function (e, access_token, refresh_token, results){
        console.log('bearer: ',access_token);
        //done();

        res.json({ token: access_token});
    });
});

var server = app.listen(PORT, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
