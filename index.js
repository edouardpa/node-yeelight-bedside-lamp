var noble = require("noble");
var debug = require("debug");

var BS_LAMP_NAME = 'XMCTD_';
var SERVICE_UUID = '8e2f0cbd1a664b53ace6b494e25f87bd';
var NOTIFY_CHARACT_UUID = '8f65073d9f574aaaafea397d19d5bbeb';
var COMMAND_CHARACT_UUID = 'aa7d3f342d4f41e0807f52fbf8cf7443';

function YeelightBluetooth() {
  this.DiscoverCallback = null;
}

YeelightBluetooth.Discover = function(callback, timeout) {
  this.DiscoverCallback = callback;
  
  noble.startScanning();
  
  var _timeout = 5000;
  
  if(timeout != null){
    _timeout = timeout;
  }
  
  setTimeout(function() {
    console.log('timeout : stop scan !')
    noble.stopScanning();
  }, _timeout);
}

YeelightBluetooth.Connect = function(peripheral, callback) {
  var lamp = new YeelightLamp(peripheral);
  
  callback(lamp);
}

noble.on('discover', function(peripheral) {
  console.log('Found device with local name: ' + peripheral.advertisement.localName);
  console.log('advertising the following service uuid\'s: ' + peripheral.advertisement.serviceUuids);
  console.log();

  if(peripheral.advertisement.localName == BS_LAMP_NAME) {
    YeelightBluetooth.DiscoverCallback(peripheral);
  }
});

