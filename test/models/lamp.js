'use strict';

module.exports = function(sequelize, DataTypes) {
  var Lamp = sequelize.define('Lamp', {
    name: DataTypes.STRING,
    address: DataTypes.STRING
  }/*, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  }*/);
  
  Lamp.state = null;
  
  Lamp.peripheral = null;
  
  return Lamp;
};
