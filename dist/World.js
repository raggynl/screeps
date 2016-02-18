var RoomController = require('Room');

function WorldController(){
  this.rooms =[];
  this.creeps =[];//Creeps that are controlled to the World Controller instead of Room Controller
  //this.TotalCreepsCount;
  if(!Memory.world){
    Memory.world = {};
    Memory.world.scouted = [];
  }
  this.loadRooms();
}
WorldController.prototype.loadRooms = function(){
  for(var name in Game.rooms) {
    var r = Game.rooms[name];
    var room = new RoomController(r, this);
    this.rooms.push(room)

  }
}
WorldController.prototype.addCreepToWorld = function(creep){
  this.creeps.push(creep);

}
WorldController.prototype.act = function(){
  for(var r in this.rooms){
    var room = this.rooms[r];
    room.colonize();
    room.towersAct();
    room.creepsAct();
  }
  for(var c in this.creeps){
    var creep = this.creeps[c]
    creep.worldAct();
  }
}
WorldController.prototype.requestCreep = function(target, creepRole){
  for(var r in this.rooms){
    var room = this.rooms[r];
    if(room.requestCreep(target, creepRole))
      return true;
  }
  return false
}
module.exports = WorldController;
