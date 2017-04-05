var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);

var yee = require('../index.js');

var path = require('path');

var debug = require('debug')('../index.js');

var periphs = [];
var yeee;
var _socket;

function notifs(message){
  _socket.emit('notifs', 'notifs : '+ JSON.stringify(message));
}

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/site/index.html'));
});
app.use(express.static(__dirname + '/site'));

var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
  console.log('A client has connected !');
  
  _socket = socket;
  
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
      yeee.SetNotificationCallback(notifs);
    });
  });
  
  socket.on('co_pair', function(message) {
    console.log('co pair !!');
    yeee.ConnectPair(function(result) {
      socket.emit('notifs', 'CO pair : ' + JSON.stringify(result));
    });
  });
  
  socket.on('turn_on', function(message) {
    console.log('turn on !!');
    yeee.TurnOn();
  });
  
  socket.on('turn_off', function(message) {
    console.log('turn off !!');
    yeee.TurnOff();
  });
  
  socket.on('white', function(message) {
    console.log('white');
    yeee.WhiteLight(message.temperature, message.brightness);
  });
  
  socket.on('rgb', function(message) {
    console.log('RGB');
    yeee.RGBLight(message.red, message.green, message.blue, message.brightness);
  });
  
  socket.on('statusGet', function(message) {
    console.log('get status !!');
    yeee.LampState(function(status){
      socket.emit('status', 'Lamp : ' + JSON.stringify(status));
    });
  });
  
  socket.on('disconnect', function () {
    console.log('A client has diconnected !');
  });
});

server.listen(process.env.PORT || 50505, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log('Server listening at' + addr.address + ':' + addr.port);
});
