var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);

var yee = require('../index.js');

var path = require('path');

var periphs = [];
var yeee;

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/site/index.html'));
});
app.use(express.static(__dirname + '/site'));

var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
  console.log('A client has connected !');
  
  socket.on('search', function (message) {
    console.log('Search !!!');
    
    yee.YeelightBluetooth.Discover(function(peripheral){
      socket.emit('discover', 'periph found : ' + peripheral.uuid);
      periphs.push(peripheral);
    });
  });
  
  socket.on('periph_co', function (message) {
    console.log('connect to periph : ' + message);
    
    yee.YeelightBluetooth.Connect(periphs[message], function(yeeobj){
      yeee = yeeobj;
    });
  });
  
  socket.on('co_pair', function(message) {
    console.log('co pair !!');
    yeee.ConnectPair();
  });
  
  socket.on('turn_on', function(message) {
    console.log('turn on !!');
    yeee.TurnOn();
  });
  
  socket.on('disconnect', function () {
    console.log('A client has diconnected !');
  });
});

server.listen(process.env.PORT || 50505, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log('Server listening at' + addr.address + ':' + addr.port);
});
