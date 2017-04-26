//sauvegarder le modele
var models = require('../models')

function LampDao () {
    this.saveLamp = function(callback){
        models.Lamp.create({
            name: 'LampName',
            address: 'XX:XX:XX:XX:XX'
        }).then(function() {
            if (callback != null)
                callback();
        });
    };
    
    this.getLamps = function(callback){
        models.Lamp.findAll().then(function(lamps) {
            callback(lamps);
        });
    }
};

module.exports = LampDao;
