var noble = require("noble");

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
  
  function notificationReceived(data) {
    console.log('Notification : '+ data.toString('hex'));
    
    var packetType = data.toString('hex').substring(2,4);
    //console.log('DEBUG : (packet type)'+packetType);
    
    //TODO keep going on implementation
    if(packetType == '63' && self.connectPairCallback != null){ //TODO make this part of code reusable
      var status = data.toString('hex').substring(4,6);
      //console.log('DEBUG : (status)'+status);
      
      if(status == '01')
        self.connectPairCallback(YeelightLamp.ConnectPairEnum.UNAUTHORIZED);
      else if(status == '02')
        self.connectPairCallback(YeelightLamp.ConnectPairEnum.PAIRED);
      else if(status == '04')
        self.connectPairCallback(YeelightLamp.ConnectPairEnum.AUTHORIZED);
      else if(status == '07')
        self.connectPairCallback(YeelightLamp.ConnectPairEnum.DISCONNECT_IMMINENT);
      else
        console.log('WARNING !!!!!!!!! : unknown code !');
        
      self.connectPairCallback = null;
    }
    else if(packetType == '45' && self.lampStateCallback != null){
      self.lampStateCallback(new LampStatus(data.toString('hex')));
      
      self.lampStateCallback = null;
    }
    else if(packetType == '45' && self.notifCallback != null)
      self.notifCallback(new LampStatus(data.toString('hex')));
    else if(packetType == '63' && self.notifCallback != null){ //TODO make this part of code reusable
      var status = data.toString('hex').substring(4,6);
      
      if(status == '01')
        self.notifCallback(YeelightLamp.ConnectPairEnum.UNAUTHORIZED);
      else if(status == '02')
        self.notifCallback(YeelightLamp.ConnectPairEnum.PAIRED);
      else if(status == '04')
        self.notifCallback(YeelightLamp.ConnectPairEnum.AUTHORIZED);
      else if(status == '07')
        self.notifCallback(YeelightLamp.ConnectPairEnum.DISCONNECT_IMMINENT);
      else
        console.log('WARNING !!!!!!!!! : unknown code !');
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
    
    self.commandCharact.write(Buffer.from('434002000000000000000000000000000000', 'hex'), false, function(error) {
      if (!error) {
        console.log('pas error');
      } else {
        console.log('error');
      }
      console.log('send turn off command');
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
    
    this.properties = {temperature: _temperature, brightness: _brightness};
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
