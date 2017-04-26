var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);

var yee = require('../index.js');

var LampDao = require('./dao/lampdao');

var path = require('path');

var periphs = [];
var yeeLamps = [];
var _socket;

function notifs(yeelightLamp, message){
  //TODO handle yeelightLamp to match the right in yeeLamps
  
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
    
    yee.YeelightBluetooth.discover(function(peripheral){
      socket.emit('discover', 'periph found : ' + peripheral.uuid);
      periphs.push(peripheral);
    });
  });
  
  socket.on('periph_co', function (message) {
    console.log('connect to periph : ' + message);
    
    yee.YeelightBluetooth.connect(periphs[message], function(yeeobj){
      yeeLamps.push(yeeobj);
      yeeobj.setNotificationCallback(notifs);
    });
  });
  
  socket.on('co_pair', function(message) {
    console.log('co pair !!');
    yeee.connectPair(function(result) { //TODO handle it another way
      socket.emit('notifs', 'CO pair : ' + JSON.stringify(result));
    });
  });
  
  socket.on('turn_on', function(message) {
    console.log('turn on !!');
    yeee.turnOn();
  });
  
  socket.on('turn_off', function(message) {
    console.log('turn off !!');
    yeee.turnOff();
  });
  
  socket.on('white', function(message) {
    console.log('white');
    yeee.whiteLight(message.temperature, message.brightness);
  });
  
  socket.on('rgb', function(message) {
    console.log('RGB');
    yeee.rgbLight(message.red, message.green, message.blue, message.brightness);
  });
  
  socket.on('statusGet', function(message) {
    console.log('get status !!');
    yeee.lampState(function(status){
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
  
  startSequence();
});

function startSequence(){
  (new LampDao()).getLamps(function(lamps){
    if(lamps !== null || lamps.length > 0){
      yee.YeelightBluetooth.discover(function(peripheral){
        for(var i=0; i<lamps.length; i++){
          if(lamps[i].address == peripheral.address){
            lamps[i].state = stateEnum.THERE;
            
            lamps[i].peripheral = peripheral;
            
            yee.YeelightBluetooth.connect(peripheral, function(yeeobj){
              yeeLamps.push(yeeobj);
              yeeobj.setNotificationCallback(notifs);
            });
          }
          else{
            lamps[i].state = stateEnum.NOT_THERE;
          }
        }
      });
    }
  });
}

var stateEnum = {
  THERE: 1,
  NOT_THERE: 2
};
