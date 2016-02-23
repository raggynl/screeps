var Helper = require('Helper');
var WorldController = require('World')
var Creep = require('Creep');

var helper = new Helper();


module.exports.loop = function () {
  var helper = new Helper();
  helper.garbageCollector();
  var world = new WorldController();
  world.act();
}
console.log(JSON.stringify(Game.cpu))
