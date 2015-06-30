const PORT = 80;

var path = require('path');

var express = require('express');
var bodyParser = require('body-parser')
var config = require('./config.json');

var Slack = require('slack-node');

var slackToken = config.slack.token;

slack = new Slack(slackToken);

var app = express();

app.set('views', './')
app.set('view engine', 'jade')

app.use(express.static('public'));

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/', function (req, res) {
    res.render('index', { title: 'Hey', message: 'Hello there!'});
    //res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/', function (req, res) {

    //get anyone who's ever IM'd you
    slack.api('im.list', function(err, response){
      var channels = [];

      for( var channelIndex in response.ims ){
        if( response.ims.hasOwnProperty( channelIndex ) ){
          var channel = response.ims[channelIndex]
          if( channel.is_user_deleted == false ){
            channels.push( channel.id );
          }
        }
      }

      var messages = [];
      var messageCount = 0;

      //for each person get a history of their messages
      for( var i=0; i< channels.length; i++ ){

        slack.api('im.history', {
          channel:channels[i]
        }, function(err, response){
          if( response["messages"].length > 0 ){
            messages.push( response );
          }
          messageCount++;

          if( messageCount == channels.length ){
            res.json( messages );
            res.end();
          }
        });
      }
    });
});

var server = app.listen(PORT, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