function YeelightLamp(peripheral) {
  var self = this;
  
  this.peripheral = peripheral;
  this.notifCallback = null;
  this.connectPairCallback = null;
  this.lampStateCallback = null;
  
  function parsePairingStatus(pairStatusString){
    if(pairStatusString == '01')
      return YeelightLamp.ConnectPairEnum.UNAUTHORIZED;
    else if(pairStatusString == '02')
      return YeelightLamp.ConnectPairEnum.PAIRED;
    else if(pairStatusString == '04')
      return YeelightLamp.ConnectPairEnum.AUTHORIZED;
    else if(pairStatusString == '07')
      return YeelightLamp.ConnectPairEnum.DISCONNECT_IMMINENT;
    else
      console.log('WARNING !!!!!!!!! : unknown code !');
  }
  
  function notificationReceived(data) {
    console.log('Notification : '+ data.toString('hex'));
    
    var packetType = data.toString('hex').substring(2,4);
    debug('DEBUG : (packet type)'+packetType);
    
    //TODO keep going on implementation
    if(packetType == '63' && self.connectPairCallback != null){
      var status = data.toString('hex').substring(4,6);
      debug('DEBUG : (status)'+status);
      
      self.connectPairCallback(parsePairingStatus(status));
        
      self.connectPairCallback = null;
    }
    else if(packetType == '45' && self.lampStateCallback != null){
      self.lampStateCallback(new LampStatus(data.toString('hex')));
      
      self.lampStateCallback = null;
    }
    else if(packetType == '45' && self.notifCallback != null)
      self.notifCallback(new LampStatus(data.toString('hex')));
    else if(packetType == '63' && self.notifCallback != null){
      var status = data.toString('hex').substring(4,6);
      
      self.notifCallback(parsePairingStatus(status));
    }
    else
      console.log('WARNING !!!!!!!!! : unknown packet type !');
  }
  
  self.peripheral.connect(function(error) {
    console.log('connected to peripheral: ' + peripheral.uuid);
    
    peripheral.on('disconnect', function() {
      console.log('peripheral "' + peripheral.uuid + '" disconnected');
    });

    peripheral.discoverServices(null, function(error, services) {
      console.log('discovered the following services:');
      for (var i in services) {
        console.log('  ' + i + ' uuid: ' + services[i].uuid);

        var _service = services[i];
        if(_service.uuid == SERVICE_UUID) {
          _service.discoverCharacteristics(null, function(error, characteristics) {
            console.log('discovered the following characteristics:');

            for(var i in characteristics) {
              console.log('  ' + i + ' uuid: ' + characteristics[i].uuid);

              if(characteristics[i].uuid == NOTIFY_CHARACT_UUID) {
                self.notifyCharact = characteristics[i];
                
                self.notifyCharact.on('data', notificationReceived);

                // true to enable notify
                self.notifyCharact.notify(true, function(error) {
                  console.log('notifications turned on');
                });
              }

              if(characteristics[i].uuid == COMMAND_CHARACT_UUID) {
                self.commandCharact = characteristics[i];
              }
            }
          });
        }
      }
    });
  });
  
  self.SetNotificationCallback = function(notCallback) {
    self.notifCallback = notCallback;
  }
  
  self.ConnectPair = function(callback) {
    self.connectPairCallback = callback;
    
    self.commandCharact.write(Buffer.from('436702000000000000000000000000000000', 'hex'), false, function(error) {
      if (!error) {
        console.log('pas error');
      } else {
        console.log('error');
      }
      console.log('send pairing command');
    });
  }
  
  self.TurnOn = function() {
    self.commandCharact.write(Buffer.from('434001000000000000000000000000000000', 'hex'), false, function(error) {
      if (!error) {
        console.log('pas error');
      } else {
        console.log('error');
      }
      console.log('send turn on command');
    });
  }
  
  self.TurnOff = function() {
    self.commandCharact.write(Buffer.from('434002000000000000000000000000000000', 'hex'), false, function(error) {
      if (!error) {
        console.log('pas error');
      } else {
        console.log('error');
      }
      console.log('send turn off command');
    });
  }
  
  self.LampState = function(callback) {
    self.lampStateCallback = callback;
    
    self.commandCharact.write(Buffer.from('434400000000000000000000000000000000', 'hex'), false, function(error) {
      if (!error) {
        console.log('pas error');
      } else {
        console.log('error');
      }
      console.log('send state get command');
    });
  }
  
  self.WhiteLight = function(temperature, brightness) {
    temperature = Number(temperature);
    brightness = Number(brightness);
    
    if(temperature < 1700 || temperature > 6500)
      throw "temperature value out of range (1700-6500)"
    if(brightness < 1 || brightness > 100)
      throw "brightness value out of range (1-100)"
      
    var tempHex = temperature.toString(16);
    if(tempHex.length < 4)
      tempHex = '0' + tempHex;
      
    var brightHex = brightness.toString(16);
    if(brightHex.length < 2)
      brightHex = '0' + brightHex;
    
    self.commandCharact.write(Buffer.from('4343' + tempHex + '' + brightHex + '00000000000000000000000000', 'hex'), false, function(error) {
      if (!error) {
        console.log('pas error');
      } else {
        console.log('error');
      }
      console.log('send warm light command');
    });
  }
  
  self.RGBLight = function(red, green, blue, brightness) {
    red = Number(red);
    green = Number(green);
    blue = Number(blue);
    brightness = Number(brightness);
    
    if(red < 0 || red > 255)
      throw "red value out of range (0-255)"
    if(green < 0 || green > 255)
      throw "green value out of range (0-255)"
    if(blue < 0 || blue > 255)
      throw "blue value out of range (0-255)"
    if(brightness < 1 || brightness > 100)
      throw "brightness value out of range (1-100)"
      
    var redHex = red.toString(16);
    if(redHex.length < 2)
      redHex = '0' + redHex;
      
    var greenHex = green.toString(16);
    if(greenHex.length < 2)
      greenHex = '0' + greenHex;
      
    var blueHex = blue.toString(16);
    if(blueHex.length < 2)
      blueHex = '0' + blueHex;
      
    var brightHex = brightness.toString(16);
    if(brightHex.length < 2)
      brightHex = '0' + brightHex;
    
    self.commandCharact.write(Buffer.from('4341' + redHex + '' + greenHex + '' + blueHex + '00' + brightHex + '0000000000000000000000', 'hex'), false, function(error) {
      if (!error) {
        console.log('pas error');
      } else {
        console.log('error');
      }
      console.log('send rgb light command');
    });
  }
}

YeelightLamp.ConnectPairEnum = {
  UNAUTHORIZED: 1,
  PAIRED: 2,
  AUTHORIZED: 3,
  DISCONNECT_IMMINENT: 4
};

function LampStatus(stringStatus) { //build a LampStatus object based on hex values
  var power = stringStatus.substring(4,6);
  
  if(power == '01')
    this.isOn = true;
  else if(power == '02')
    this.isOn = false;
  
  var mode = stringStatus.substring(6,8);
  
  if(mode == '01'){
    this.mode = LampStatus.ModeEnum.RGB;
    
    var _color = stringStatus.substring(8,14);
    var _brightness = stringStatus.substring(16,18);
    
    this.properties = {color: _color, brightness: parseInt(_brightness, 16)};
  }
  else if(mode == '02'){
    this.mode = LampStatus.ModeEnum.WHITE;
    
    var _temperature = stringStatus.substring(18, 22);
    var _brightness = stringStatus.substring(16,18);
    
    this.properties = {temperature: parseInt(_temperature, 16), brightness: parseInt(_brightness, 16)};
  }
  else if(mode == '03')
    this.mode = LampStatus.ModeEnum.FLOW;
}

LampStatus.ModeEnum = {
  RGB: 1,
  WHITE: 2,
  FLOW: 3
};

exports.YeelightLamp = YeelightLamp;
exports.YeelightBluetooth = YeelightBluetooth;
