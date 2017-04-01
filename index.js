var noble = require("noble");

var BS_LAMP_NAME = 'XMCTD_';
var SERVICE_UUID = '8e2f0cbd1a664b53ace6b494e25f87bd';
var NOTIFY_CHARACT_UUID = '8f65073d9f574aaaafea397d19d5bbeb';
var COMMAND_CHARACT_UUID = 'aa7d3f342d4f41e0807f52fbf8cf7443';

function notificationReceived(data) {
  console.log('Notification : '+ data.toString('hex'));
  
  //TODO make use of notification
}

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
                
                self.notifyCharact.on('data', notificationReceived);//TODO voir comment utiliser ce callback

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
  
  self.ConnectPair = function() {
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
}

exports.YeelightLamp = YeelightLamp;
exports.YeelightBluetooth = YeelightBluetooth;
