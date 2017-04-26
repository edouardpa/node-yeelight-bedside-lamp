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
  
  _socket.emit('notifs', 'notifs : '+ yeelightLamp.peripheral.name + ' - ' + JSON.stringify(message));
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
    periphs = [];
    
    yee.YeelightBluetooth.discover(function(peripheral){
      periphs.push(peripheral);
      
      socket.emit('discover', {name: peripheral.advertisement.localName, uuid: peripheral.uuid});
    });
  });
  
  socket.on('periph_co', function (message) {
    console.log('connect to periph : ' + message);
    
    for(var i=0; i<periphs.length; i++){
      if(periphs[i].uuid == message){
        yee.YeelightBluetooth.connect(periphs[i], function(yeeobj){
          yeeLamps.push(yeeobj);
          yeeobj.setNotificationCallback(notifs);
        });
      }
    }
  });
  
  socket.on('co_pair', function(message) {
    console.log('co pair !!');
    
    for(var i=0; i<yeeLamps.length; i++){
      console.log('UUID : '+yeeLamps[i].peripheral.uuid);
      
      if(yeeLamps[i].peripheral.uuid == message){
        yeeLamps[i].connectPair(function(yeelightLamp, result) {
          socket.emit('notifs', 'CO pair : '+ yeelightLamp.peripheral.name + ' - ' + JSON.stringify(result));
        });
      }
    }
  });
  
  socket.on('turn_on', function(message) {
    console.log('turn on !!');
    
    for(var i=0; i<yeeLamps.length; i++){
      console.log('UUID : '+yeeLamps[i].peripheral.uuid);
      
      if(yeeLamps[i].peripheral.uuid == message){
        yeeLamps[i].turnOn();
      }
    }
  });
  
  socket.on('turn_off', function(message) {
    console.log('turn off !!');
    
    for(var i=0; i<yeeLamps.length; i++){
      console.log('UUID : '+yeeLamps[i].peripheral.uuid);
      
      if(yeeLamps[i].peripheral.uuid == message){
        yeeLamps[i].turnOff();
      }
    }
  });
  
  socket.on('white', function(message) {
    console.log('white');
    
    for(var i=0; i<yeeLamps.length; i++){
      console.log('UUID : '+yeeLamps[i].peripheral.uuid);
      
      if(yeeLamps[i].peripheral.uuid == message){
        yeeLamps[i].whiteLight(message.temperature, message.brightness);
      }
    }
  });
  
  socket.on('rgb', function(message) {
    console.log('RGB');
    
    for(var i=0; i<yeeLamps.length; i++){
      console.log('UUID : '+yeeLamps[i].peripheral.uuid);
      
      if(yeeLamps[i].peripheral.uuid == message){
        yeeLamps[i].rgbLight(message.red, message.green, message.blue, message.brightness);
      }
    }
  });
  
  socket.on('statusGet', function(message) {
    console.log('get status !!');
    
    for(var i=0; i<yeeLamps.length; i++){
      console.log('UUID : '+yeeLamps[i].peripheral.uuid);
      
      if(yeeLamps[i].peripheral.uuid == message){
        yeeLamps[i].lampState(function(yeelightLamp, status){
          socket.emit('status', 'Lamp : '+ yeelightLamp.peripheral.name + ' - ' + JSON.stringify(status));
        });
      }
    }
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
