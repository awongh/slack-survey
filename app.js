const PORT = 80;

var express = require('express');
var bodyParser = require('body-parser')
var app = express();

var mongo = require('mongodb').MongoClient;

var mongourl = 'mongodb://localhost:27017/slack';

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.get('/channel/:channel', function (req, res) {
  var channel = req.params.channel;

  if (!req.params.channel) return res.sendStatus(400)

  var query = { 'channel' : channel };

  mongo.connect(mongourl, function(err, db) {
    console.log("Connected correctly to server for query");

    findDocuments(db, query, function(result){
      console.log("insert:", result);
      res.send(result);
    });
  });
});

app.post('/', urlencodedParser, function (req, res) {

  if (!req.body) return res.sendStatus(400)

  mongo.connect(mongourl, function(err, db) {
    console.log("Connected correctly to server");

    var channel = req.body.channel_name;

    var data = {
      channel : channel,
      message : req.body
    };

    insertDocuments(db, data, function(result){
      console.log("insert:", result);
      res.send('Hello Post World!');
    });
  });
});

var server = app.listen(PORT, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

var insertDocuments = function(db, data, callback) {
  // Get the documents collection
  var collection = db.collection('slack');
  // Insert some documents
  collection.insert(data, function(err, result) {
    callback(result);
    db.close();
  });
};

var findDocuments = function(db, query, callback){
 // Get the documents collection
  var collection = db.collection('slack');
  // Insert some documents
  collection.find(query)
    .toArray(function(err, docs) {

      if (!err) {
        callback(docs);
        db.close();

      }else{
        console.log( 'EEERRRRRR' );
      }
  });
};
