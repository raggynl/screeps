var Helper = require('Helper');
var RoomController = require('Room');
var Creep = require('Creep');
var Stats = require('Stats');

var helper = new Helper();


module.exports.loop = function () {
  var helper = new Helper();
  helper.garbageCollector();

  // console.log("****************************************************************************************************************************************")
  // var stats = new Stats()
  // var dt = (new Date()).getTime();
  for(var name in Game.rooms) {
    var r = Game.rooms[name];
    var room = new RoomController(r);
    room.colonize();
    room.handleTowers();
    room.handleCreeps();

  }

  // var dt2 = (new Date()).getTime();
  // stats.loopTime = (dt2-dt)+" ms";
  // stats.debug();


}
//console.log(JSON.stringify(Game.cpu))
